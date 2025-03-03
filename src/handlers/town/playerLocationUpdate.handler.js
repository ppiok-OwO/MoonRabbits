import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import PathValidator from '../../utils/validate/pathValidator.js';


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
    } else {
      // PathValidator 사용하여 가장 가까운 경로 포인트 찾기
      const validationResult = await PathValidator.validatePosition(path, transform);

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
        const packet = PACKET.S2CPlayerLocation(
          player.id,
          newTransform,
          false,
        );

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
        const packet = PACKET.S2CPlayerLocation(
          player.id,
          transform,
          true,
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
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// calculateDistance 함수는 이제 PathValidator에서 처리하므로 제거 가능
// function calculateDistance(point1, transform) {
//   const dx = point1.x - transform.posX;
//   const dy = point1.y - transform.posY;
//   const dz = point1.z - transform.posZ;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// }

export default playerLocationUpdateHandler;