import { config } from '../config/config.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { animationHandler } from './social/playerAnimation.handler.js';
import { chatHandler } from './social/playerChat.handler.js';
import playerMoveHandler from './town/playerMove.handler.js';
import playerSpawnNotificationHandler from './town/playerSpawnNotification.handler.js';
import townEnterHandler from './town/townEnter.handler.js';
import { enterDungeonHandler } from './town/enterDungeon.handler.js';
import { playerResponseHandler } from './dungeon/playerResponse.handler.js';
import playerLocationUpdateHandler from './town/playerLocationUpdate.handler.js';
import registerHandler from './account/register.handler.js';
import loginHandler from './account/login.handler.js';
import createCharacterHandler from './account/createCharacter.handler.js';
import { monsterLocationHandler } from './monster/monsterLocation.handler.js';

// !!! 패킷 정의 수정으로 config.packetId 일괄 수정해씀다

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  [config.packetId.C2STownEnter]: townEnterHandler,
  [config.packetId.S2CPlayerSpawn]: playerSpawnNotificationHandler,
  [config.packetId.C2SPlayerLocation]: playerLocationUpdateHandler,
  [config.packetId.C2SPlayerMove]: playerMoveHandler,
  [config.packetId.C2SAnimation]: animationHandler,
  [config.packetId.C2SChat]: chatHandler,
  [config.packetId.C2SDungeonEnter]: enterDungeonHandler,
  // !!! 제거된 패킷임다 [config.packetId.C_PlayerResponse]: playerResponseHandler,
  [config.packetId.C2SRegister]: registerHandler,
  [config.packetId.C2SLogin]: loginHandler,
  [config.packetId.C2SCreateCharacter]: createCharacterHandler,
  [config.packetId.C2SMonsterLocation]: monsterLocationHandler,
};

export const getHandlerByPacketId = (packetId) => {
  const handler = handlers[packetId];
  if (!handler) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러가 정의되지 않은 패킷ID : ${packetId}`,
    );
  }
  return handler;
};
