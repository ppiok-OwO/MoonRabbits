import { config } from '../config/config.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { animationHandler } from './social/playerAnimation.handler.js';
import { chatHandler } from './social/playerChat.handler.js';
import playerMoveHandler from './transport/playerMove.handler.js';
import townEnterHandler from './transport/townEnter.handler.js';
import playerLocationUpdateHandler from './transport/playerLocationUpdate.handler.js';
import registerHandler from './account/register.handler.js';
import loginHandler from './account/login.handler.js';
import createCharacterHandler from './account/createCharacter.handler.js';
import { addExpHandler } from './player/addExp.handler.js';
import { investPointHandler } from './player/investPoint.handler.js';

import { createPartyHandler } from './social/party/createParty.handler.js';
import { invitePartyHandler } from './social/party/inviteParty.handler.js';
import { joinPartyHandler } from './social/party/joinParty.handler.js';
import { disbandPartyHandler } from './social/party/disbandParty.handler.js';
import { kickOutPartyHandler } from './social/party/kickOutParty.handler.js';
import { allowInviteHandler } from './social/party/allowInvite.handler.js';
import { leavePartyHandler } from './social/party/leaveParty.handler.js';
import moveSectorHandler from './transport/moveSectorHandler.js';

import { gatheringSkillCheckHandler } from './gathering/gatheringSkillCheck.handler.js';
import { startGatheringHandler } from './gathering/startGathering.handler.js';
import { gatheringDoneHandler } from './gathering/gatheringDone.handler.js';
import { gatheringAnimationEndHandler } from './gathering/gatheringAnimationEnd.handler.js';
import { resourceListHandler } from './gathering/resourceList.handler.js';
import { rejectInviteHandler } from './social/party/rejectInvite.handler.js';
import { chceckPartyListHandler } from './social/party/checkPartyList.handler.js';
import tryRecallHandler from './playerAction/tryRecall.hander.js';
import throwGrenadeHandler from './playerAction/throwGrenade.handler.js';
import stunHandler from './playerAction/stun.handler.js';
import equipChangeHandler from './playerAction/equipChange.handler.js';
import { collisionHandler } from './collision/collision.handler.js';
import setTrapHandler from './playerAction/setTrap.handler.js';
import removeTrapHandler from './playerAction/removeTrap.handler.js';
import itemObtainedHandler from './player/inventory/itemObtained.handler.js';
import itemDisassemblyHandler from './player/inventory/itemDisassembly.handler.js';
import itemDestroyHandler from './player/inventory/itemDestroy.handler.js';
import inventorySortHandler from './player/inventory/inventorySort.handler.js';
import inventoryUpdateHandler from './player/inventory/inventoryUpdate.handler.js';
import { pongHandler } from './pong.handler.js';
import { portalHandler } from './playerAction/portal.handler.js';
import { getInventorySlotByItemIdHandler } from './player/inventory/getInventorySlotByItemId.handler.js';
import rankingHandler from './ranking/ranking.handler.js';
import openChestHandler from './playerAction/openChest.handler.js';
import getTreasureHandler from './playerAction/getTreasure.handler.js';
import { craftEndHandler } from './player/inventory/craftEnd.handler.js';
import { craftStartHandler } from './player/inventory/craftStart.handler.js';
import { furnitureCraftHandler } from './housing/furnitureCraft.handler.js';

// !!! 패킷 정의 수정으로 config.packetId 일괄 수정해씀다

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  [config.packetId.C2SEnterTown]: townEnterHandler,
  [config.packetId.C2SMoveSector]: moveSectorHandler,
  [config.packetId.C2SPlayerLocation]: playerLocationUpdateHandler,
  [config.packetId.C2SPlayerMove]: playerMoveHandler,
  [config.packetId.C2SEmote]: animationHandler,
  [config.packetId.C2SChat]: chatHandler,
  // !!! 제거된 패킷임다 [config.packetId.C_PlayerResponse]: playerResponseHandler,
  [config.packetId.C2SRegister]: registerHandler,
  [config.packetId.C2SLogin]: loginHandler,
  [config.packetId.C2SCreateCharacter]: createCharacterHandler,
  [config.packetId.C2SAddExp]: addExpHandler,
  [config.packetId.C2SInvestPoint]: investPointHandler,

  //충돌
  [config.packetId.C2SCollision]: collisionHandler,

  // 파티 관련
  [config.packetId.C2SCreateParty]: createPartyHandler,
  [config.packetId.C2SInviteParty]: invitePartyHandler,
  [config.packetId.C2SJoinParty]: joinPartyHandler,
  [config.packetId.C2SLeaveParty]: leavePartyHandler,
  [config.packetId.C2SDisbandParty]: disbandPartyHandler,
  [config.packetId.C2SKickOutMember]: kickOutPartyHandler,
  [config.packetId.C2SAllowInvite]: allowInviteHandler,
  [config.packetId.C2SRejectInvite]: rejectInviteHandler,
  [config.packetId.C2SCheckPartyList]: chceckPartyListHandler,

  [config.packetId.C2SGatheringSkillCheck]: gatheringSkillCheckHandler,
  [config.packetId.C2SGatheringStart]: startGatheringHandler,
  [config.packetId.C2SResourcesList]: resourceListHandler,
  [config.packetId.C2SGatheringDone]: gatheringDoneHandler,
  [config.packetId.C2SGatheringAnimationEnd]: gatheringAnimationEndHandler,

  [config.packetId.C2SOpenChest]: openChestHandler,
  [config.packetId.C2SGetTreasure]: getTreasureHandler,
  [config.packetId.C2SRecall]: tryRecallHandler,
  [config.packetId.C2SThrowGrenade]: throwGrenadeHandler,
  [config.packetId.C2SSetTrap]: setTrapHandler,
  [config.packetId.C2SRemoveTrap]: removeTrapHandler,
  [config.packetId.C2SStun]: stunHandler,
  [config.packetId.C2SEquipChange]: equipChangeHandler,

  // 인벤토리 관련 핸들러
  [config.packetId.C2SItemObtained]: itemObtainedHandler,
  [config.packetId.C2SItemDisassembly]: itemDisassemblyHandler,
  [config.packetId.C2SItemDestroy]: itemDestroyHandler,
  [config.packetId.C2SInventorySort]: inventorySortHandler,
  [config.packetId.C2SItemMove]: inventoryUpdateHandler,

  // 포탈 관련 핸들러
  [config.packetId.C2SPortal]: portalHandler,
  [config.packetId.C2SPong]: pongHandler,

  [config.packetId.C2SCraftStart]: craftStartHandler,
  [config.packetId.C2SCraftEnd]: craftEndHandler,
  [config.packetId.C2SGetInventorySlotByItemId]:
    getInventorySlotByItemIdHandler,

  // 랭킹 관련 핸들러
  [config.packetId.C2SRankingList]: rankingHandler,

  // 하우징 관련 핸들러
  [config.packetId.C2SFurnitureCraft]: furnitureCraftHandler,
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
