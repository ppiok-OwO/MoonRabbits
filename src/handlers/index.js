import { config } from '../config/config.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { animationHandler } from './social/playerAnimation.handler.js';
import { chatHandler } from './social/playerChat.handler.js';
import playerMoveHandler from './town/playerMove.handler.js';
import playerSpawnNotificationHandler from './town/playerSpawnNotification.handler.js';
import townEnterHandler from './town/townEnter.handler.js';

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  [config.packetId.C_Enter]: townEnterHandler,
  [config.packetId.S_Spawn]: playerSpawnNotificationHandler,
  [config.packetId.C_Move]: playerMoveHandler,
  [config.packetId.C_Animation]: animationHandler,
  [config.packetId.C_Chat]: chatHandler,
};

export const getHandlerByPacketId = (packetId) => {
  const handler = handlers[packetId];
  if (!handler){
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러가 정의되지 않은 패킷ID : ${packetId}`);
  }
  return handler;
}
