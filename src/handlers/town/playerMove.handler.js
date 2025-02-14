import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';
import { findPath, loadNavMesh } from '../../init/navMeshLoader.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';

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
    const navMesh = await loadNavMesh('Town Exported NavMesh.obj');

    console.log('navMesh :', navMesh);

    // NavMesh 기반 경로 탐색
    const path = await findPath(navMesh, currentPos, targetPos);

    let isValidPath;
    if (path.length > 1) {
      player.setPath(path);
      isValidPath = true;
    }

    // const packet = Packet.S_Move(player.id, isValidPath);

    // const dungeonId = player.getDungeonId();
    // if (dungeonId) {
    //   // 만약 던전이면
    //   const dungeonSessions = getDungeonSessions();
    //   const dungeon = dungeonSessions.getDungeon(dungeonId);
    //   dungeon.notify(packet);
    // } else {
    //   // 던전이 아니면
    //   playerSession.notify(packet);
    // }
  } catch (error) {
    console.error(error);
  }
}

export default playerMoveHandler;
