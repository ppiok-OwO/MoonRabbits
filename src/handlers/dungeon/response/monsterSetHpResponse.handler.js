import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';

export const monsterSetHpResponseHandler = (dungeon, monsterIdx, hp) => {
  try {
    const payloadSetMonsterHp = payload.S_SetMonsterHp(monsterIdx, hp);
    dungeon.notify(makePacket(PACKET_ID.S_SetMonsterHp, payloadSetMonsterHp));
  } catch (error) {
    console.error(error);
  }
};
