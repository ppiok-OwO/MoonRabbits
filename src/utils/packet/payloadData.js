const PAYLOAD_DATA = {
  PlayerInfo: (
    playerId_int32,
    nickname_string,
    level_int32,
    classCode_int32,
    transform_TransformInfo,
    statInfo_StatInfo,
    currentScene_int32,
  ) => {
    return {
      playerId: playerId_int32,
      nickname: nickname_string,
      level: level_int32,
      classCode: classCode_int32,
      transform: transform_TransformInfo,
      statInfo: statInfo_StatInfo,
      currentScene: currentScene_int32,
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
  MemberCardInfo: (id_int32, nickname_string, isLeader_bool, isMine_bool) => {
    return {
      id: id_int32,
      nickname: nickname_string,
      isLeader: isLeader_bool,
      isMine: isMine_bool,
    };
  },
  OwnedCharacter: (nickname_string, classCode_int32) => {
    return { nickname: nickname_string, classCode: classCode_int32 };
  },
  CollisionInfo: (
    position1_Vec3,
    position2_Vec3,
    radius1_float,
    radius2_float,
    height1_float,
    height2_float,
  ) => {
    return {
      position1: position1_Vec3,
      position2: position2_Vec3,
      radius1: radius1_float,
      radius2: radius2_float,
      height1: height1_float,
      height2: height2_float,
    };
  },
  CollisionPushInfo: (
    hasCollision_bool,
    pushDirection_Vec3,
    pushDistance_float,
  ) => {
    return {
      hasCollision: hasCollision_bool,
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
  InvestPoint: (statCode_int32, point_int32) => {
    return { statCode: statCode_int32, point: point_int32 };
  },
  StatInfo: (
    level_int32,
    stamina_int32,
    pickSpeed_int32,
    moveSpeed_int32,
    abilityPoint_int32,
  ) => {
    return {
      level: level_int32,
      stamina: stamina_int32,
      pickSpeed: pickSpeed_int32,
      moveSpeed: moveSpeed_int32,
      abilityPoint: abilityPoint_int32,
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
  PartyInfo: (partyId_string, leaderId_int, memeberCount_int) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memeberCount: memeberCount_int,
    };
  },
};

export default PAYLOAD_DATA;
