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
  recast = await Recast(); // nodemdules/recast-detour/recast.wasm 파일 초기화
  console.log('초기화 완료!');
})();

const playerMoveHandler = async (socket, packetData) => {
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

    // 초기화가 완료될 때까지 대기
    if (!recast) {
      recast = await Recast();
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

    // ✅ 데이터 검증
    console.log('Vertices Count:', navmeshData.vertices.length);
    console.log('Indices Count:', navmeshData.indices.length);

    if (navmeshData.vertices.length === 0) {
      throw new Error('NavMesh 데이터 오류: vertices가 비어 있습니다.');
    }
    if (navmeshData.indices.length % 3 !== 0) {
      throw new Error('NavMesh 데이터 오류: indices가 유효하지 않습니다.');
    }

    // ✅ AABB 범위 계산
    const bmin = { x: Infinity, y: Infinity, z: Infinity };
    const bmax = { x: -Infinity, y: -Infinity, z: -Infinity };

    navmeshData.vertices.forEach((v) => {
      bmin.x = Math.min(bmin.x, v.x);
      bmin.y = Math.min(bmin.y, v.y);
      bmin.z = Math.min(bmin.z, v.z);
      bmax.x = Math.max(bmax.x, v.x);
      bmax.y = Math.max(bmax.y, v.y);
      bmax.z = Math.max(bmax.z, v.z);
    });

    console.log('bmin:', bmin);
    console.log('bmax:', bmax);

    if (bmin.x === bmax.x || bmin.y === bmax.y || bmin.z === bmax.z) {
      throw new Error('AABB 범위 오류: 최소값과 최대값이 동일합니다.');
    }

    // ✅ NavMesh 설정
    const navConfig = new recast.rcConfig();
    navConfig.cs = 0.3; // 셀 크기
    navConfig.ch = 0.2; // 셀 높이
    navConfig.walkableHeight = 2; // 플레이어 높이
    navConfig.walkableClimb = 0.9; // 계단 높이
    navConfig.walkableRadius = 0.6; // 충돌 반경
    navConfig.maxEdgeLen = 12; // 최대 모서리 길이 (추가)
    navConfig.maxVertsPerPoly = 6; // 폴리곤 당 최대 정점 수 (추가)
    navConfig.tileSize = 64; // 타일 크기 (추가)
    navConfig.borderSize = 1; // 경계 크기 (추가)
    navConfig.minRegionArea = 8; // 최소 지역 크기 (추가)
    navConfig.mergeRegionArea = 20; // 병합 가능한 지역 크기 (추가)
    navConfig.bmin = bmin;
    navConfig.bmax = bmax;

    // ✅ 설정 값 검증
    if (navConfig.cs <= 0 || navConfig.ch <= 0) {
      throw new Error('NavMesh 설정 오류: cs 또는 ch 값이 0입니다.');
    }
    if (navConfig.tileSize <= 0 || navConfig.borderSize <= 0) {
      throw new Error('tileSize 또는 borderSize가 유효하지 않습니다.');
    }
    if (navConfig.maxVertsPerPoly <= 0) {
      throw new Error('maxVertsPerPoly 값이 0이거나 유효하지 않습니다.');
    }

    if (navConfig.cs <= 0 || navConfig.ch <= 0) {
      throw new Error('NavMesh 설정 오류: cs 또는 ch 값이 0입니다.');
    }

    // ✅ NavMesh 생성 및 빌드
    const navMesh = new recast.NavMesh();
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

    const pathPoints = [];
    for (let i = 0; i < path.getPointCount(); i++) {
      const point = path.getPoint(i);
      pathPoints.push({ x: point.x, y: point.y, z: point.z });
    }

    console.log('Generated Path:', pathPoints);

    const packet = Packet.S_Move(player.id, pathPoints);
    socket.write(packet);
  } catch (error) {
    console.error('이동 처리 중 오류 발생:', error);

    // ✅ 추가 디버깅 로그
    console.log('Error message:', error?.message);
    console.log('Error stack:', error?.stack);

    socket.emit(
      'error',
      new CustomError(
        ErrorCodes.HANDLER_ERROR,
        `플레이어 이동 처리 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}`,
      ),
    );
  }
};

export default playerMoveHandler;
