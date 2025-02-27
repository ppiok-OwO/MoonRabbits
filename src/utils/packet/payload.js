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
  S2CEnter: (player_PlayerInfo) => {
    return { player: player_PlayerInfo };
  },
  S2CAnimation: (playerId_int32, animCode_int32, currentSector_int32) => {
    return {
      playerId: playerId_int32,
      animCode: animCode_int32,
      currentSector: currentSector_int32,
    };
  },
  S2CChat: (
    playerId_int32,
    chatMsg_string,
    chatType_string,
    currentSector_int32,
  ) => {
    return {
      playerId: playerId_int32,
      chatMsg: chatMsg_string,
      chatType: chatType_string,
      currentSector: currentSector_int32,
    };
  },
  S2CSpawn: (players_PlayerInfo_repeated) => {
    return { players: players_PlayerInfo_repeated };
  },
  S2CDespawn: (playerIds_int32_repeated, currentSector_int32) => {
    return {
      playerIds: playerIds_int32_repeated,
      currentSector: currentSector_int32,
    };
  },
  S2CPlayerLocation: (
    playerId_int32,
    transform_TransformInfo,
    isValidTransform_bool,
    currentSector_int32,
  ) => {
    return {
      playerId: playerId_int32,
      transform: transform_TransformInfo,
      isValidTransform: isValidTransform_bool,
      currentSector: currentSector_int32,
    };
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
  S2CRecall: (playerId_int32, currentSector_int32, recallTimer_int32) => {
    return {
      playerId: playerId_int32,
      currentSector: currentSector_int32,
      recallTimer: recallTimer_int32,
    };
  },
  S2CThrowGrenade: (
    playerId_int32,
    currentSector_int32,
    velocity_Vec3,
    coolTime_int32,
  ) => {
    return {
      playerId: playerId_int32,
      currentSector: currentSector_int32,
      velocity: velocity_Vec3,
      coolTime: coolTime_int32,
    };
  },
  S2CSectorEnter: (sectorInfo_SectorInfo, player_PlayerStatus) => {
    return { sectorInfo: sectorInfo_SectorInfo, player: player_PlayerStatus };
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
};

export default PAYLOAD;
