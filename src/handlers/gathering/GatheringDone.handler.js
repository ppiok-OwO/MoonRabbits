import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';

export const gatheringDoneHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const placedId = player.getGatheringIdx();
  if (player.gatheringSuccess) {
    player.gatheringSuccess = false;

    const dropItem = sector.resources[placedId].dropItem();
    socket.write(PACKET.S2CGatheringDone(placedId, dropItem, 1));

    // 나중에 아이템 받아오는 내역 필요함

    //

    // addExpHandler(socket, {
    //   count: sector.resources[placedId].getDifficulty(),
    // });

    const durability = sector.subDurability(placedId);

    if (durability <= 0) {
      setTimeout(
        () => sector.resetDurability(placedId),
        sector.resources[placedId].getRespawnTime(),
      );
    }
  }
};
