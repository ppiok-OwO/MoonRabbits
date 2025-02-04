const payload = {
  S_Enter: (playerInfo) => {
    playerInfo;
  },
  S_Spawn: (players) => {
    players;
  },
  S_Despawn: (playerIds) => {
    playerIds;
  },
  S_Move: (playerId, transform) => {
    playerId, transform;
  },
  S_Animation: (playerId, animCode) => {
    playerId, animCode;
  },
  S_Chat: (playerId, chatMsg) => {
    playerId, chatMsg;
  },
  S_EnterDungeon: (dungeonInfo, player, screenText, battleLog) => {
    dungeonInfo, player, screenText, battleLog;
  },
  S_LeaveDungeon: () => {},
  S_ScreenText: (screenText) => {
    screenText;
  },
  S_ScreenDone: () => {},
  S_BattleLog: (battleLog) => {
    battleLog;
  },
  S_SetPlayerHp: (hp) => {
    hp;
  },
  S_SetPlayerMp: (mp) => {
    mp;
  },
  S_SetMonsterHp: (monsterIdx, hp) => {
    monsterIdx, hp;
  },
  S_PlayerAction: (targetMonsterIdx, actionSet) => {
    targetMonsterIdx, actionSet;
  },
  S_MonsterAction: (actionMonsterIdx, actionSet) => {
    actionMonsterIdx, actionSet;
  },
};

export default payload;
