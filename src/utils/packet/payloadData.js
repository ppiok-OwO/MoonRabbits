const payloadData = {
    // PlayerInfo: (playerId, nickname, class_int) => {
    //   playerId, 
    //   nickname, 
    //   'class' : class_int,
    // },
    TransformInfo: (players) => {
      players;
    },
    StatInfo: (playerIds) => {
      playerIds;
    },
    ScreenText: (playerId, transform) => {
      playerId, transform;
    },
    ScreenTextAlignment: (playerId, animCode) => {
      playerId, animCode;
    },
    Color: (playerId, chatMsg) => {
      playerId, chatMsg;
    },
    DungeonInfo: (dungeonInfo, player, screenText, battleLog) => {
      dungeonInfo, player, screenText, battleLog;
    },
    MonsterStatus: () => {},
    ActionSet: (animCode, effectCode) => {
      animCode, effectCode;
    },
    PlayerStatus: (
      playerClass,
      playerLevel,
      playerName,
      playerFullHp,
      playerFullMp,
      playerCurHp,
      playerCurMp,
    ) => {
      playerClass,
        playerLevel,
        playerName,
        playerFullHp,
        playerFullMp,
        playerCurHp,
        playerCurMp;
    },
    BattleLog: (msg, typingAnimation, btns) => {
      msg, typingAnimation, btns;
    },
    BtnInfo: (msg, enable) => {
      msg, enable;
    },
  };
  
  export default payloadData;
  