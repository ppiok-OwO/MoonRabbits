import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const investPointHandler = (socket, packetData) => {
  const { statCode } = packetData;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  player.addStat(statCode, 1);
  switch(statCode){
    case 1:
      console.log('클라이언트 stamina 포인트 투자');
      break;
    case 2:
      console.log('클라이언트 pickSpeed 포인트 투자');
      break;
    case 3:
      console.log('클라이언트 moveSpeed 포인트 투자');
      break;
    default:
      console.log('유효하지 않은 스탯코드', statCode);
      return;
  }

  // try {
  //   investPoints.forEach(({ statCode, point }) => {
  //     console.log(`${player.nickname}의 능력치(${statCode}) ${point}만큼 증가 (스탯 미구현)`);
  //   });
  // } catch (error) {
  //   handleError(socket, new CustomError(ErrorCodes.INVALID_PACKET, 'selectAP 오류 패킷 전송'));
  // }

  try {
    socket.write(Packet.S2CSelectAP(player.getPlayerStats()));
  } catch (error) {
    throw new Error(`selectAP 오류 패킷 전송`);
  }
};
