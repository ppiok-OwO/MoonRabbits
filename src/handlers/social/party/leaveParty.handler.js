import { getPartySessions } from '../../../session/sessions.js';
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
      .getAllMemberEntries()
      .find(([key, value]) => value.id === leftPlayerId);
    // member = ['Socket', { Player 인스턴스 }]

    if (!member) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.HANDLER_ERROR,
          '파티에 소속되지 않은 플레이어입니다.',
        ),
      );
    }

    // 멤버 퇴출
    party.removeMember(leftPlayerId);

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
