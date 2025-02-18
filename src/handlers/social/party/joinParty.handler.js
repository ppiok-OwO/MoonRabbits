import { config } from '../../../config/config.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import Packet from '../../../utils/packet/packet.js';

export const joinPartyHandler = (socket, packetData) => {
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

    const newMember = party
      .getAllMemberSockets()
      .find((value) => value.id === memberId);

    // const playerSession = getPlayerSession();
    // const newMember = playerSession.getPlayerById(memberId);

    if (party.getMemberCount() < config.party.MaxMember) {
      party.addMember(socket, newMember);
    } else {
      const packet = Packet.S2CChat(
        0,
        '해당 파티는 정원이 모두 찼으므로 참가할 수 없습니다.',
      );

      return socket.write(packet);
    }

    const packet = Packet.S2CJoinParty(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberIds(),
    );

    party.notify(packet);
  } catch (error) {
    handleError(socket, error);
  }
};
