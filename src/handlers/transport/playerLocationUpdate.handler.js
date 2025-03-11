import { config } from '../../config/config.js';
import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';
import PACKET from '../../utils/packet/packet.js';
import PathValidator from '../../utils/validate/pathValidator.js';

// 이동중이라면 0.1초마다 location 패킷 전송
const playerLocationUpdateHandler = async (socket, packetData) => {
  try {
    const { transform } = packetData;
    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);
    if (!player) {
      return socket.emit(
        'error',
        new CustomError(ErrorCodes.USER_NOT_FOUND, '플레이어 정보를 찾을 수 없습니다.'),
      );
    }

    const path = player.getPath();
    if (path === null) {
      console.log('생성된 경로가 없음!!');
      player.setPosition(transform);
    } else {
      // PathValidator 사용하여 가장 가까운 경로 포인트 찾기
      const validationResult = await PathValidator.validatePosition(path, transform);

      const clientDistance = getDistance(transform, player);
      const serverDistance =
        player.getMoveSpeed() * 0.02 + config.updateLocation.tolerance;

      if (clientDistance > serverDistance) {
        console.log('속도 검증 실패!!', clientDistance, serverDistance);
      }

      // 속도 검증 끝난 뒤에 플레이어 포지션 업데이트
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
        // 오차 범위를 벗어나지 않았으면 현재 위치를 전달
        const packet = PACKET.S2CPlayerLocation(player.id, transform, true);
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
    handleError(socket, error);
  }
};

function getDistance(transform, player) {
  try {
    if (player.usePortal) {
      const distance = 0.1;
      player.usePortal = false;
      return distance;
    }

    // 섹터 이동한 경우에도
    if (player.useMoveSector) {
      const distance = 0.1;
      player.useMoveSector = false;
      return distance;
    }

    const prevPosition = player.getPosition();

    const dx = transform.posX - prevPosition.x;
    const dz = transform.posZ - prevPosition.z;

    const distance = Math.sqrt(dx ** 2 + dz ** 2);

    return distance;
  } catch (error) {
    console.error(error);
  }
}

export default playerLocationUpdateHandler;
