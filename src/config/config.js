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
  },
  newPlayerStatData: {
    baseStatData,
  },
  battletag: {
    Menu: BattleLogId.menu,
    Attack: BattleLogId.attack,
  },
};
