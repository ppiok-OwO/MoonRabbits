import { getNaveMesh } from '../../init/navMeshData.js';
import { findPath } from '../../init/navMeshLoader.js';
import { getPlayerSession } from '../../session/sessions.js';
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

    // const playerSession = getPlayerSession();
    // const player = playerSession.getPlayer(socket);

    // if (!player) {
    //   return socket.emit(
    //     'error',
    //     new CustomError(
    //       ErrorCodes.USER_NOT_FOUND,
    //       '플레이어 정보를 찾을 수 없습니다.',
    //     ),
    //   );
    // }

    let navMesh = getNaveMesh(100);

    const targetPos = { x: targetPosX, y: targetPosY, z: targetPosZ };
    const currentPos = { x: startPosX, y: startPosY, z: startPosZ };

    // NavMesh 기반 경로 탐색
    const path = await findPath(navMesh, currentPos, targetPos);

    // let isValidPath;
    // if (path.length > 1) {
    //   player.setPath(path);
    //   isValidPath = true;
    // } else {
    //   isValidPath = false;
    // }

    // Jmeter용 빈 응답 패킷
    const packet = PACKET.S2CPlayerMove(path);
    socket.write(packet);
    console.log(packet);

    // return isValidPath;
  } catch (error) {
    console.error(error);
    handleError(socket, error);
  }
}

export default playerMoveHandler;
