import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import Packet from '../../utils/packet/packet.js';

export const chatHandler = (socket, packetData) => {
  try {
    const { playerId, senderName, chatMsg } = packetData;

    // (1) 유효성 검사
    // 나는 나인가? 나는 누구인가?

    // (2) 예외 처리

    // 패킷 직렬화
    const packet = Packet.S_Chat(playerId, chatMsg);

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    const dungeonId = player.getDungeonId();
    if (dungeonId) {
      // 만약 던전이면
      const dungeonSessions = getDungeonSessions();
      const dungeon = dungeonSessions.getDungeon(dungeonId);
      dungeon.notify(packet);
    } else {
      // 던전이 아니면
      playerSession.notify(packet);
    }
  } catch (error) {
    handleError(error);
  }
};
