import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
} from '../constants/env.js';
import { PACKET_ID, PACKET_ID_LENGTH, PACKET_SIZE } from '../constants/header.js';
import { BASE_STAT_DATA } from '../constants/PlayerBaseStat.js';
import { BATTLE_LOG_ID } from '../constants/BattleLog.js';
export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalSize: PACKET_SIZE,
    idLength: PACKET_ID_LENGTH,
  },
  databases: {
    PROJECT_R_USER_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
  },
  packetId: {
    C_Enter: PACKET_ID.C_Enter,
    S_Enter: PACKET_ID.S_Enter,
    S_Spawn: PACKET_ID.S_Spawn,
    S_Despawn: PACKET_ID.S_Despawn,
    C_Move: PACKET_ID.C_Move,
    S_Move: PACKET_ID.S_Move,
    C_Animation: PACKET_ID.C_Animation,
    S_Animation: PACKET_ID.S_Animation,
    C_Chat: PACKET_ID.C_Chat,
    S_Chat: PACKET_ID.S_Chat,
    C_EnterDungeon: PACKET_ID.C_EnterDungeon,
    C_PlayerResponse: PACKET_ID.C_PlayerResponse,
    S_EnterDungeon: PACKET_ID.S_EnterDungeon,
    S_LeaveDungeon: PACKET_ID.S_LeaveDungeon,
    S_ScreenText: PACKET_ID.S_ScreenText,
    S_ScreenDone: PACKET_ID.S_ScreenDone,
    S_BattleLog: PACKET_ID.S_BattleLog,
    S_SetPlayerHp: PACKET_ID.S_SetPlayerHp,
    S_SetPlayerMp: PACKET_ID.S_SetPlayerMp,
    S_SetMonsterHp: PACKET_ID.S_SetMonsterHp,
    S_PlayerAction: PACKET_ID.S_PlayerAction,
    S_MonsterAction: PACKET_ID.S_MonsterAction,
    C_Register: PACKET_ID.C_Register,
    S_Register: PACKET_ID.S_Register,
    C_Login: PACKET_ID.C_Login,
    S_Login: PACKET_ID.S_Login,
  },
  newPlayerStatData: {
    BASE_STAT_DATA,
  },
  battletag: {
    Menu: BATTLE_LOG_ID.menu,
    Attack: BATTLE_LOG_ID.attack,
  },
};

export const packetIdEntries = Object.entries(config.packetId);
