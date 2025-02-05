import { config } from '../config/config.js';
import makePacket from '../utils/packet/makePacket.js';
import { animationHandler } from './social/playerAnimation.handler.js';
import { chatHandler } from './social/playerChat.handler.js';
import playerMoveHandler from './town/playerMove.handler.js';
import townEnterHandler from './town/townEnter.handler.js';

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  0: townEnterHandler,
  6: playerMoveHandler,
  8: animationHandler,
  12: chatHandler,
};

export default handlers;
