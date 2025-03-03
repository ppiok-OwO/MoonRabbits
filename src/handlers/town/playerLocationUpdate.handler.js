import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';

// !!! 패킷 변경에 따라 S_Chat -> S2CChat, S_Location -> S2CPlayerLocation으로 일괄 수정해씀다

// 경로 탐색 성공: [
//   { x: 0, y: 0, z: 0 },
//   { x: 5, y: 0, z: 5 },
//   { x: 10, y: 0, z: 15 },
//   { x: 20, y: 0, z: 30 }
// ]

// 이동중이라면 10프레임마다 location 패킷 전송
const playerLocationUpdateHandler = (socket, packetData) => {
  try {
    const { transform } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
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

    const path = player.getPath();
    if (path === null) {
      console.log('생성된 경로가 없음!!');
      player.setPosition(transform);
    } else {
      // transform의 좌표로부터 가장 가까운 path상의 좌표 구하기
      // 두 좌표 사이의 거리가 루트2(대락 1.4)보다 작아야 한다.
      let minDistance = Infinity;
      let closestPoint = null;
      path.forEach((point) => {
        const distance = calculateDistance(point, transform);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = { PosX: point.x, PosY: point.y, PosZ: point.z }; // transform과 가장 가까운 경로상의 좌표
        }
      });

      const latency = player.user.getLatency() / 1000;
      const predictedPos = predictPosition(socket, player, transform, latency);

      // 추측항법이 끝난 뒤에 플레이어 포지션 업데이트
      player.setPosition(transform);

      if (minDistance > 1.4) {
        // 플레이어의 위치가 오차범위를 벗어났다면 closestPoint로 재조정한다.
        const newTransform = {
          posX: closestPoint.PosX,
          posY: closestPoint.PosY,
          posZ: closestPoint.PosZ,
          rot: transform.rot,
        };
        player.setPosition(newTransform);

        const packet = PACKET.S2CPlayerLocation(
          player.id,
          newTransform,
          false,
          player.getSectorId(),
        );

        const sectorCode = player.getSectorId();
        if (sectorCode) {
          // 만약 던전이면
          const sectorSessions = getSectorSessions();
          const sector = sectorSessions.getSector(sectorCode);
          sector.notify(packet);
        } else {
          // 던전이 아니면
          playerSession.notify(packet);
        }
        return;
      } else {
        // 오차 범위를 벗어나지 않았으면 추측항법으로 예측한 위치를 전달
        const packet = PACKET.S2CPlayerLocation(
          player.id,
          predictedPos,
          true,
          player.getSectorId(),
        );

        const sectorCode = player.getSectorId();
        if (sectorCode) {
          // 만약 던전이면
          const sectorSessions = getSectorSessions();
          const sector = sectorSessions.getSector(sectorCode); // 강제로 변환
          sector.notify(packet);
        } else {
          // 던전이 아니면
          playerSession.notify(packet);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

function calculateDistance(point1, transform) {
  const dx = point1.x - transform.posX;
  const dy = point1.y - transform.posY;
  const dz = point1.z - transform.posZ;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function predictPosition(socket, player, transform, latency) {
  // 직전 좌표와 transform의 좌표를 빼서 방향벡터를 구하고 노말라이즈
  const prevPosition = player.getPosition();
  const velocity = {
    posX: transform.posX - prevPosition.x,
    posY: transform.posY - prevPosition.y,
    posZ: transform.posZ - prevPosition.z,
  };

  // 속도 벡터 크기(속력) 계산 및 검증
  let magnitude = Math.sqrt(
    velocity.posX ** 2 + velocity.posY ** 2 + velocity.posZ ** 2,
  );
  if (magnitude > 7) {
    magnitude = 10;
    return socket.emit(
      'error',
      new CustomError(
        ErrorCodes.INVALID_SPEED,
        '플레이어의 이동 속도가 올바르지 않습니다.',
      ),
    );
  }

  // 초당 속도 벡터 구하기(노말라이즈)
  const normalizedVelocity =
    magnitude > 0
      ? {
          posX: velocity.posX / magnitude,
          posY: velocity.posY / magnitude,
          posZ: velocity.posZ / magnitude,
        }
      : { posX: 0, posY: 0, posZ: 0 };

  // 예측한 위치 = 현재 transform 위치 + (속도 벡터 * 레이턴시)
  const predictedPosition = {
    posX: transform.posX + normalizedVelocity.posX * latency,
    posY: transform.posY + normalizedVelocity.posY * latency,
    posZ: transform.posZ + normalizedVelocity.posZ * latency,
    rot: transform.rot,
  };

  return predictedPosition;
}

export default playerLocationUpdateHandler;
