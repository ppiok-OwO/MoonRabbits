import { getPlayerSession } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';v

export const selectAvailablePointHandler = (socket, packetData) => {
  const { investPoints } = packetData; // [[statCode:?, point:?],

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  try {
    investPoints.forEach(({ statCode, point }) => {
      player.addStat(statCode, point);
      console.log(`${player.nickname}의 능력치(${statCode}) ${point}만큼 증가 (스탯 미구현)`);
    });
  } catch (error) {
    handleError(socket, new CustomError(ErrorCodes.INVALID_PACKET, 'selectAP 오류 패킷 전송'));
  }

  try {
    socket.write(Packet.S2CSelectAP(player.getPlayerStats()));
  } catch (error) {
    throw new Error(`selectAP 오류 패킷 전송`);
  }
};
