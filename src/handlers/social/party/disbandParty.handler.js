import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

export const disbandPartyHandler = (socket, packetData) => {
  try {
    const { partyId } = packetData;
    // 파티 인스턴스
    const partySession = getPartySessions();
    const party = partySession.getParty(partyId);
    if (!party) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.PARTY_NOT_FOUND,
          '파티 정보를 찾을 수 없습니다.',
        ),
      );
    }

    const playerSession = getPlayerSession();

    // 파티장이 맞는지 검증
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
    const partyLeader = party.getPartyLeader();
    if (player !== partyLeader) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티 해체 권한을 가지고 있지 않습니다.',
        ),
      );
    }

    const allMembers = party.getAllMemberEntries();

    // 파티 해체
    const packet = Packet.S2CDisbandParty('파티가 해체되었습니다.');

    allMembers.forEach(([key, value]) => {
      value.isInParty = false;
      key.write(packet);
    });

    party.disbandParty();
  } catch (error) {
    handleError(socket, error);
  }
};
