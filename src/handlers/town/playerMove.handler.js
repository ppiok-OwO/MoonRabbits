import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';
import { findPath, loadNavMesh } from '../../init/navMeshLoader.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';
import Packet from '../../utils/packet/packet.js';

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

    let objFileName = "";
    switch (player.getCurrentScene()) {
      case config.sceneCode.town:
        objFileName = "Town Exported NavMesh.obj";
        break;
      case config.sceneCode.aSector:
        objFileName = "Test Exported NavMesh.obj"
    }

    console.log(`현재 씬? : ${player.getCurrentScene()}`);
    console.log(`obj 파일명? : ${objFileName}`);

    const targetPos = { x: targetPosX, y: targetPosY, z: targetPosZ };
    const currentPos = { x: startPosX, y: startPosY, z: startPosZ };
    const navMesh = await loadNavMesh(objFileName);

    // NavMesh 기반 경로 탐색
    const path = await findPath(navMesh, currentPos, targetPos);

    let isValidPath;
    if (path.length > 1) {
      player.setPath(path);
      isValidPath = true;
    } else {
      isValidPath = false;
    }

    return isValidPath;
  } catch (error) {
    handleError(error);
  }
}

export default playerMoveHandler;
