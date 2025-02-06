import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import {
  PACKET_ID,
  PACKET_ID_LENGTH,
  PACKET_SIZE,
} from '../constants/header.js';
import { baseStatData } from '../constants/PlayerBaseStat.js';
import { BattleLogId } from '../constants/BattleLog.js';
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
  },
  newPlayerStatData: {
    baseStatData,
  },
  battletag: {
    Menu: BattleLogId.menu,
    Attack: BattleLogId.attack,
  },
};
