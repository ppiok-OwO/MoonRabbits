import {
  getPartySessions,
  getPlayerSession,
} from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import handleError from '../../../utils/error/errorHandler.js';
import PACKET from '../../../utils/packet/packet.js';

export const chceckPartyListHandler = (socket, packetData) => {
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

    // partySession에서 인원이 1 이상 5미만인 파티를 20개 검색
    const partySession = getPartySessions();
    const parties = partySession.getAllPartyEntries();

    const partyInfos = [];
    for (const party of parties) {
      const memberCount = party[1].getMemberCount();
      if (memberCount >= 1 && memberCount < 5) {
        const partyInfo = party[1].getPartyInfo();
        if (!party[1].getPartyInfo) {
          return socket.emit(
            'error',
            new CustomError(
              ErrorCodes.PARTY_NOT_FOUND,
              '파티 조회 중 오류가 발생했습니다.',
            ),
          );
        }
        partyInfos.push(partyInfo);

        if (partyInfos.length >= 20) break;
      }
    }

    const packet = PACKET.S2CCheckPartyList(partyInfos, player.id);

    socket.write(packet);
  } catch (error) {
    handleError(error);
  }
};
