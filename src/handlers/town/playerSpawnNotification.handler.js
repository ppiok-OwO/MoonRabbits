import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';

const playerSpawnNotificationHandler = (socket, packetData) => {
  const playerSession = getPlayerSession();
  const currentPlayer = playerSession.getPlayer(socket);
  const players = playerSession.getAllPlayers();

  //클라이언트에서 자신을 제외처리해야함
  const playerInfoArray = Array.from(players.values()).map((player) => {
    return player.getPlayerInfo();
  });

  // 패킷 정의 수정으로 S_Spawn이 제거됐슴다
  // 아마 payload.S2CPlayerSpawn과 config.packetId.S2CPlayerSpawn 사용하시면 될 것 같슴다
  const spawn = payload.S_Spawn(playerInfoArray);
  const packet = makePacket(config.packetId.S_Spawn, spawn);
  const dungeonId = playerSession.getPlayer(socket).getDungeonId();

  if (dungeonId) {
    const dungeonSessions = getDungeonSessions();
    const dungeon = dungeonSessions.getDungeon(dungeonId);
    dungeon?.notify(packet);
  } else {
    playerSession.notify(packet);
  }
};

export default playerSpawnNotificationHandler;
