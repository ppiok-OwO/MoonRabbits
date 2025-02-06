import { config } from '../config/config.js';
import makePacket from '../utils/packet/makePacket.js';
import { animationHandler } from './social/playerAnimation.handler.js';
import { chatHandler } from './social/playerChat.handler.js';
import playerMoveHandler from './town/playerMove.handler.js';
import playerSpawnNotificationHandler from './town/playerSpawnNotification.handler.js';
import townEnterHandler from './town/townEnter.handler.js';
import { enterDungeonHandler } from './town/enterDungeon.handler.js';
import { playerResponseHandler } from './dungeon/playerResponse.handler.js';

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  0: townEnterHandler,
  2: playerSpawnNotificationHandler,
  6: playerMoveHandler,
  8: animationHandler,
  12: chatHandler,
  14: enterDungeonHandler,
  15: playerResponseHandler,
};

export default handlers;
