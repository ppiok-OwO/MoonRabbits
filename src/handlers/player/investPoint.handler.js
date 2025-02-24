import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { updatePlayerStat } from '../../db/user/user.db.js';

export const investPointHandler = async (socket, packetData) => {
  const { statCode } = packetData;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const validAP = player.addStat(statCode);

  // 버튼 사라지기 전에 AP보다 더 많이 누른 경우, addStat에서도 바로 리턴됨
  if(!validAP) {
    return;
  }

  const statInfo = player.getStatInfo();

  // DB 반영
  await updatePlayerStat(statInfo.stamina, statInfo.pickSpeed, statInfo.moveSpeed, statInfo.abilityPoint, socket.player.playerId);
  console.log('5. 스탯 DB 능력치 업데이트 완료');

  // 클라이언트 반영
  try {
    socket.write(Packet.S2CInvestPoint(statInfo));
  } catch (error) {
    throw new Error(`S2CInvestPoint 오류 패킷 전송`);
  }
};
