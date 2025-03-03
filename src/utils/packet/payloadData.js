const PAYLOAD_DATA = {
  PlayerInfo: (
    playerId_int32,
    nickname_string,
    level_int32,
    classCode_int32,
    transform_TransformInfo,
    statInfo_StatInfo,
  ) => {
    return {
      playerId: playerId_int32,
      nickname: nickname_string,
      level: level_int32,
      classCode: classCode_int32,
      transform: transform_TransformInfo,
      statInfo: statInfo_StatInfo,
    };
  },
  PlayerRank: (rank_int32, playerId_string, nickname_string, exp_int32) => {
    return {
      rank: rank_int32,
      playerId: playerId_string,
      nickname: nickname_string,
      exp: exp_int32,
    };
  },
  RankingList: (rankingList_PlayerRank_repeated, timestamp_string) => {
    return {
      rankingList: rankingList_PlayerRank_repeated,
      timestamp: timestamp_string,
    };
  },
  TransformInfo: (posX_float, posY_float, posZ_float, rot_float) => {
    return {
      posX: posX_float,
      posY: posY_float,
      posZ: posZ_float,
      rot: rot_float,
    };
  },
  SectorInfo: (sectorId_int32, monsters_MonsterStatus_repeated) => {
    return {
      sectorId: sectorId_int32,
      monsters: monsters_MonsterStatus_repeated,
    };
  },
  PlayerStatus: (
    playerLevel_int32,
    playerName_string,
    playerStamina_int32,
    playerPickSpeed_int32,
    playerMoveSpeed_int32,
    abilityPoint_int32,
  ) => {
    return {
      playerLevel: playerLevel_int32,
      playerName: playerName_string,
      playerStamina: playerStamina_int32,
      playerPickSpeed: playerPickSpeed_int32,
      playerMoveSpeed: playerMoveSpeed_int32,
      abilityPoint: abilityPoint_int32,
    };
  },
  ItemInfo: (itemId_int32, stack_int32) => {
    return { itemId: itemId_int32, stack: stack_int32 };
  },
  MemberCardInfo: (
    id_int32,
    nickname_string,
    currentSector_int32,
    isLeader_bool,
    isMine_bool,
  ) => {
    return {
      id: id_int32,
      nickname: nickname_string,
      currentSector: currentSector_int32,
      isLeader: isLeader_bool,
      isMine: isMine_bool,
    };
  },
  OwnedCharacter: (nickname_string, classCode_int32) => {
    return { nickname: nickname_string, classCode: classCode_int32 };
  },
  CollisionInfo: (
    sectorCode_int32,
    myType_int32,
    myId_int32,
    myPosition_Vec3,
    myRadius_float,
    myHeight_float,
    targetType_int32,
    targetId_int32,
    targetPosition_Vec3,
    targetRadius_float,
    targetHeight_float,
  ) => {
    return {
      sectorCode: sectorCode_int32,
      myType: myType_int32,
      myId: myId_int32,
      myPosition: myPosition_Vec3,
      myRadius: myRadius_float,
      myHeight: myHeight_float,
      targetType: targetType_int32,
      targetId: targetId_int32,
      targetPosition: targetPosition_Vec3,
      targetRadius: targetRadius_float,
      targetHeight: targetHeight_float,
    };
  },
  CollisionPushInfo: (
    hasCollision_bool,
    sectorCode_int32,
    myType_int32,
    myId_int32,
    targetType_int32,
    targetId_int32,
    pushDirection_Vec3,
    pushDistance_float,
  ) => {
    return {
      hasCollision: hasCollision_bool,
      sectorCode: sectorCode_int32,
      myType: myType_int32,
      myId: myId_int32,
      targetType: targetType_int32,
      targetId: targetId_int32,
      pushDirection: pushDirection_Vec3,
      pushDistance: pushDistance_float,
    };
  },
  Vec3: (x_float, y_float, z_float) => {
    return { x: x_float, y: y_float, z: z_float };
  },
  Resource: (resourceIdx_int32, resourceId_int32) => {
    return { resourceIdx: resourceIdx_int32, resourceId: resourceId_int32 };
  },
  StatInfo: (
    level_int32,
    stamina_int32,
    pickSpeed_int32,
    moveSpeed_int32,
    abilityPoint_int32,
    curStamina_int32,
    exp_int32,
    targetExp_int32,
  ) => {
    return {
      level: level_int32,
      stamina: stamina_int32,
      pickSpeed: pickSpeed_int32,
      moveSpeed: moveSpeed_int32,
      abilityPoint: abilityPoint_int32,
      curStamina: curStamina_int32,
      exp: exp_int32,
      targetExp: targetExp_int32,
    };
  },
  MonsterStatus: (
    monsterId_int32,
    monsterModel_int32,
    monsterName_string,
    monsterMoveSpeed_float,
  ) => {
    return {
      monsterId: monsterId_int32,
      monsterModel: monsterModel_int32,
      monsterName: monsterName_string,
      monsterMoveSpeed: monsterMoveSpeed_float,
    };
  },
  PartyInfo: (partyId_string, leaderId_int32, memberCount_int32) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int32,
      memberCount: memberCount_int32,
    };
  },
  InventorySlot: (slotIdx_int32, itemId_int32, stack_int32) => {
    return { slotIdx: slotIdx_int32, itemId: itemId_int32, stack: stack_int32 };
  },
  TrapInfo: (casterId_int32, pos_Vec3) => {
    return { casterId: casterId_int32, pos: pos_Vec3 };
  },
};

export default PAYLOAD_DATA;
