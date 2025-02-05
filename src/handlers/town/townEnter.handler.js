import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

const townEnterHandler = (socket, packetData) => {
  const transform = payloadData.TransformInfo(1, 1, 1, 1);
  const statInfo = payloadData.StatInfo(1, 10, 10, 10, 10, 10, 10, 10, 10);
  const playerId = getPlayerSession().getPlayer(socket).id;
  const playerInfo = payloadData.PlayerInfo(
    playerId,
    packetData.nickname,
    packetData.class,
    transform,
    statInfo,
  );

  const data = payload.S_Enter(playerInfo);

  const packet = makePacket(config.packetId.S_Enter, data);

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const dungeonId = player.getDungeonId();
  if (dungeonId) {
    const dungeonSessions = getDungeonSessions();
    const dungeon = dungeonSessions.getDungeon(dungeonId);
    dungeon.notify(packet);
  } else {
    playerSession.notify(packet);
  }
  //socket.write(packet);
};

export default townEnterHandler;
