import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const monsterActionResponseHandler = (
  dungeon,
  monsterIdx,
  actionSet,
) => {
  try {
    const payloadMonsterAction = payload.S_MonsterAction(monsterIdx, actionSet);
    dungeon.notify(makePacket(PACKET_ID.S_MonsterAction, payloadMonsterAction));
  } catch (error) {
    console.error(error);
  }
};
