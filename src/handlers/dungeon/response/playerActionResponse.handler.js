import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const playerActionResponseHandler = (dungeon, playerId, actionSet) => {
  try {
    const payloadPlayerAction = payload.S_PlayerAction(playerId, actionSet);
    dungeon.notify(makePacket(PACKET_ID.S_PlayerAction, payloadPlayerAction));
  } catch (error) {
    console.error(error);
  }
};
