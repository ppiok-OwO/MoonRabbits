import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

export const setPartyLeaderHandler = (socket, packetData) => {
  try {
    const { partyId, memberId } = packetData;

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

    // 파티장을 위임하려는 멤버가 파티에 존재하는가?
    const newLeader = party
      .getAllMemberEntries()
      .find(([key, value]) => value.id === memberId);
    if (!validateNewLeader) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티에 소속되지 않은 플레이어입니다.',
        ),
      );
    }

    // 파티장 교체
    party.setPartyLeader(newLeader[1]);

    // 각 멤버에 대하여 맞춤형 패킷 생성
    const members = party.getAllMemberEntries();

    members.forEach(([key, value]) => {
      const packet = Packet.S2CLeaveParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(packet);
    });
  } catch (error) {
    handleError(socket, error);
  }
};
