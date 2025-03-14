import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const createPartyHandler = (socket, packetData) => {
  try {
    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    if (!player) {
      const packet = PACKET.S2CChat(
        0,
        '플레이어 정보를 찾을 수 없습니다.',
        'System',
      );

      return socket.write(packet);
    }

    // 파티가 이미 생성되었으면 return
    if (player.getPartyId()) {
      const packet = PACKET.S2CChat(0, '이미 파티를 생성하였습니다.', 'System');

      return socket.write(packet);
    }

    const partySession = getPartySessions();
    const party = partySession.addParty(socket, player);
    const partyId = party.getId();
    player.setPartyId(partyId);

    const packet = PACKET.S2CCreateParty(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberCardInfo(player.id),
    );

    // 파티 세션에 브로드캐스트
    return party.notify(packet);
  } catch (error) {
    handleError(socket, error);
  }
};
