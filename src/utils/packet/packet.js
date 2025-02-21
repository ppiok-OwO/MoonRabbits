import makePacket from './makePacket.js';
import { PACKET_ID } from '../../constants/header.js';
import PAYLOAD from './payload.js';

const PACKET = {
  S2CRegister: (isSuccess_bool, msg_string) => {
    return makePacket(
      PACKET_ID.S2CRegister,
      PAYLOAD.S2CRegister(isSuccess_bool, msg_string),
    );
  },
  S2CLogin: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_OwnedCharacter_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CLogin,
      PAYLOAD.S2CLogin(
        isSuccess_bool,
        msg_string,
        ownedCharacters_OwnedCharacter_repeated,
      ),
    );
  },
  S2CCreateCharacter: (isSuccess_bool, msg_string) => {
    return makePacket(
      PACKET_ID.S2CCreateCharacter,
      PAYLOAD.S2CCreateCharacter(isSuccess_bool, msg_string),
    );
  },
  S2CEnter: (player_PlayerInfo) => {
    return makePacket(PACKET_ID.S2CEnter, PAYLOAD.S2CEnter(player_PlayerInfo));
  },
  S2CLeave: () => {
    return makePacket(PACKET_ID.S2CLeave);
  },
  S2CAnimation: (playerId_int32, animCode_int32) => {
    return makePacket(
      PACKET_ID.S2CAnimation,
      PAYLOAD.S2CAnimation(playerId_int32, animCode_int32),
    );
  },
  S2CChat: (playerId_int32, chatMsg_string, chatType_string) => {
    return makePacket(
      PACKET_ID.S2CChat,
      PAYLOAD.S2CChat(playerId_int32, chatMsg_string, chatType_string),
    );
  },
  S2CPlayerSpawn: (players_PlayerInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CPlayerSpawn,
      PAYLOAD.S2CPlayerSpawn(players_PlayerInfo_repeated),
    );
  },
  S2CPlayerDespawn: (playerIds_int32_repeated, currentScene_int32) => {
    return makePacket(
      PACKET_ID.S2CPlayerDespawn,
      PAYLOAD.S2CPlayerDespawn(playerIds_int32_repeated, currentScene_int32),
    );
  },
  S2CPlayerLocation: (
    playerId_int32,
    transform_TransformInfo,
    isValidTransform_bool,
    currentScene_int32,
  ) => {
    return makePacket(
      PACKET_ID.S2CPlayerLocation,
      PAYLOAD.S2CPlayerLocation(
        playerId_int32,
        transform_TransformInfo,
        isValidTransform_bool,
        currentScene_int32,
      ),
    );
  },
  S2CUpdateRanking: (status_string, data_RankingList) => {
    return makePacket(
      PACKET_ID.S2CUpdateRanking,
      PAYLOAD.S2CUpdateRanking(status_string, data_RankingList),
    );
  },
  S2CPlayerCollision: (playerId_int32, collisionPushInfo_CollisionPushInfo) => {
    return makePacket(
      PACKET_ID.S2CPlayerCollision,
      PAYLOAD.S2CPlayerCollision(
        playerId_int32,
        collisionPushInfo_CollisionPushInfo,
      ),
    );
  },
  S2CMonsterCollision: (
    monsterId_int32,
    collisionPushInfo_CollisionPushInfo,
  ) => {
    return makePacket(
      PACKET_ID.S2CMonsterCollision,
      PAYLOAD.S2CMonsterCollision(
        monsterId_int32,
        collisionPushInfo_CollisionPushInfo,
      ),
    );
  },
  S2CSelectStore: (storeInfo_StoreInfo, itemInfo_ItemInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CSelectStore,
      PAYLOAD.S2CSelectStore(storeInfo_StoreInfo, itemInfo_ItemInfo_repeated),
    );
  },
  S2CBuyItem: (success_string, inventoryInfo_InventoryInfo, gold_int32) => {
    return makePacket(
      PACKET_ID.S2CBuyItem,
      PAYLOAD.S2CBuyItem(
        success_string,
        inventoryInfo_InventoryInfo,
        gold_int32,
      ),
    );
  },
  S2CCreateParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CCreateParty,
      PAYLOAD.S2CCreateParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CInviteParty: (leaderNickname_string, partyId_string, memberId_int32) => {
    return makePacket(
      PACKET_ID.S2CInviteParty,
      PAYLOAD.S2CInviteParty(
        leaderNickname_string,
        partyId_string,
        memberId_int32,
      ),
    );
  },
  S2CJoinParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CJoinParty,
      PAYLOAD.S2CJoinParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CLeaveParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CLeaveParty,
      PAYLOAD.S2CLeaveParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CSetPartyLeader: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CSetPartyLeader,
      PAYLOAD.S2CSetPartyLeader(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CKickOutMember: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CKickOutMember,
      PAYLOAD.S2CKickOutMember(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CDisbandParty: (msg_string) => {
    return makePacket(
      PACKET_ID.S2CDisbandParty,
      PAYLOAD.S2CDisbandParty(msg_string),
    );
  },
  S2CAllowInvite: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CAllowInvite,
      PAYLOAD.S2CAllowInvite(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CCheckPartyList: (partyInfos_PartyInfo_repeated, memberId_int) => {
    return makePacket(
      PACKET_ID.S2CCheckPartyList,
      PAYLOAD.S2CCheckPartyList(partyInfos_PartyInfo_repeated, memberId_int),
    );
  },
  S2CRejectInvite: () => {
    return makePacket(PACKET_ID.S2CRejectInvite, PAYLOAD.S2CRejectInvite());
  },
  S2CMonsterLocation: (monsterId_int32, transformInfo_TransformInfo) => {
    return makePacket(
      PACKET_ID.S2CMonsterLocation,
      PAYLOAD.S2CMonsterLocation(monsterId_int32, transformInfo_TransformInfo),
    );
  },
  S2CDetectedPlayer: (monsterId_int32, playerId_int32) => {
    return makePacket(
      PACKET_ID.S2CDetectedPlayer,
      PAYLOAD.S2CDetectedPlayer(monsterId_int32, playerId_int32),
    );
  },
  S2CMissingPlayer: (monsterId_int32, playerId_int32) => {
    return makePacket(
      PACKET_ID.S2CMissingPlayer,
      PAYLOAD.S2CMissingPlayer(monsterId_int32, playerId_int32),
    );
  },
  S2CResourceList: (resources_Resource_repeated) => {
    return makePacket(
      PACKET_ID.S2CResourceList,
      PAYLOAD.S2CResourceList(resources_Resource_repeated),
    );
  },
  S2CUpdateDurability: (placedId_int32, durability_int32) => {
    return makePacket(
      PACKET_ID.S2CUpdateDurability,
      PAYLOAD.S2CUpdateDurability(placedId_int32, durability_int32),
    );
  },
  S2CGatheringStart: (placedId_int32, angle_int32, difficulty_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringStart,
      PAYLOAD.S2CGatheringStart(placedId_int32, angle_int32, difficulty_int32),
    );
  },
  S2CGatheringSkillCheck: (placedId_int32, durability_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringSkillCheck,
      PAYLOAD.S2CGatheringSkillCheck(placedId_int32, durability_int32),
    );
  },
  S2CGatheringDone: (placedId_int32, itemId_int32, quantity_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringDone,
      PAYLOAD.S2CGatheringDone(placedId_int32, itemId_int32, quantity_int32),
    );
  },
  S2CSectorEnter: (sectorInfo_SectorInfo, player_PlayerStatus) => {
    return makePacket(
      PACKET_ID.S2CSectorEnter,
      PAYLOAD.S2CSectorEnter(sectorInfo_SectorInfo, player_PlayerStatus),
    );
  },
  C2SAddExp: (count_int) => {
    return makePacket(PACKET_ID.C2SAddExp, { count: count_int });
  },
  S2CAddExp: (updatedExp_int) => {
    return makePacket(PACKET_ID.S2CAddExp, { updatedExp: updatedExp_int });
  },
  S2CLevelUp: (
    playerId_int,
    updatedLevel_int,
    newTargetExp_int,
    updatedExp_int,
    abilityPoint_int,
  ) => {
    return makePacket(PACKET_ID.S2CLevelUp, {
      playerId: playerId_int,
      updatedLevel: updatedLevel_int,
      newTargetExp: newTargetExp_int,
      updatedExp: updatedExp_int,
      abilityPoint: abilityPoint_int,
    });
  },
  C2SInvestPoint: (statCode_int) => {
    return makePacket(PACKET_ID.C2SInvestPoint, {
      statCode: statCode_int,
    });
  },
  S2CInvestPoint: (statInfo_StatInfo) => {
    return makePacket(PACKET_ID.S2CInvestPoint, {
      statInfo: statInfo_StatInfo,
    });
  },
};

export default PACKET;
