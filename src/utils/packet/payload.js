const payload = {
  S_Enter: (player_PlayerInfo) => {
    return { player: player_PlayerInfo };
  },
  S_Spawn: (players_ArrayOfPlayerInfo) => {
    return { players: players_ArrayOfPlayerInfo };
  },
  S_Despawn: (playerIds_ArrayOfInt) => {
    return { playerIds: playerIds_ArrayOfInt };
  },
  S_Location: (playerId_int, transform_TransformInfo) => {
    return { playerId: playerId_int, transform: transform_TransformInfo };
  },
  S_Animation: (playerId_int, animCode_int) => {
    return { playerId: playerId_int, animCode: animCode_int };
  },
  S_Chat: (playerId_int, chatMsg_string) => {
    return { playerId: playerId_int, chatMsg: chatMsg_string };
  },
  S_EnterDungeon: (
    dungeonInfo_DungeonInfo,
    player_PlayerStatus,
    screenText_ScreenText,
    battleLog_BattleLog,
  ) => {
    return {
      dungeonInfo: dungeonInfo_DungeonInfo,
      player: player_PlayerStatus,
      screenText: screenText_ScreenText,
      battleLog: battleLog_BattleLog,
    };
  },
  S_LeaveDungeon: () => {
    return {};
  },
  S_ScreenText: (screenText_ScreenText) => {
    return { screenText: screenText_ScreenText };
  },
  S_ScreenDone: () => {
    return {};
  },
  S_BattleLog: (battleLog_BattleLog) => {
    return { battleLog: battleLog_BattleLog };
  },
  S_SetPlayerHp: (hp_float) => {
    return { hp: hp_float };
  },
  S_SetPlayerMp: (mp_float) => {
    return { mp: mp_float };
  },
  S_SetMonsterHp: (monsterIdx_int, hp_float) => {
    return { monsterIdx: monsterIdx_int, hp: hp_float };
  },
  S_PlayerAction: (targetMonsterIdx_int, actionSet_ActionSet) => {
    return {
      targetMonsterIdx: targetMonsterIdx_int,
      actionSet: actionSet_ActionSet,
    };
  },
  S_MonsterAction: (actionMonsterIdx_int, actionSet_ActionSet) => {
    return {
      actionMonsterIdx: actionMonsterIdx_int,
      actionSet: actionSet_ActionSet,
    };
  },
};

export default payload;
