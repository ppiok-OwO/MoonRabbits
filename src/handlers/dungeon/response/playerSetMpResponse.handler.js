import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const playerSetMpResponseHandler = (dungeon, playerId, mp) => {
  try {
    const payloadSetPlayerMp = payload.S_SetPlayerMp(mp);
    dungeon.notify(makePacket(PACKET_ID.S_SetPlayerMp, payloadSetPlayerMp));
  } catch (error) {
    console.error(error);
  }
};
