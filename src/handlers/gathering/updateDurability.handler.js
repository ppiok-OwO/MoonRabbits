import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';
import { animationHandler } from '../social/playerAnimation.handler.js';

export const updateDurabilityHandler = (sector, packetData) => {
  const { resourceIdx, durability } = packetData;

  sector.notify(PACKET.S2CUpdateDurability(resourceIdx, durability));
};

