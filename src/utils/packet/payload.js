// 다양한 페이로드 데이터를 생성하는 객체 정의
// 명칭의 구분을 위해 재 정의
// payload.js
const payload = {
  //#region /* 게임 시작 관련 */
  C2SRegister: (email_string, pw_string, pwCheck_string) => {
    return { email: email_string, pw: pw_string, pwCheck: pwCheck_string };
  },
  S2CRegister: (isSuccess_bool, msg_string) => {
    return { isSuccess: isSuccess_bool, msg: msg_string };
  },
  C2SLogin: (email_string, pw_string) => {
    return { email: email_string, pw: pw_string };
  },
  S2CLogin: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_ArrayOwnedCharacters,
  ) => {
    return {
      isSuccess: isSuccess_bool,
      msg: msg_string,
      ownedCharacters: ownedCharacters_ArrayOwnedCharacters,
    };
  },
  C2SCreateCharacter: (nickname_string, classCode_int) => {
    return { nickname: nickname_string, classCode: classCode_int };
  },
  S2CCreateCharacter: (isSuccess_bool, msg_string) => {
    return { isSuccess: isSuccess_bool, msg: msg_string };
  },
  /* 마을 관련 */
  C2SEnter: (nickname_string, classCode_int, targetScene_int) => {
    return {
      nickname: nickname_string,
      classCode: classCode_int,
      targetScene: targetScene_int,
    };
  },
  S2CEnter: (player_PlayerInfo) => {
    return { player: player_PlayerInfo };
  },
  C2SAnimation: (animCode_int) => {
    return { animCode: animCode_int };
  },
  S2CAnimation: (playerId_int, animCode_int) => {
    return { playerId: playerId_int, animCode: animCode_int };
  },
  //#endregion
  //#region /* 공통 01 - 채팅, 소환 */
  C2SChat: (playerId_int, senderName_string, chatMsg_string) => {
    return {
      playerId: playerId_int,
      senderName: senderName_string,
      chatMsg: chatMsg_string,
    };
  },
  S2CChat: (playerId_int, chatMsg_string) => {
    return { playerId: playerId_int, chatMsg: chatMsg_string };
  },
  S2CPlayerSpawn: (players_ArrayOfPlayerInfo) => {
    return { players: players_ArrayOfPlayerInfo };
  },
  S2CPlayerDespawn: (playerIds_ArrayOfInt, currentScene_int) => {
    return { playerIds: playerIds_ArrayOfInt, currentScene: currentScene_int };
  },
  //#endregion
  //#region /* 공통 02 - 플레이어 이동 */
  C2SPlayerMove: (
    startPosX_float,
    startPosY_float,
    startPosZ_float,
    targetPosX_float,
    targetPosY_float,
    targetPosZ_float,
  ) => {
    return {
      startPosX: startPosX_float,
      startPosY: startPosY_float,
      startPosZ: startPosZ_float,
      targetPosX: targetPosX_float,
      targetPosY: targetPosY_float,
      targetPosZ: targetPosZ_float,
    };
  },
  C2SPlayerLocation: (transform_TransformInfo) => {
    return { transform: transform_TransformInfo };
  },
  S2CPlayerLocation: (
    playerId_int,
    transform_TransformInfo,
    isValidTransform_bool,
    currentScene_int,
  ) => {
    return {
      playerId: playerId_int,
      transform: transform_TransformInfo,
      isValidTransform: isValidTransform_bool,
      currentScene: currentScene_int,
    };
  },
  //#endregion
  //#region /* 공통 03 - 충돌 관련 */
  C2SPlayerCollision: (playerId_int, collisionInfo_CollisionInfo) => {
    return {
      playerId: playerId_int,
      collisionInfo: collisionInfo_CollisionInfo,
    };
  },
  S2CPlayerCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
    return {
      playerId: playerId_int,
      collisionPushInfo: collisionPushInfo_CollisionPushInfo,
    };
  },
  C2SMonsterCollision: (playerId_int, collisionInfo_CollisionInfo) => {
    return {
      playerId: playerId_int,
      collisionInfo: collisionInfo_CollisionInfo,
    };
  },
  S2CMonsterCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
    return {
      playerId: playerId_int,
      collisionPushInfo: collisionPushInfo_CollisionPushInfo,
    };
  },
  /* 파티 관련 */
  C2SCreateParty: (partyId_string, leaderId_int) => {
    return { partyId: partyId_string, leaderId: leaderId_int };
  },
  S2CCreateParty: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  C2SInviteParty: (partyId_string, nickname_string) => {
    return { partyId: partyId_string, nickname: nickname_string };
  },
  S2CInviteParty: (leaderNickname_string, partyId_string, memberId_int) => {
    return {
      leaderNickname: leaderNickname_string,
      partyId: partyId_string,
      memberId: memberId_int,
    };
  },
  C2SJoinParty: (partyId_string, newMemberId_int) => {
    return { partyId: partyId_string, newMemberId: newMemberId_int };
  },
  S2CJoinParty: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  C2SLeaveParty: (partyId_string, leftPlayerId_int) => {
    return { partyId: partyId_string, leftPlayerId: leftPlayerId_int };
  },
  S2CLeaveParty: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  C2SSetPartyLeader: (partyId_string, memberId_int) => {
    return { partyId: partyId_string, memberId: memberId_int };
  },
  S2CSetPartyLeader: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  S2CKickOutMember: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  S2CAllowInvite: (
    partyId_string,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberCardInfo,
  ) => {
    return {
      partyId: partyId_string,
      leaderId: leaderId_int,
      memberCount: memberCount_int,
      members: members_ArrayOfMemberCardInfo,
    };
  },
  S2CDisbandParty: (msg_string) => {
    return { msg: msg_string };
  },

  /* 던전 관련 */
  C2SDungeonEnter: (dungeonCode_int, partyId_string) => {
    return partyId_string
      ? { dungeonCode: dungeonCode_int, partyId: partyId_string }
      : { dungeonCode: dungeonCode_int };
  },
  S2CDungeonEnter: (dungeonInfo_DungeonInfo, player_PlayerStatus) => {
    return {
      dungeonInfo: dungeonInfo_DungeonInfo,
      player: player_PlayerStatus,
    };
  },
  //#endregion
  //#region /* 전투 관련 */
  C2SAttack: (targetId_int, attackType_AttackType) => {
    return { targetId: targetId_int, attackType: attackType_AttackType };
  },
  S2CAttack: (attackerId_int, attackType_AttackType, animCode_int) => {
    return {
      attackerId: attackerId_int,
      attackType: attackType_AttackType,
      animCode: animCode_int,
    };
  },
  C2SHit: (attackerId_int, attackType_AttackType, hitPlayerId_int) => {
    return {
      attackerId: attackerId_int,
      attackType: attackType_AttackType,
      hitPlayerId: hitPlayerId_int,
    };
  },
  S2CHit: (hitPlayerId_int, animCode_int, damage_int, updatedHp_float) => {
    return {
      hitPlayerId: hitPlayerId_int,
      animCode: animCode_int,
      damage: damage_int,
      updatedHp: updatedHp_float,
    };
  },
  S2CDie: (deadPlayerId_int, animCode_int) => {
    return { deadPlayerId: deadPlayerId_int, animCode: animCode_int };
  },
  /* 몬스터 이동 관련 */
  C2SMonsterLocation: (monsterId_int, transform_TransformInfo) => {
    return { monsterId: monsterId_int, transform: transform_TransformInfo };
  },
  S2CMonsterLocation: (monsterId_int, transform_TransformInfo) => {
    return { monsterId: monsterId_int, transform: transform_TransformInfo };
  },
  //#endregion
  //#region /* 채집 관련 */

  S2CResourcesList: (resources_resource) => {
    return { resources: resources_resource };
  },
  S2CUpdateDurability: (placedId_int, durabillity_int) => {
    return { placedId: placedId_int, durabillity: durabillity_int };
  },
  C2SStartGathering: (placedId_int) => {
    return { placedId: placedId_int };
  },
  S2CStartGathering: (placedId_int, angle_int, difficulty_int) => {
    return {
      placedId: placedId_int,
      angle: angle_int,
      difficulty: difficulty_int,
    };
  },
  C2SGatheringSkillCheck: (placedId_int, deltatime_int) => {
    return { placedId: placedId_int, deltatime: deltatime_int };
  },
  S2CGatheringSkillCheck: (placedId_int, durabillity_int) => {
    return { placedId: placedId_int, durabillity: durabillity_int };
  },
  S2CGatheringDone: (placedId_int, ItemId_int, quentity_int) => {
    return {
      placedId: placedId_int,
      ItemId: ItemId_int,
      quentity: quentity_int,
    };
  },

  //#endregion

  /*기존 코드 */
  // S_Enter: (player_PlayerInfo) => {
  //   return { player: player_PlayerInfo };
  // },
  // S_Spawn: (players_ArrayOfPlayerInfo) => {
  //   return { players: players_ArrayOfPlayerInfo };
  // },
  // S_Despawn: (playerIds_ArrayOfInt) => {
  //   return { playerIds: playerIds_ArrayOfInt };
  // },
  // S_Move: (playerId_int, transform_TransformInfo) => {
  //   return { playerId: playerId_int, transform: transform_TransformInfo };
  // },
  // S_Animation: (playerId_int, animCode_int) => {
  //   return { playerId: playerId_int, animCode: animCode_int };
  // },
  // S_Chat: (playerId_int, chatMsg_string) => {
  //   return { playerId: playerId_int, chatMsg: chatMsg_string };
  // },
  // S_EnterDungeon: (
  //   dungeonInfo_DungeonInfo,
  //   player_PlayerStatus,
  //   screenText_ScreenText,
  //   battleLog_BattleLog,
  // ) => {
  //   return {
  //     dungeonInfo: dungeonInfo_DungeonInfo,
  //     player: player_PlayerStatus,
  //     screenText: screenText_ScreenText,
  //     battleLog: battleLog_BattleLog,
  //   };
  // },
  // S_LeaveDungeon: () => {
  //   return {};
  // },
  // S_ScreenText: (screenText_ScreenText) => {
  //   return { screenText: screenText_ScreenText };
  // },
  // S_ScreenDone: () => {
  //   return {};
  // },
  // S_BattleLog: (battleLog_BattleLog) => {
  //   return { battleLog: battleLog_BattleLog };
  // },
  // S_SetPlayerHp: (hp_float) => {
  //   return { hp: hp_float };
  // },
  // S_SetPlayerMp: (mp_float) => {
  //   return { mp: mp_float };
  // },
  // S_SetMonsterHp: (monsterIdx_int, hp_float) => {
  //   return { monsterIdx: monsterIdx_int, hp: hp_float };
  // },
  // S_PlayerAction: (targetMonsterIdx_int, actionSet_ActionSet) => {
  //   return {
  //     targetMonsterIdx: targetMonsterIdx_int,
  //     actionSet: actionSet_ActionSet,
  //   };
  // },
  // S_MonsterAction: (actionMonsterIdx_int, actionSet_ActionSet) => {
  //   return {
  //     actionMonsterIdx: actionMonsterIdx_int,
  //     actionSet: actionSet_ActionSet,
  //   };
  // },
};

export default payload;
