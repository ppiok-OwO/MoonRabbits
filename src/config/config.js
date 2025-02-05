import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import {
  PACKET_ID,
  PACKET_ID_LENGTH,
  PACKET_SIZE,
} from '../constants/header.js';

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
    C_Move: PACKET_ID.C_Move,
    S_Move: PACKET_ID.S_Move,
    C_Chat: PACKET_ID.C_Chat,
    S_Chat: PACKET_ID.S_Chat,
  },
};
