import Packet from '../../utils/packet/packet.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getPlayerSession } from '../../session/sessions.js';
import { getSectorSessions } from '../../session/sessions.js';

export const StartGatheringHandler = (socket, packetData) => {
  const { placedId } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const resource = sector.resources[placedId];

  if (resource.getDurability() > 0) {
    socket.write(
      Packet.S2CStartGathering(
        placedId,
        player.setAngle(resource.getAngle()),
        resource.getDifficulty(),
      ),
    );
  } else {
    handleError(new CustomError(ErrorCodes.INVALID_INPUT, '잘못된 durability'));
  }
};
