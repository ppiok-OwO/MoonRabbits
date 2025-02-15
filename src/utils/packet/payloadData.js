const payloadData = {
  PlayerInfo: (
    playerId_int,
    nickname_string,
    classCode_int,
    transform_TransformInfo,
    statInfo_StatInfo,
  ) => {
    return {
      playerId: playerId_int,
      nickname: nickname_string,
      classCode: classCode_int,
      transform: transform_TransformInfo,
      statInfo: statInfo_StatInfo,
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
  StatInfo: (
    level_int,
    hp_float,
    maxHp_float,
    mp_float,
    maxMp_float,
    atk_float,
    def_float,
    magic_float,
    speed_float,
  ) => {
    return {
      level: level_int,
      hp: hp_float,
      maxHp: maxHp_float,
      mp: mp_float,
      maxMp: maxMp_float,
      atk: atk_float,
      def: def_float,
      magic: magic_float,
      speed: speed_float,
    };
  },
  ScreenText: (
    msg_string,
    typingAnimation_bool,
    alignment_ScreenTextAlignment_Optional = null,
    textColor_ColorObj_Optional = null,
    screenColor_ColorObj_optional = null,
  ) => {
    const payload = { msg: msg_string, typingAnimation: typingAnimation_bool };

    if (alignment_ScreenTextAlignment_Optional !== null)
      payload.alignment = alignment_ScreenTextAlignment_Optional;
    if (textColor_ColorObj_Optional !== null)
      payload.textColor = textColor_ColorObj_Optional;
    if (screenColor_ColorObj_optional !== null)
      payload.screenColor = screenColor_ColorObj_optional;

    return payload;
  },
  ScreenTextAlignment: (x_int, y_int) => {
    return { x: x_int, y: y_int };
  },
  ColorObj: (r_int, g_int, b_int) => {
    return { r: r_int, g: g_int, b: b_int };
  },
  DungeonInfo: (dungeonCode_int, monsters_ArrayOfMonsterStatus) => {
    return {
      dungeonCode: dungeonCode_int,
      monsters: monsters_ArrayOfMonsterStatus,
    };
  },
  MonsterStatus: (
    monsterIdx_int,
    monsterModel_int,
    monsterName_string,
    monsterHp_float,
  ) => {
    return {
      monsterIdx: monsterIdx_int,
      monsterModel: monsterModel_int,
      monsterName: monsterName_string,
      monsterHp: monsterHp_float,
    };
  },
  ActionSet: (animCode_int, effectCode_int) => {
    return { animCode: animCode_int, effectCode: effectCode_int };
  },
  PlayerStatus: (
    playerClass_int,
    playerLevel_int,
    playerName_string,
    playerFullHp_float,
    playerFullMp_float,
    playerCurHp_float,
    playerCurMp_float,
  ) => {
    return {
      playerClass: playerClass_int,
      playerLevel: playerLevel_int,
      playerName: playerName_string,
      playerFullHp: playerFullHp_float,
      playerFullMp: playerFullMp_float,
      playerCurHp: playerCurHp_float,
      playerCurMp: playerCurMp_float,
    };
  },
  BattleLog: (msg_string, typingAnimation_bool, btns_ArrayOfBtnInfo) => {
    return {
      msg: msg_string,
      typingAnimation: typingAnimation_bool,
      btns: btns_ArrayOfBtnInfo,
    };
  },
  BtnInfo: (msg_string, enable_bool) => {
    return { msg: msg_string, enable: enable_bool };
  },
  OwnedCharacters: (nickname_string, classCode_int) => {
    return { nickname: nickname_string, classCode: classCode_int };
  },
  MemberId: (playerId_int) => {
    return { playerId: playerId_int };
  },
  AttackType: (targetTransform_TransformInfo, skillId_int) => {
    return {
      targetTransform: targetTransform_TransformInfo,
      skillId: skillId_int,
    };
  },
  Vector3Obj: (x_float, y_float, z_float) => {
    return { x: x_float, y: y_float, z: z_float };
  },
  CollisionInfo: (
    position1_Vector3Obj,
    position2_Vector3Obj,
    radius1_float,
    radius2_float,
    height1_float,
    height2_float,
  ) => {
    return {
      position: position1_Vector3Obj,
      position2: position2_Vector3Obj,
      radius1: radius1_float,
      radius2: radius2_float,
      height1: height1_float,
      height2: height2_float,
    };
  },
  CollisionPushInfo: (
    hasCollision_bool,
    pushDirection_Vector3Obj,
    pushDistance_float,
  ) => {
    return {
      hasCollision: hasCollision_bool,
      pushDirection: pushDirection_Vector3Obj,
      pushDistance: pushDistance_float,
    };
  },
};

export default payloadData;
