import Packet from '../../utils/packet/packet.js';
import {
  getPlayerSession,
  getDungeonSessions,
} from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';

export const requestResourcePlacementHandler = (socket, packetData) => {
  const { resourceId } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const dungeon = getDungeonSessions().getDungeon(player.getDungeonId());
  const resourceIdx = dungeon.setResource(resourceId);
  const durability = dungeon.resources[resourceIdx].getDurability();
  if (resourceIdx >= 0 && durability > 0) {
    socket.write(Packet.S2CResponseResourcePlacement(resourceIdx, durability));
  } else {
    handleError(
      new CustomError(ErrorCodes.INVALID_INPUT, '잘못된 자원 데이터'),
    );
  }
};
