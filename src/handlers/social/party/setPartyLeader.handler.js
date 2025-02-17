import { getPartySessions } from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

export const setPartyLeader = (socket, packetData) => {
  try {
    const { partyId, memberId } = packetData;

    // 파티 인스턴스
    const partySession = getPartySessions();
    const party = partySession.getParty(partyId);
    if (!party) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.PARTY_NOT_FOUND,
          '파티 정보를 찾을 수 없습니다.',
        ),
      );
      return;
    }

    const playerSession = getPlayerSession();

    // 파티장이 맞는지 검증
    const player = playerSession.getPlayer(socket);
    if (!player) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
      return;
    }
    const partyLeader = party.getPartyLeader();
    if (player !== partyLeader) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티장 변경 권한을 가지고 있지 않습니다.',
        ),
      );
      return;
    }

    // 파티장을 위임하려는 멤버의 ID가 파티에 존재하는가?
    const memberIds = party.getAllMemberIds();
    if (!memberIds.find((value) => value === memberId)) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티에 소속되지 않은 플레이어입니다.',
        ),
      );
      return;
    }

    // 파티장 교체
    const newLeader = party
      .getAllMemberSockets()
      .find((value) => value.id === memberId);
    party.setPartyLeader();

    const packet = Packet.S2CSetPartyLeader(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberIds(),
    );
  } catch (error) {
    handleError(socket, error);
  }
};
