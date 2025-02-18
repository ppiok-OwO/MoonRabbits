import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';
import { findPath, loadNavMesh } from '../../init/navMeshLoader.js';
import { getDungeonSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';

export async function monsterLocationHandler(socket, packetData) {
  try {
    const { monsterId, transform } = packetData;

    // 던전 세션에서 몬스터 정보 가져오기
    const dungeonSessions = getDungeonSessions();
    const monster = dungeonSessions.getMonster(monsterId);

    if (!monster) {
      throw new CustomError(
        ErrorCodes.MONSTER_NOT_FOUND,
        '몬스터 정보를 찾을 수 없습니다.',
      );
    }

    // 몬스터의 현재 위치 업데이트
    monster.position.setPosition(
      transform.posX,
      transform.posY,
      transform.posZ,
    );

    // 다른 클라이언트들에게 몬스터 위치 정보 브로드캐스트
    socket.broadcast.emit(
      Packet.S2CMonsterLocation(monsterId, {
        posX: transform.posX,
        posY: transform.posY,
        posZ: transform.posZ,
        rot: transform.rot,
      }),
    );

    return true;
  } catch (error) {
    console.error('Monster location handler error:', error);
    throw new CustomError(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      '몬스터 위치 처리 중 오류가 발생했습니다.',
    );
  }
}
