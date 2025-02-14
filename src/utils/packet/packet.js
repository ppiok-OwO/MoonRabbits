import { config } from '../../config/config.js';
import makePacket from './makePacket.js';

const Packet = {
  C_Enter: (nickname_string, class_string) => {
    return makePacket(config.packetId.C_Enter, {
      nickname: nickname_string,
      class: class_string,
    });
  },
  S_Enter: (player_PlayerInfo) => {
    return makePacket(config.packetId.S_Enter, { player: player_PlayerInfo });
  },
  S_Spawn: (players_ArrayOfPlayerInfo) => {
    return makePacket(config.packetId.S_Spawn, {
      players: players_ArrayOfPlayerInfo,
    });
  },
  S_Despawn: (playerIds_ArrayOfInt) => {
    return makePacket(config.packetId.S_Despawn, {
      playerIds: playerIds_ArrayOfInt,
    });
  },
  S_Location: (
    playerId_int,
    transform_TransformInfo,
    isValidTransform_bool,
  ) => {
    return makePacket(config.packetId.S_Location, {
      playerId: playerId_int,
      transform: transform_TransformInfo,
      isValidTransform: isValidTransform_bool,
    });
  },
  C_Move: (
    startPosX_float,
    startPosY_float,
    startPosZ_float,
    targetPosX_float,
    targetPosY_float,
    targetPosZ_float,
  ) => {
    return makePacket(config.packetId.C_Move, {
      startPosX: startPosX_float,
      startPosY: startPosY_float,
      startPosZ: startPosZ_float,
      targetPosX: targetPosX_float,
      targetPosY: targetPosY_float,
      targetPosZ: targetPosZ_float,
    });
  },
  S_Move: () => {
    return makePacket(config.packetId.S_Move, {});
  },
  S_Animation: (playerId_int, animCode_int) => {
    return makePacket(config.packetId.S_Animation, {
      playerId: playerId_int,
      animCode: animCode_int,
    });
  },
  S_Chat: (playerId_int, chatMsg_string) => {
    return makePacket(config.packetId.S_Chat, {
      playerId: playerId_int,
      chatMsg: chatMsg_string,
    });
  },
  S_EnterDungeon: (
    dungeonInfo_DungeonInfo,
    player_PlayerStatus,
    screenText_ScreenText,
    battleLog_BattleLog,
  ) => {
    return makePacket(config.packetId.S_EnterDungeon, {
      dungeonInfo: dungeonInfo_DungeonInfo,
      player: player_PlayerStatus,
      screenText: screenText_ScreenText,
      battleLog: battleLog_BattleLog,
    });
  },
  S_LeaveDungeon: () => {
    return makePacket(config.packetId.S_LeaveDungeon, {});
  },
  S_ScreenText: (screenText_ScreenText) => {
    return makePacket(config.packetId.S_ScreenText, {
      screenText: screenText_ScreenText,
    });
  },
  S_ScreenDone: () => {
    return makePacket(config.packetId.S_ScreenDone, {});
  },
  S_BattleLog: (battleLog_BattleLog) => {
    return makePacket(config.packetId.S_BattleLog, {
      battleLog: battleLog_BattleLog,
    });
  },
  S_SetPlayerHp: (hp_float) => {
    return makePacket(config.packetId.S_SetPlayerHp, { hp: hp_float });
  },
  S_SetPlayerMp: (mp_float) => {
    return makePacket(config.packetId.S_SetPlayerMp, { mp: mp_float });
  },
  S_SetMonsterHp: (monsterIdx_int, hp_float) => {
    return makePacket(config.packetId.S_SetMonsterHp, {
      monsterIdx: monsterIdx_int,
      hp: hp_float,
    });
  },
  S_PlayerAction: (targetMonsterIdx_int, actionSet_ActionSet) => {
    return makePacket(config.packetId.S_PlayerAction, {
      targetMonsterIdx: targetMonsterIdx_int,
      actionSet: actionSet_ActionSet,
    });
  },
  S_MonsterAction: (actionMonsterIdx_int, actionSet_ActionSet) => {
    return makePacket(config.packetId.S_MonsterAction, {
      actionMonsterIdx: actionMonsterIdx_int,
      actionSet: actionSet_ActionSet,
    });
  },
  S_Register: (isSuccess_bool, msg_string) => {
    return makePacket(config.packetId.S_Register, {
      isSuccess: isSuccess_bool,
      msg: msg_string,
    });
  },
  S_Login: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_ArrayOfOwnedCharacters,
  ) => {
    return makePacket(config.packetId.S_Login, {
      isSuccess: isSuccess_bool,
      msg: msg_string,
      ownedCharacters: ownedCharacters_ArrayOfOwnedCharacters,
    });
  },
  S_CreateCharacter: (isSuccess_bool,msg_string) => {
    return makePacket(config.packetId.S_CreateCharacter, {
        isSuccess : isSuccess_bool,
        msg:msg_string
    });
  }
};

export default Packet;
