import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const leaveDungeonResponseHandler = (dungeon) => {
  try {
    const payloadleaveDungeon = payload.S_LeaveDungeon();
    dungeon.notify(makePacket(PACKET_ID.S_LeaveDungeon, payloadleaveDungeon));
  } catch (error) {
    console.error(error);
  }
};
