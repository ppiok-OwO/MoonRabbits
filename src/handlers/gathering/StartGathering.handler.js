import PACKET from '../../utils/packet/packet.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getPlayerSession } from '../../session/sessions.js';
import { getSectorSessions } from '../../session/sessions.js';

export const startGatheringHandler = (socket, packetData) => {
  const { placedId } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const resource = sector.resources[placedId];
  player.setGatheringIdx(placedId);
  player.gatheringSuccess = false;
  if (resource.getDurability() > 0) {
    return socket.write(
      PACKET.S2CGatheringStart(
        placedId,
        player.setAngle(resource.getAngle()),
        resource.getDifficulty(),
      ),
    );
  } else {
    return false;
  }
};
