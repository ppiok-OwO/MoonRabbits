import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import handleError from '../../utils/error/errorHandler.js';
import PACKET from '../../utils/packet/packet.js';
import { config } from '../../config/config.js';

// !!! 패킷 변경에 따라 S_Animation -> S2CAnimation, S_Chat -> S2CChat으로 일괄 수정해씀다
export const animationHandler = (socket, packetData) => {
  try {
    const { animCode } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    if (!player) {
      const packet = PACKET.S2CChat(
        0,
        '플레이어 정보를 찾을 수 없습니다.',
        'System',
      );
      return socket.write(packet);
    }

    const sectorCode = player.getSectorId();

    // 패킷 직렬화
    // const packet = Packet.S_Animation(player.getId(), animCode);
    const packet = PACKET.S2CEmote(player.id, animCode);

    // 채팅창 알림 패킷 생성
    let chatPacket;
    switch (animCode) {
      case config.animCode.happy:
        chatPacket = PACKET.S2CChat(
          0,
          `${player.nickname}님이 행복한 표정을 짓습니다.`,
          'System',
        );
        break;

      case config.animCode.sad:
        chatPacket = PACKET.S2CChat(
          0,
          `${player.nickname}님이 무척 슬퍼합니다.`,
          'System',
        );
        break;

      case config.animCode.greeting:
        chatPacket = PACKET.S2CChat(
          0,
          `${player.nickname}님이 반갑게 인사합니다.`,
          'System',
        );
        break;

      default:
        break;
    }

    if (sectorCode) {
      // 만약 던전이면
      const sectorSessions = getSectorSessions();
      const sector = sectorSessions.getSector(sectorCode);
      sector.notify(packet);
      if (chatPacket) sector.notify(chatPacket);
    } else {
      // 던전이 아니면
      playerSession.notify(packet);
      if (chatPacket) playerSession.notify(chatPacket);
    }
  } catch (error) {
    handleError(socket, error);
    // console.error(error);
  }
};
