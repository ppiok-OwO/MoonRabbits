import { getGameAssets } from '../../init/assets.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';

export const portalHandler = (socket, packetData) => {
  try {
    const { inPortalId } = packetData;

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
    const portal = gameAssets.portal.data.find(
      (element) => element.portal_id === inPortalId,
    );
    if (!portal) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.INVALID_INPUT,
          '올바르지 않은 포탈 ID입니다.',
        ),
      );
    }
    const sectorCode = player.getSectorId();
    if (!sectorCode) {
      return socket.emit(
        'error',
        new CustomError(ErrorCodes.INVALID_INPUT, '올바르지 않은 섹터입니다.'),
      );
    }

    const newPlayerPos = {
      x: portal.portal_location_x,
      y: portal.portal_location_y,
      z: portal.portal_location_z,
    };

    // 플레이어 위치 및 경로 초기화
    player.position.posX = portal.portal_location_x;
    player.position.posY = portal.portal_location_y;
    player.position.posZ = portal.portal_location_z;
    player.setPath(null);

    // 패킷 전송
    const portalPacket = PACKET.S2CPortal(newPlayerPos);

    const sectorSessions = getSectorSessions();
    const sector = sectorSessions.getSector(sectorCode);
    sector.notify(portalPacket);
  } catch (error) {
    console.error(error);
  }
};
