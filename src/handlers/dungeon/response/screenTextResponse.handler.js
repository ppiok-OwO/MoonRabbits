import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';
import payloadData from '../../../utils/packet/payloadData.js';

export const screenTextResponseHandler = (dungeon, text) => {
  try {
    const payloadScreenText = payload.S_ScreenText(
      payloadData.ScreenText(text, true),
    );
    dungeon.notify(makePacket(PACKET_ID.S_ScreenText, payloadScreenText));
  } catch (error) {
    console.error(error);
  }
};