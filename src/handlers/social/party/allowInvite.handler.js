import { config } from '../../../config/config.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import Packet from '../../../utils/packet/packet.js';

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

    // 새로운 멤버의 플레이어 인스턴스
    const newMember = party
      .getAllMemberSockets()
      .find((value) => value.id === memberId);

    if (party.getMemberCount() < config.party.MaxMember) {
      // 새 플레이어를 파티에 추가
      party.addMember(newMember.user.getSocket(), newMember);
      const packet = Packet.S2CAllowInvite(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(player.id),
      );

      party.notify(packet);
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
