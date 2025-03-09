const PAYLOAD = {
  S2CRegister: (isSuccess_bool, msg_string) => {
    return { isSuccess: isSuccess_bool, msg: msg_string };
  },
  S2CLogin: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_OwnedCharacter_repeated,
  ) => {
    return {
      isSuccess: isSuccess_bool,
      msg: msg_string,
      ownedCharacters: ownedCharacters_OwnedCharacter_repeated,
    };
  },
  S2CCreateCharacter: (isSuccess_bool, msg_string) => {
    return { isSuccess: isSuccess_bool, msg: msg_string };
  },
  S2CEnterTown: (players_PlayerInfo_repeated) => {
    return { players: players_PlayerInfo_repeated };
  },
  S2CMoveSector: (
    targetSector_int32,
    players_PlayerInfo_repeated,
    traps_TrapInfo_repeated,
    hasChest_bool,
  ) => {
    return {
      targetSector: targetSector_int32,
      players: players_PlayerInfo_repeated,
      traps: traps_TrapInfo_repeated,
      hasChest: hasChest_bool,
    };
  },
  S2CEmote: (playerId_int32, animCode_int32) => {
    return { playerId: playerId_int32, animCode: animCode_int32 };
  },
  S2CChat: (playerId_int32, chatMsg_string, chatType_string) => {
    return {
      playerId: playerId_int32,
      chatMsg: chatMsg_string,
      chatType: chatType_string,
    };
  },
  S2CSpawn: (player_PlayerInfo) => {
    return { player: player_PlayerInfo };
  },
  S2CDespawn: (playerId_int32) => {
    return { playerId: playerId_int32 };
  },
  S2CPlayerLocation: (
    playerId_int32,
    transform_TransformInfo,
    isValidTransform_bool,
  ) => {
    return {
      playerId: playerId_int32,
      transform: transform_TransformInfo,
      isValidTransform: isValidTransform_bool,
    };
  },
  S2CPortal: (outPortalLocation_Vec3) => {
    return { outPortalLocation: outPortalLocation_Vec3 };
  },
  S2CUpdateRanking: (status_string, data_RankingList) => {
    return { status: status_string, data: data_RankingList };
  },
  S2CCollision: (collisionPushInfo_CollisionPushInfo) => {
    return { collisionPushInfo: collisionPushInfo_CollisionPushInfo };
  },
  S2CInventoryUpdate: (slots_InventorySlot_repeated) => {
    return { slots: slots_InventorySlot_repeated };
  },
  S2CHousingSave: (status_string, msg_string) => {
    return { status: status_string, msg: msg_string };
  },
  S2CHousingLoad: (
    status_string,
    msg_string,
    housingInfo_HousingInfo_repeated,
  ) => {
    return {
      status: status_string,
      msg: msg_string,
      housingInfo: housingInfo_HousingInfo_repeated,
    };
  },
  S2CFurnitureCraft: (isSuccess_bool, msg_string, recipeId_int32) => {
    return {
      isSuccess: isSuccess_bool,
      msg: msg_string,
      recipeId: recipeId_int32,
    };
  },
  S2CCreateParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CInviteParty: (leaderNickname_string, partyId_string, memberId_int32) => {
    return {
      leaderNickname: leaderNickname_string,
      partyId: partyId_string,
      memberId: memberId_int32,
    };
  },
  S2CJoinParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CLeaveParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CCheckPartyList: (partyInfos_PartyInfo_repeated, memberId_int32) => {
    return {
      partyInfos: partyInfos_PartyInfo_repeated,
      memberId: memberId_int32,
    };
  },
  S2CKickOutMember: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CDisbandParty: (msg_string) => {
    return { msg: msg_string };
  },
  S2CAllowInvite: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CUpdateParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
      members: members_MemberCardInfo_repeated,
    };
  },
  S2CRejectInvite: () => {
    return {};
  },
  S2CMonsterLocation: (monsterId_int32, transformInfo_TransformInfo) => {
    return {
      monsterId: monsterId_int32,
      transformInfo: transformInfo_TransformInfo,
    };
  },
  S2CDetectedPlayer: (monsterId_int32, playerId_int32) => {
    return { monsterId: monsterId_int32, playerId: playerId_int32 };
  },
  S2CMissingPlayer: (monsterId_int32, playerId_int32) => {
    return { monsterId: monsterId_int32, playerId: playerId_int32 };
  },
  S2CResourcesList: (resources_Resource_repeated) => {
    return { resources: resources_Resource_repeated };
  },
  S2CUpdateDurability: (placedId_int32, durability_int32) => {
    return { placedId: placedId_int32, durability: durability_int32 };
  },
  S2CGatheringStart: (placedId_int32, angle_int32, difficulty_int32) => {
    return {
      placedId: placedId_int32,
      angle: angle_int32,
      difficulty: difficulty_int32,
    };
  },
  S2CGatheringSkillCheck: (placedId_int32, durability_int32) => {
    return { placedId: placedId_int32, durability: durability_int32 };
  },
  S2CGatheringDone: (placedId_int32, itemId_int32, quantity_int32) => {
    return {
      placedId: placedId_int32,
      itemId: itemId_int32,
      quantity: quantity_int32,
    };
  },
  S2COpenChest: (playerId_int32, openTimer_int32) => {
    return { playerId: playerId_int32, openTimer: openTimer_int32 };
  },
  S2CRegenChest: (sectorCode_int32) => {
    return { sectorCode: sectorCode_int32 };
  },
  S2CRecall: (playerId_int32, recallTimer_int32) => {
    return { playerId: playerId_int32, recallTimer: recallTimer_int32 };
  },
  S2CThrowGrenade: (playerId_int32, velocity_Vec3, coolTime_int32) => {
    return {
      playerId: playerId_int32,
      velocity: velocity_Vec3,
      coolTime: coolTime_int32,
    };
  },
  S2CTraps: (traps_TrapInfo_repeated) => {
    return { traps: traps_TrapInfo_repeated };
  },
  S2CSetTrap: (trapInfo_TrapInfo, coolTime_int32) => {
    return { trapInfo: trapInfo_TrapInfo, coolTime: coolTime_int32 };
  },
  S2CRemoveTrap: (trapInfos_TrapInfo_repeated) => {
    return { trapInfos: trapInfos_TrapInfo_repeated };
  },
  S2CStun: (
    stunTimer_int32,
    playerIds_int32_repeated,
    monsterIds_int32_repeated,
  ) => {
    return {
      stunTimer: stunTimer_int32,
      playerIds: playerIds_int32_repeated,
      monsterIds: monsterIds_int32_repeated,
    };
  },
  S2CEquipChange: (playerId_int32, nextEquip_int32) => {
    return { playerId: playerId_int32, nextEquip: nextEquip_int32 };
  },
  S2CAddExp: (updatedExp_int32) => {
    return { updatedExp: updatedExp_int32 };
  },
  S2CLevelUp: (
    playerId_int32,
    updatedLevel_int32,
    newTargetExp_int32,
    updatedExp_int32,
    abilityPoint_int32,
  ) => {
    return {
      playerId: playerId_int32,
      updatedLevel: updatedLevel_int32,
      newTargetExp: newTargetExp_int32,
      updatedExp: updatedExp_int32,
      abilityPoint: abilityPoint_int32,
    };
  },
  S2CInvestPoint: (statInfo_StatInfo) => {
    return { statInfo: statInfo_StatInfo };
  },
  S2CCraftStart: (isSuccess_bool, recipeId_int32, msg_string) => {
    return {
      isSuccess: isSuccess_bool,
      recipeId: recipeId_int32,
      msg: msg_string,
    };
  },
  S2CCraftEnd: (isSuccess_bool, msg_string) => {
    return { isSuccess: isSuccess_bool, msg: msg_string };
  },
  S2CPing: (timestamp_int64) => {
    return { timestamp: timestamp_int64 };
  },
  S2CGetInventorySlotByItemId: (slots_InventorySlot_repeated) => {
    return { slots: slots_InventorySlot_repeated };
  },
};

export default PAYLOAD;
