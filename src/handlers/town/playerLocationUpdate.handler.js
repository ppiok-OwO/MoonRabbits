import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import makePacket from '../../utils/packet/makePacket.js';
import Packet from '../../utils/packet/packet.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

// 경로 탐색 성공: [
//   { x: 0, y: 0, z: 0 },
//   { x: 5, y: 0, z: 5 },
//   { x: 10, y: 0, z: 15 },
//   { x: 20, y: 0, z: 30 }
// ]

const playerLocationUpdateHandler = (socket, packetData) => {
  const { transform } = packetData;

  // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);
  if (!player) {
    socket.emit(
      'error',
      new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '플레이어 정보를 찾을 수 없습니다.',
      ),
    );
  }

  const path = player.getPath();
  if (path === null) {
    console.log('생성된 경로가 없음!!');
  } else {
    // transform의 좌표로부터 가장 가까운 path상의 좌표 구하기
    // 두 좌표 사이의 거리가 루트2보다 작아야 한다.
    let minDistance = Infinity;
    let closestPoint;
    path.forEach((point) => {
      const distance = calculateDistance(point, transform);
      minDistance = Math.min(minDistance, distance);
      closestPoint = { PosX: point.x, PosY: point.y, PosZ: point.z, rot: 320 };
    });
    if (minDistance > Math.sqrt(2)) {
      throw new CustomError(ErrorCodes.HANDLER_ERROR, '이동동기화가 잘못 됨!!');
    }

    const nextPos = calculateFuturePosition(transform);
    const nextTransForm = { ...nextPos.futurePosition, rot: transform.rot };

    // const packet = Packet.S_Location(player.id, closestPoint);
    const packet = Packet.S_Location(player.id, transform);

    const dungeonId = player.getDungeonId();
    if (dungeonId) {
      const dungeonSessions = getDungeonSessions();
      const dungeon = dungeonSessions.getDungeon(dungeonId);
      dungeon.notify(packet);
    } else {
      playerSession.notify(packet);
    }
  }
};

function calculateDistance(point1, transform) {
  const dx = point1.x - transform.PosX;
  const dy = point1.y - transform.PosY;
  const dz = point1.z - transform.PosZ;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateFuturePosition(transform) {
  // 1. Y축 회전 값(도 → 라디안 변환)
  const radians = (transform.rot * Math.PI) / 180;

  // 2. 단위 방향 벡터 계산 (XZ 평면 기준)
  const unitVector = {
    x: Math.sin(radians), // X 방향 단위 벡터
    y: 0, // Y축 이동 없음
    z: Math.cos(radians), // Z 방향 단위 벡터
  };

  // 3. 이동 거리 (속도 10f * 0.5초 = 5 유닛)
  const moveDistance = 10 * 0.5;

  // 4. 최종 위치 계산 (현재 좌표 + 이동 거리 * 단위 벡터)
  const futurePosition = {
    PosX: transform.PosX + unitVector.x * moveDistance,
    PosY: transform.PosY, // Y축 변화 없음
    PosZ: transform.PosZ + unitVector.z * moveDistance,
  };

  return {
    unitVector: unitVector,
    futurePosition: futurePosition,
  };
}

export default playerLocationUpdateHandler;
