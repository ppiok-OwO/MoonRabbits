import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

export const kickOutParty = (socket, packetData) => {
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
          '파티원 퇴출 권한을 가지고 있지 않습니다.',
        ),
      );
      return;
    }

    // 퇴출시키려는 멤버가 파티에 존재하는가?
    const member = party
      .getAllMemberSockets()
      .find((value) => value.id === memberId);
    if (!member) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티에 소속되지 않은 플레이어입니다.',
        ),
      );
      return;
    }

    // 멤버 퇴출
    party.removeMember(memberId);

    // 변경된 파티 데이터 브로드캐스트
    const packet = Packet.S2CKickOutMember(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberIds(),
    );
    const msgToParty = Packet.S2CChat(
      0,
      `${member.nickname}님이 파티에서 추방되었습니다.`,
    );

    party.notify(packet);
    party.notify(msgToParty);

    // 퇴출된 멤버에게 메시지 전송
    const msgToKickedMember = Packet.S2CChat(0, '파티에서 추방당하셨습니다.');
    party.notify(msgToKickedMember);
  } catch (error) {
    handleError(socket, error);
  }
};
