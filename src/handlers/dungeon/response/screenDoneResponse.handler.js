import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const screenDoneResponseHandler = (dungeon) => {
  try {
    const payloadScreenDone = payload.S_ScreenDone();
    dungeon.notify(makePacket(PACKET_ID.S_ScreenDone, payloadScreenDone));
  } catch (error) {
    console.error(error);
  }
};
