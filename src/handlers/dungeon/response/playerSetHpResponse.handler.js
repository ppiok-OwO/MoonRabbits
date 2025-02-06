import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const playerSetHpResponseHandler = (dungeon, playerId, hp) => {
  try {
    const payloadSetPlayerHp = payload.S_SetPlayerHp(hp);
    dungeon.notify(makePacket(PACKET_ID.S_SetPlayerHp, payloadSetPlayerHp));
  } catch (error) {
    console.error(error);
  }
};
