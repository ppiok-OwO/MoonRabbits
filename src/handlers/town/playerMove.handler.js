import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import Packet from '../../utils/packet/packet.js';
import Recast from 'recast-detour';

let recast;
(async () => {
  recast = await Recast(); // 비동기 초기화
})();

const playerMoveHandler = (socket, packetData) => {
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

    const gameAssets = getGameAssets();
    const navmeshData = gameAssets.navmesh;

    if (
      !navmeshData ||
      !Array.isArray(navmeshData.vertices) ||
      !Array.isArray(navmeshData.indices)
    ) {
      console.error('NavMesh 데이터가 유효하지 않습니다:', navmeshData);
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.INVALID_NAVMESH,
          '유효하지 않은 NavMesh 데이터입니다.',
        ),
      );
    }

    const navMesh = new recast.NavMesh();
    const navConfig = new recast.rcConfig();
    navConfig.cs = 0.3; // 셀 크기 설정
    navConfig.ch = 0.2; // 셀 높이 설정

    // NavMesh 데이터 빌드
    navMesh.build(
      navmeshData.vertices.flatMap((v) => [v.x, v.y, v.z]),
      navmeshData.vertices.length,
      navmeshData.indices,
      navmeshData.indices.length,
      navConfig,
    );

    const start = new recast.Vec3(startPosX, startPosY, startPosZ);
    const end = new recast.Vec3(targetPosX, targetPosY, targetPosZ);

    const path = navMesh.computePathSmooth(start, end);

    if (!path || path.getPointCount() === 0) {
      return socket.emit(
        'error',
        new CustomError(ErrorCodes.PATH_NOT_FOUND, '경로를 찾을 수 없습니다.'),
      );
    }

    const pathPoints = [];
    for (let i = 0; i < path.getPointCount(); i++) {
      const point = path.getPoint(i);
      pathPoints.push({ x: point.x, y: point.y, z: point.z });
    }

    console.log('Generated Path:', pathPoints);

    const packet = Packet.S_Move(player.id, pathPoints);
    socket.write(packet);
  } catch (error) {
    console.error('이동 처리 중 오류:', error);
    socket.emit(
      'error',
      new CustomError(
        ErrorCodes.HANDLER_ERROR,
        '플레이어 이동 처리 중 오류가 발생했습니다.',
      ),
    );
  }
};

export default playerMoveHandler;
