import { PACKET_ID } from '../../constants/header.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import payload from '../../utils/packet/payload.js';

export const animationHandler = (socket, packetData) => {
  try {
    const { animCode } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);

    // 패킷 직렬화
    const animPayload = payload.S_Animation(player.id, animCode);
    const packet = makePacket(PACKET_ID.S_Animation, animPayload);

    // 만약 던전이면
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
