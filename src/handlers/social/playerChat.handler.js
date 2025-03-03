import {
  getPartySessions,
  getSectorSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';
import PACKET from '../../utils/packet/packet.js';

export const chatHandler = (socket, packetData) => {
  try {
    const { playerId, chatMsg, chatType } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);
    if (!player) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    // 패킷 직렬화
    const packet = PACKET.S2CChat(playerId, chatMsg, chatType);

    const partyId = player.getPartyId();
    if (partyId && chatType === '파티') {
      // 만약 파티 id가 존재하고 chatType이 파티면
      const partySession = getPartySessions();
      const party = partySession.getParty(partyId);
      party.notify(packet);
    } else if (chatType === '전체') {
      playerSession.notify(packet);
    } else {
      const warningPacket = PACKET.S2CChat(
        0,
        '채팅 전송에 실패하였습니다.',
        'System',
      );
      socket.write(warningPacket);
    }
  } catch (error) {
    handleError(socket, error);
  }
};
