import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

const playerSpawnNotificationHandler = (socket, packetData) => {
  const playerSession = getPlayerSession();
  const currentPlayer = playerSession.getPlayer(socket);
  const players = playerSession.getAllPlayers();

  // 여기서 자기 자신을 제외해보자
  const playerInfoArray = Array.from(players.values())
    .filter((player) => player.id !== currentPlayer.id)
    .map((player) => {
      console.log(player);
      const transform = payloadData.TransformInfo(1, 1, 140, 1);

      const statInfo = payloadData.StatInfo(1, 10, 10, 10, 10, 10, 10, 10, 10);

      return payloadData.PlayerInfo(
        player.id,
        packetData.nickname,
        packetData.class,
        transform,
        statInfo,
      );
    });

  console.log('=========패킷 준비 ============');
  console.log(playerInfoArray);
  console.log('=========패킷 준비 ============');

  const spawn = payload.S_Spawn(playerInfoArray);
  const packet = makePacket(config.packetId.S_Spawn, spawn);
  const dungeonId = playerSession.getPlayer(socket).getDungeonId();
  console.log('=========패킷 보낸것 ============');
  console.log(packet);
  console.log('=========패킷 보낸것 ============');

  if (dungeonId) {
    console.log('던전아이디가 있어서 던전으로 갔다');
    const dungeonSessions = getDungeonSessions();
    const dungeon = dungeonSessions.getDungeon(dungeonId);
    dungeon?.notify(packet);
  } else {
    console.log('던전아이디가 없어서 그냥 보냈다.');
    playerSession.notify(packet);
  }
};

export default playerSpawnNotificationHandler;
