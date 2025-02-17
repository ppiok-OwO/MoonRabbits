import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

// 클라이언트
export const inviteParty = (socket, packetData) => {
  try {
    const { partyId, nickname } = packetData;

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
    }

    // 초대를 보낸 멤버의 플레이어 인스턴스
    const playerSession = getPlayerSession();
    const newMember = playerSession.getPlayerByNickname(nickname);
    if (!newMember) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    // 해당 멤버에게 초대장 보내기
    if (party.getMemberCount() < config.party.MaxMember) {
      const packet = Packet.S2CInviteParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberIds(),
      );

      newMember.getSocket().write(packet);
    } else {
      return;
    }
  } catch (error) {
    handleError(socket, error);
  }
};
