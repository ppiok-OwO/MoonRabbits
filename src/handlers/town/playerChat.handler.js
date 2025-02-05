import { PACKET_ID } from '../../constants/header.js';
import {
  getDungeonSessions,
  getPlayerSession,
  playerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';

export const chatHandler = (socket, packetData) => {
  const { playerId, senderName, chatMsg } = packetData;

  try {
    // 유효성 검사
    // 나는 나인가? 나는 누구인가?

    // 예외 처리

    // 패킷 직렬화
    const chatPayload = payload.S_Chat(playerId, chatMsg);
    const packet = makePacket(PACKET_ID.S_Chat, chatPayload);

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const player = playerSession.getPlayer(socket);

    // 만약 던전이면 dungeonId를 클라이언트가 보내주기로!
    const dungeonId = player.getDungeonId();
    if (dungeonId) {
      const dungeonSessions = getDungeonSessions();
      const dungeon = dungeonSessions.getDungeon(dungeonId);
      dungeon.notify(packet);
    } else {
      // 던전이 아니면
      playerSession.notify(packet);
    }
  } catch (error) {
    console.error(error);
  }
};
