import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import Packet from '../../utils/packet/packet.js';

export const animationHandler = (socket, packetData) => {
  try {
    const { animCode } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    // 패킷 직렬화
    const packet = Packet.S_Animation(player.getId(), animCode);

    // 채팅창 알림 패킷 생성
    let chatPacket;
    switch (animCode) {
      case -1094458453:
        chatPacket = Packet.S_Chat(
          0,
          `${player.nickname}님이 행복한 표정을 짓습니다.`,
        );
        break;

      case 667595281:
        chatPacket = Packet.S_Chat(
          0,
          `${player.nickname}님이 무척 슬퍼합니다.`,
        );
        break;

      case 1355645575:
        chatPacket = Packet.S_Chat(
          0,
          `${player.nickname}님이 반갑게 인사합니다.`,
        );
        break;

      default:
        break;
    }

    const dungeonId = player.getDungeonId();
    if (dungeonId) {
      // 만약 던전이면
      const dungeonSessions = getDungeonSessions();
      const dungeon = dungeonSessions.getDungeon(dungeonId);
      dungeon.notify(packet);
      dungeon.notify(chatPacket);
    } else {
      // 던전이 아니면
      playerSession.notify(packet);
      playerSession.notify(chatPacket);
    }
  } catch (error) {
    handleError(error);
  }
};
