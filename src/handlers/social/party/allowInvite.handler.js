import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const allowInviteHandler = (socket, packetData) => {
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

    // 새로운 멤버의 플레이어 인스턴스
    const playerSession = getPlayerSession();
    const newMember = playerSession.getPlayerById(memberId);
    if (!newMember || newMember === -1) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    if (
      newMember &&
      newMember !== -1 &&
      party.getMemberCount() < config.party.MaxMember
    ) {
      // 새 플레이어를 파티에 추가
      party.addMember(newMember.user.getSocket(), newMember);
      newMember.setPartyId(partyId);
      newMember.isInvited = false;

      // 각 멤버에 대하여 맞춤형 패킷 생성
      const members = party.getAllMemberEntries();

      members.forEach(([key, value]) => {
        const packet = PACKET.S2CAllowInvite(
          party.getId(),
          party.getPartyLeaderId(),
          party.getMemberCount(),
          party.getAllMemberCardInfo(value.id),
        );
        key.write(packet);
      });
    } else {
      const packet = PACKET.S2CChat(
        0,
        '해당 파티는 정원이 모두 찼으므로 참가할 수 없습니다.',
        "System"
      );

      return newMember.user.getSocket().write(packet);
    }
  } catch (error) {
    handleError(socket, error);
  }
};
