import { getPlayerSession } from '../../session/sessions.js';
import { navigationQueue, queueEvents } from '../../utils/bullMQ/setting.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';

// 클라이언트상에서 어떤 지점을 클릭했을 때 실행
export async function playerMoveHandler(socket, packetData) {
  try {
    const {
      startPosX,
      startPosY,
      startPosZ,
      targetPosX,
      targetPosY,
      targetPosZ,
    } = packetData;

    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    if (!player) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    const targetPos = { x: targetPosX, y: targetPosY, z: targetPosZ };
    const currentPos = { x: startPosX, y: startPosY, z: startPosZ };
    const sectorCode = player.getSectorId();

    // NavMesh 기반 경로 탐색, BullMQ Queue에 길찾기 요청 추가
    const job = await navigationQueue.add('findPath', {
      sectorCode: sectorCode,
      start: currentPos,
      end: targetPos,
      socketId: socket.id, // 응답을 받을 클라이언트 식별자
    });

    console.log(`Job ${job.id}이 추가되었습니다.`);

    return true;
  } catch (error) {
    console.error(error);
    handleError(socket, error);
  }
}

// BullMQ Queue에서 Job 완료 이벤트를 감지하고 클라이언트에게 응답
queueEvents.on('completed', async ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} 이 완료되었습니다!`);

  const { path, socketId } = returnvalue;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayerBySocketId(socketId);

  if (player) {
    player.setPath(path);
  } else {
    console.error(`소켓ID에 해당하는 플레이어를 찾을 수 없습니다: ${socketId}`);
  }
});

export default playerMoveHandler;
