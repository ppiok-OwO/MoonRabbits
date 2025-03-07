import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';
import { animationHandler } from '../social/playerAnimation.handler.js';

export const gatheringAnimationEndHandler = (socket, packetData) => {
  animationHandler(socket, { animCode: 10 });
};

