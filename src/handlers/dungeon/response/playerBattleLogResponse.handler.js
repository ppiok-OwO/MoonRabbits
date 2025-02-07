import { PACKET_ID } from '../../../constants/header.js';
import makePacket from '../../../utils/packet/makePacket.js';
import payload from '../../../utils/packet/payload.js';
import payloadData from '../../../utils/packet/payloadData.js';

export const playerBattleLogResponseHandler = (
  player,
  BattleLogId,
  msg,
  typingAnimation,
  buttons,
) => {
  //개인에게만 전송
  try {
    player.lastBattleLog = BattleLogId;
    const payloadBattlelog = payload.S_BattleLog(
      payloadData.BattleLog(msg, typingAnimation, buttons),
    );
    player.sendPacket(makePacket(PACKET_ID.S_BattleLog, payloadBattlelog));
  } catch (error) {
    console.error(error);
  }
};
