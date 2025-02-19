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
import { createPartyHandler } from './social/party/createParty.handler.js';
import { invitePartyHandler } from './social/party/inviteParty.handler.js';
import { joinPartyHandler } from './social/party/joinParty.handler.js';
import { disbandPartyHandler } from './social/party/disbandParty.handler.js';
import { kickOutPartyHandler } from './social/party/kickOutParty.handler.js';
import { setPartyLeaderHandler } from './social/party/setPartyLeader.handler.js';
import { allowInviteHandler } from './social/party/allowInvite.handler.js';
import { leavePartyHandler } from './social/party/leaveParty.handler.js';
import { gatheringSkillCheckHandler } from './gathering/GatheringSkillCheck.handler.js';
import { StartGatheringHandler } from './gathering/StartGathering.handler.js';
import leaveHandler from './town/leaveHandler.js';

// !!! 패킷 정의 수정으로 config.packetId 일괄 수정해씀다

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  [config.packetId.C2SEnter]: townEnterHandler,
  [config.packetId.C2SLeave]: leaveHandler,
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

  [config.packetId.S2CMonsterLocation]: monsterLocationHandler,
  //[config.packetId.C2SMonsterLocation]: monsterLocationHandler,
  // 파티 관련
  [config.packetId.C2SCreateParty]: createPartyHandler,
  [config.packetId.C2SInviteParty]: invitePartyHandler,
  [config.packetId.C2SJoinParty]: joinPartyHandler,
  [config.packetId.C2SLeaveParty]: leavePartyHandler,
  [config.packetId.C2SDisbandParty]: disbandPartyHandler,
  [config.packetId.C2SKickOutMember]: kickOutPartyHandler,
  [config.packetId.C2SSetPartyLeader]: setPartyLeaderHandler,
  [config.packetId.C2SAllowInvite]: allowInviteHandler,

  [config.packetId.C2SGatheringSkillCheck]: gatheringSkillCheckHandler,
  [config.packetId.C2SStartGathering]: StartGatheringHandler,
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
