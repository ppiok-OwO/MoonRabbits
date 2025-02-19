import Party from '../../../classes/party.class.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import Packet from '../../../utils/packet/packet.js';

export const createPartyHandler = (socket, packetData) => {
  try {
    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
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
    }

    const partySession = getPartySessions();
    const party = partySession.addParty(socket, player);
    party.setPartyLeader(player);
    player.isInParty = true;

    const packet = Packet.S2CCreateParty(
      party.getId(),
      party.getPartyLeaderId(),
      party.getMemberCount(),
      party.getAllMemberCardInfo(player.id),
    );

    // 파티 세션에 브로드캐스트
    return party.notify(packet);
  } catch (error) {
    handleError(socket, error);
  }
};
