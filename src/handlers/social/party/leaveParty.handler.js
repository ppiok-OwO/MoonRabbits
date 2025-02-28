import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

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
    // member = ['Socket', { Player 인스턴스 }]
    const member = party
      .getAllMemberEntries()
      .find(([key, value]) => value.id === leftPlayerId);
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

    // 떠난 멤버가 파티장이면 파티장 교체
    const partyLeader = party.getPartyLeader();
    if (member[1] === partyLeader) {
      // party클래스에서 파티장 교체
      const memberIds = party.getAllMemberIds();
      if (memberIds.length > 0) {
        const newLeaderId = memberIds[0];

        const newLeaderSocket = party.getSocketById(newLeaderId);
        if (newLeaderSocket === -1) {
          // 파티 해체
          const packet = PACKET.S2CDisbandParty(
            '파티 기능에 오류가 발생하여, 파티가 해체되었습니다.',
          );

          party.forEach(([key, value]) => {
            key.write(packet);
          });

          return party.disbandParty();
        }
        const newLeader = party.getMember(newLeaderSocket);
        party.setPartyLeader(newLeader);

        const members = party.getAllMembers();

        members.forEach((value, key) => {
          const packet = PACKET.S2CLeaveParty(
            party.getId(),
            party.getPartyLeaderId(),
            party.getMemberCount(),
            party.getAllMemberCardInfo(value.id),
          );
          key.write(packet);
        });
        const msgToParty = PACKET.S2CChat(
          0,
          `${member[1].nickname}님이 파티를 떠나셨습니다.`,
          'System',
        );
        party.notify(msgToParty);

        // 떠난 멤버에게 메시지 전송
        const msgToKickedMember = PACKET.S2CDisbandParty('파티를 떠났습니다.'); // 참고 : 멤버 카드 삭제를 위해 S2CDisbandParty패킷으로 전송
        member[0].write(msgToKickedMember);
      }
    }

    const members = party.getAllMembers();

    // 각 멤버에 대하여 맞춤형 패킷 생성
    members.forEach((value, key) => {
      const packet = PACKET.S2CLeaveParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(packet);
    });
    const msgToParty = PACKET.S2CChat(
      0,
      `${member[1].nickname}님이 파티를 떠나셨습니다.`,
      'System',
    );
    party.notify(msgToParty);

    // 떠난 멤버에게 메시지 전송
    const msgToKickedMember = PACKET.S2CDisbandParty('파티를 떠났습니다.');
    member[0].write(msgToKickedMember);
  } catch (error) {
    handleError(error);
  }
};
