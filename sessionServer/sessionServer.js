import net from 'net';
import { onConnection } from './events/onConnection.js';
import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import os from 'os';
import cluster from 'cluster';
import { addPlayer, getPlayer } from './session/playerSession.js';
import { addParty, getParty } from './session/partySession.js';

dotenv.config();

const PORT = 3800;
const HOST = '0.0.0.0';

const numWorkers = os.cpus().length;

// Redis 연결
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

if (cluster.isMaster) {
  console.log(`마스터 프로세스 PID: ${process.pid}`);

  // 네비게이션 서버는 마스터 프로세스에서만 실행
  const sessionServer = net.createServer(onConnection);

  sessionServer.listen(PORT, HOST, () => {
    console.log(`[세션 서버]가 ${HOST}:${PORT}에서 실행 중입니다.`);
  });

  // 워커 프로세스 생성
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `sessionWorker ${worker.process.pid} 종료됨 (code: ${code}, signal: ${signal}). 새로운 워커 생성.`,
    );
    cluster.fork();
  });
} else {
  console.log(`sessionWorker 프로세스 실행: PID ${process.pid}`);

  const worker = new Worker(
    'sessionQueue',
    async (job) => {
      console.log(`sessionJob 처리 중: ${job.id} (PID: ${process.pid})`);

      if (job.name === 'addPlayer') {
        const { serverIP, socketId, nickname } = job.data;
        addPlayer(new Player(serverIP, socketId, nickname));
      } else if (job.name === 'addParty') {
        const { partyId, partyLeaderId, memberCount, serverIP } = job.data;
        addParty(new Party(partyId, partyLeaderId, memberCount, serverIP));
      } else if (job.name === 'updatePlayer') {
        const { socketId, isLeader, partyId } = job.data;
        const player = getPlayer(socketId);
        player.setIsLeader(isLeader);
        player.setPartyId(partyId);
      } else if (job.name === 'joinParty') {
        const { partyId, socketId } = job.data;

        // 파티장이 속한 서버의 혼잡도 계산
        // 혼잡하지 않으면 true, 혼잡하면 false 반환
        return { status: true, partyId, socketId };
      } else if (job.name === 'joinParty') {
        const { partyId, partyLeaderId, memberCount, socketId } = job.data;
        const party = getParty(partyId);
        party.setPartyLeaderId(partyLeaderId);
        party.setMemberCount(memberCount);

        // 파티장이 속한 서버의 혼잡도 계산
        // 혼잡하지 않으면 true, 혼잡하면 false 반환
        return { status: true, partyId, partyLeaderId, memberCount, socketId };
      }
    },
    {
      concurrency: 2, // 각 프로세스에서 2개씩 처리
      connection,
    },
  );
}
