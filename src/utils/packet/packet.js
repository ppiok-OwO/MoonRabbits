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
  S2CEnter: (targetSector_int32, player_PlayerInfo) => {
    return makePacket(
      PACKET_ID.S2CEnter,
      PAYLOAD.S2CEnter(targetSector_int32, player_PlayerInfo),
    );
  },
  S2CEmote: (playerId_int32, animCode_int32) => {
    return makePacket(
      PACKET_ID.S2CEmote,
      PAYLOAD.S2CEmote(playerId_int32, animCode_int32),
    );
  },
  S2CChat: (playerId_int32, chatMsg_string, chatType_string) => {
    return makePacket(
      PACKET_ID.S2CChat,
      PAYLOAD.S2CChat(playerId_int32, chatMsg_string, chatType_string),
    );
  },
  S2CSpawn: (players_PlayerInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CSpawn,
      PAYLOAD.S2CSpawn(players_PlayerInfo_repeated),
    );
  },
  S2CDespawn: (playerIds_int32_repeated) => {
    return makePacket(
      PACKET_ID.S2CDespawn,
      PAYLOAD.S2CDespawn(playerIds_int32_repeated),
    );
  },
  S2CPlayerLocation: (
    playerId_int32,
    transform_TransformInfo,
    isValidTransform_bool,
  ) => {
    return makePacket(
      PACKET_ID.S2CPlayerLocation,
      PAYLOAD.S2CPlayerLocation(
        playerId_int32,
        transform_TransformInfo,
        isValidTransform_bool,
      ),
    );
  },
  S2CUpdateRanking: (status_string, data_RankingList) => {
    return makePacket(
      PACKET_ID.S2CUpdateRanking,
      PAYLOAD.S2CUpdateRanking(status_string, data_RankingList),
    );
  },
  S2CCollision: (collisionPushInfo_CollisionPushInfo) => {
    return makePacket(
      PACKET_ID.S2CCollision,
      PAYLOAD.S2CCollision(collisionPushInfo_CollisionPushInfo),
    );
  },
  S2CInventoryUpdate: (slots_InventorySlot_repeated) => {
    return makePacket(
      PACKET_ID.S2CInventoryUpdate,
      PAYLOAD.S2CInventoryUpdate(slots_InventorySlot_repeated),
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
  S2CCheckPartyList: (partyInfos_PartyInfo_repeated, memberId_int32) => {
    return makePacket(
      PACKET_ID.S2CCheckPartyList,
      PAYLOAD.S2CCheckPartyList(partyInfos_PartyInfo_repeated, memberId_int32),
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
  S2CResourcesList: (resources_Resource_repeated) => {
    return makePacket(
      PACKET_ID.S2CResourcesList,
      PAYLOAD.S2CResourcesList(resources_Resource_repeated),
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
  S2CRecall: (playerId_int32, recallTimer_int32) => {
    return makePacket(
      PACKET_ID.S2CRecall,
      PAYLOAD.S2CRecall(playerId_int32, recallTimer_int32),
    );
  },
  S2CThrowGrenade: (playerId_int32, velocity_Vec3, coolTime_int32) => {
    return makePacket(
      PACKET_ID.S2CThrowGrenade,
      PAYLOAD.S2CThrowGrenade(playerId_int32, velocity_Vec3, coolTime_int32),
    );
  },
  S2CTraps: (traps_TrapInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CTraps,
      PAYLOAD.S2CTraps(traps_TrapInfo_repeated),
    );
  },
  S2CSetTrap: (trapInfo_TrapInfo, coolTime_int32) => {
    return makePacket(
      PACKET_ID.S2CSetTrap,
      PAYLOAD.S2CSetTrap(trapInfo_TrapInfo, coolTime_int32),
    );
  },
  S2CRemoveTrap: (trapInfos_TrapInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CRemoveTrap,
      PAYLOAD.S2CRemoveTrap(trapInfos_TrapInfo_repeated),
    );
  },
  S2CStun: (
    stunTimer_int32,
    playerIds_int32_repeated,
    monsterIds_int32_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CStun,
      PAYLOAD.S2CStun(
        stunTimer_int32,
        playerIds_int32_repeated,
        monsterIds_int32_repeated,
      ),
    );
  },
  S2CEquipChange: (playerId_int32, nextEquip_int32) => {
    return makePacket(
      PACKET_ID.S2CEquipChange,
      PAYLOAD.S2CEquipChange(playerId_int32, nextEquip_int32),
    );
  },
  S2CAddExp: (updatedExp_int32) => {
    return makePacket(PACKET_ID.S2CAddExp, PAYLOAD.S2CAddExp(updatedExp_int32));
  },
  S2CLevelUp: (
    playerId_int32,
    updatedLevel_int32,
    newTargetExp_int32,
    updatedExp_int32,
    abilityPoint_int32,
  ) => {
    return makePacket(
      PACKET_ID.S2CLevelUp,
      PAYLOAD.S2CLevelUp(
        playerId_int32,
        updatedLevel_int32,
        newTargetExp_int32,
        updatedExp_int32,
        abilityPoint_int32,
      ),
    );
  },
  S2CInvestPoint: (statInfo_StatInfo) => {
    return makePacket(
      PACKET_ID.S2CInvestPoint,
      PAYLOAD.S2CInvestPoint(statInfo_StatInfo),
    );
  },
};

export default PACKET;
