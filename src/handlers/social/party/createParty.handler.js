import Party from '../../../classes/party.class.js';
import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import Packet from '../../../utils/packet/packet.js';

export const createParty = (socket, packetData) => {
  try {
    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    if (!player) {
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.USER_NOT_FOUND,
          '플레이어 정보를 찾을 수 없습니다.',
        ),
      );
    }

    const newParty = new Party(socket, player);
    const partySession = getPartySessions();
    partySession.addParty(newParty);

    const packet = Packet.S2CCreateParty(
      newParty.getId(),
      newParty.getPartyLeaderId(),
      newParty.getMemberCount(),
      newParty.getAllMemberIds(),
    );

    // 파티 세션에 브로드캐스트
    newParty.notify(packet);
  } catch (error) {
    handleError(socket, error);
  }
};
