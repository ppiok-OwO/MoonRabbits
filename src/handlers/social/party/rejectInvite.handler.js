import { getPlayerSession } from '../../../session/sessions.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const rejectInviteHandler = (socket, packetData) => {
  try {
    const { memberId } = packetData;

    const playerSession = getPlayerSession();
    const member = playerSession.getPlayer(socket);
    if (!member) {
      const packet = PACKET.S2CChat(0, '올바르지 않은 접근입니다.', 'System');
      return socket.write(packet);
    }

    return (member.isInvited = false);
  } catch (error) {
    handleError(socket, error);
  }
};
