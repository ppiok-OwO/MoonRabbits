import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const kickOutPartyHandler = (socket, packetData) => {
  try {
    const { partyId, memberId } = packetData;

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
    const members = party.getAllMembers();

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
      const packet = PACKET.S2CChat(
        0,
        '파티원 퇴출 권한을 가지고 있지 않습니다.',
        'System',
      );
      return socket.write(packet);
    }

    // 퇴출시키려는 멤버가 파티에 존재하는가?
    // member = ['Socket', { Player 인스턴스 }]
    let member;

    for (const [key, value] of members) {
      if (value.id === memberId) {
        member = [key, value];
      }
    }
    if (!member) {
      const packet = PACKET.S2CChat(
        0,
        '파티에 소속되지 않은 플레이어입니다.',
        'System',
      );
      return socket.write(packet);
    }

    // 멤버 퇴출
    party.removeMember(memberId);

    // 각 멤버에 대하여 맞춤형 패킷 생성

    members.forEach((value, key) => {
      const packet = PACKET.S2CKickOutMember(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(packet);
    });
    const msgToParty = PACKET.S2CChat(
      0,
      `${member[1].nickname}님이 파티에서 추방되었습니다.`,
      'System',
    );
    party.notify(msgToParty);

    // 퇴출된 멤버에게 메시지 전송
    const msgToKickedMember =
      PACKET.S2CDisbandParty('파티에서 추방되었습니다.');
    member[0].write(msgToKickedMember);
  } catch (error) {
    handleError(socket, error);
  }
};
