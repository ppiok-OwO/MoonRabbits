import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

// 클라이언트
export const invitePartyHandler = (socket, packetData) => {
  try {
    const { partyId, nickname } = packetData;

    // TODO : 내 자신은 초대할 수 없게

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
          '파티원 초대 권한을 가지고 있지 않습니다.',
        ),
      );
    }

    // 초대를 보낸 멤버의 플레이어 인스턴스
    const newMember = playerSession.getPlayerByNickname(nickname);
    if (!newMember || newMember === -1) {
      return socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    // 해당 플레이어가 파티 중이면 return
    if (newMember.isInParty) {
      const packet = Packet.S2CChat(0, '이미 파티에 소속된 플레이어입니다.');
      return socket.write(packet);
    }

    // 상대방이 이미 초대를 받은 상태여도 return
    if (newMember.isInvited) {
      const packet = Packet.S2CChat(0, '지금은 초대장을 보낼 수 없습니다.');
      return socket.write(packet);
    }

    // 해당 멤버에게 초대장 보내기
    if (party.getMemberCount() < config.party.MaxMember) {
      const packet = Packet.S2CInviteParty(
        party.getPartyLeader().nickname,
        party.getId(),
        newMember.id,
      );

      newMember.isInvited = false;

      return newMember.user.getSocket().write(packet);
    } else {
      const packet = Packet.S2CChat(
        0,
        '해당 파티는 정원이 모두 찼으므로 참가할 수 없습니다.',
      );
      return newMember.user.getSocket().write(packet);
    }
  } catch (error) {
    handleError(socket, error);
  }
};
