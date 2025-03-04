import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import PathValidator from '../../utils/validate/pathValidator.js';

// !!! 패킷 변경에 따라 S_Chat -> S2CChat, S_Location -> S2CPlayerLocation으로 일괄 수정해씀다

// 경로 탐색 성공: [
//   { x: 0, y: 0, z: 0 },
//   { x: 5, y: 0, z: 5 },
//   { x: 10, y: 0, z: 15 },
//   { x: 20, y: 0, z: 30 }
// ]

// 이동중이라면 10프레임마다 location 패킷 전송
const playerLocationUpdateHandler = async (socket, packetData) => {
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
      // PathValidator 사용하여 가장 가까운 경로 포인트 찾기
      const validationResult = await PathValidator.validatePosition(
        path,
        transform,
      );

      const latency = player.user.getLatency() / 1000;
      const predictedPos = predictPosition(socket, player, transform, latency);

      // 추측항법이 끝난 뒤에 플레이어 포지션 업데이트
      player.setPosition(transform);

      if (validationResult && validationResult.distance > 1.4) {
        // 오차범위를 벗어나면 플레이어의 위치를 가장 가까운 포인트로 재조정
        const newTransform = {
          posX: validationResult.point.PosX,
          posY: validationResult.point.PosY,
          posZ: validationResult.point.PosZ,
          rot: transform.rot,
        };

        player.setPosition(newTransform);
        const packet = PACKET.S2CPlayerLocation(player.id, newTransform, false);

        const sectorCode = player.getSectorId();
        if (sectorCode) {
          // 만약 던전이면
          const sectorSessions = getSectorSessions();
          const sector = sectorSessions.getSector(sectorCode);
          sector.notify(packet);
        } else {
          playerSession.notify(packet);
        }
        return;
      } else {
        // 오차 범위를 벗어나지 않았으면 추측항법으로 예측한 위치를 전달
        const packet = PACKET.S2CPlayerLocation(player.id, predictedPos, true);
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
      }
    }
  } catch (error) {
    console.error(error);
  }
};

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
