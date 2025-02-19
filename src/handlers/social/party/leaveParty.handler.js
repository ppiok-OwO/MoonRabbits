import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import Packet from '../../../utils/packet/packet.js';

export const leavePartyHandler = (socket, packetData) => {
  try {
    const { partyId, leftPlayerId } = packetData;
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

    // 해당 파티에 소속 중인지 확인
    const member = party
      .getAllMemberIds()
      .find((value) => value === leftPlayerId);
    if (!member) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티에 소속되지 않은 플레이어입니다.',
        ),
      );
    }

    // 소켓으로 구한 플레이어와 비교하기(패킷 유효성 검증)
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
    } else if (player !== member[1]) {
      return socket.emit(
        'error',
        new CustomError(ErrorCodes.USER_NOT_FOUND, '올바르지 않은 요청입니다.'),
      );
    }

    // 멤버 퇴출
    party.removeMember(leftPlayerId);
    member[1].isInParty = false;

    const members = party.getAllMemberEntries();

    // TOTO : 떠난 멤버가 파티장이면 setPartyLeader 패킷 전송
    const partyLeader = party.getPartyLeader();
    if (member[1] === partyLeader) {
      // party클래스에서 파티장 교체
      const newLeader = members[0];
      party.setPartyLeader(newLeader);

      // setPartyLeader 패킷 전송
      members.forEach(([key, value]) => {
        const packet = Packet.S2CSetPartyLeader(
          party.getId(),
          party.getPartyLeaderId(),
          party.getMemberCount(),
          party.getAllMemberCardInfo(value.id),
        );
        key.write(packet);
      });
    }

    // 각 멤버에 대하여 맞춤형 패킷 생성
    members.forEach(([key, value]) => {
      const packet = Packet.S2CLeaveParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(packet);
    });
    const msgToParty = Packet.S2CChat(
      0,
      `${member[1].nickname}님이 파티를 떠나셨습니다.`,
    );
    party.notify(msgToParty);

    // 떠난 멤버에게 메시지 전송
    const msgToKickedMember = Packet.S2CDisbandParty('파티를 떠났습니다.');
    member[0].write(msgToKickedMember);
  } catch (error) {
    handleError(error);
  }
};
