import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import PACKET from '../packet/packet.js';
import { getPartySessions, getPlayerSession } from '../../session/sessions.js';

// Redis 연결
export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// BullMQ Queue 생성
export const sessionQueue = new Queue('sessionQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50, // 마지막 50개 Job만 유지
    removeOnFail: 50, // 마지막 50개 실패한 Job만 유지
  },
});

export const sessionQueueEvents = new QueueEvents('sessionQueue', {
  connection,
});

sessionQueueEvents.on('completed', async ({ jobId, returnvalue }) => {
  console.log(`sessionJob ${jobId} 이 완료되었습니다!`);
  const { jobName } = returnvalue;

  if (jobName === 'joinParty') {
    const { status, socketId } = returnvalue;

    const playerSession = getPlayerSession();
    const player = playerSession.getPlayerBySocketId(socketId);

    const socket = player.user.getSocket();

    if (!status) {
      const packet = PACKET.S2CChat(
        0,
        '해당 파티가 속한 서버가 혼잡하므로 참가할 수 없습니다.',
        'System',
      );

      return socket.write(packet);
    }

    // 서버 이동 패킷 전송하기
    // 클라이언트는 서버 이동 후, 알림 패킷 전송
    // 이동 패킷과 알림 패킷에는 partyId가 담겨 있음
    // 다른 서버에서 플레이어가 접속하면 레디스에서 서버를 이동한 플레이어인지 확인
    // 서버를 이동한 플레이어라면 나머지 파티 참가 프로세스 진행
  }
});
