import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_ID_LENGTH, TOTAL_LENGTH } from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_ID_LENGTH,
  },
  // 필요한 만큼 추가
  gameSession: {
    MAX_PLAYERS: 2,
  },
  ingame: {},
};
