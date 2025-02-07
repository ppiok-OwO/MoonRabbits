import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';
import { getDungeonSessions } from '../../../session/sessions.js';

export const leaveDungeonResponseHandler = (dungeon) => {
  try {
    const payloadleaveDungeon = payload.S_LeaveDungeon();
    dungeon.notify(makePacket(PACKET_ID.S_LeaveDungeon, payloadleaveDungeon));
    getDungeonSessions().removeDungeon(dungeon.id);
  } catch (error) {
    console.error(error);
  }
};
