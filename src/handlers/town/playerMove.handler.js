import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

const playerMoveHandler = (socket, packetData) => {
  const { transform } = packetData;
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);
  const move = payload.S_Move(player.id, transform);

  const packet = makePacket(config.packetId.S_Move, move);

  //socket.write(packet);

  const dungeonId = player.getDungeonId();
  if (dungeonId) {
    const dungeonSessions = getDungeonSessions();
    const dungeon = dungeonSessions.getDungeon(dungeonId);
    dungeon.notify(packet);
  } else {
    playerSession.notify(packet);
  }
};

export default playerMoveHandler;
