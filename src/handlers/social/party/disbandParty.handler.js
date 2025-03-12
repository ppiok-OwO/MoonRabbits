import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';

export const disbandPartyHandler = (socket, packetData) => {
  try {
    const { partyId } = packetData;
    // 파티 인스턴스
    const partySession = getPartySessions();
    const party = partySession.getParty(partyId);
    if (!party) {
      const packet = PACKET.S2CChat(
        0,
        '파티 정보를 찾을 수 없습니다.',
        'System',
      );

      return socket.write(packet);
    }

    const playerSession = getPlayerSession();

    // 파티장이 맞는지 검증
    const player = playerSession.getPlayer(socket);
    if (!player) {
      const packet = PACKET.S2CChat(
        0,
        '플레이어 정보를 찾을 수 없습니다.',
        'System',
      );

      return socket.write(packet);
    }
    const partyLeader = party.getPartyLeader();
    if (player !== partyLeader) {
      const packet = PACKET.S2CChat(0, '파티 해체 권한이 없습니다.', 'System');
      return socket.write(packet);
    }

    const allMembers = party.getAllMembers();

    // 파티 해체
    const packet = PACKET.S2CDisbandParty('파티가 해체되었습니다.');

    allMembers.forEach((value, key) => {
      value.partyId = null;
      key.write(packet);
    });

    party.disbandParty();
  } catch (error) {
    handleError(socket, error);
  }
};
