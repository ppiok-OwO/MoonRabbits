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
  // payload 객체 변경으로 S_Move()는 존재하지 않슴다
  // 아마 payload.S2CPlayerLocation() 하시면 될 거 같슴다
  const move = payload.S_Move(player.id, transform);

  // config.packetId 객체 변경으로 S_Move는 존재하지 않슴다
  // 아마 S2CPlayerLocation 아니면 S2CPlayerMove 하시면 될 거 같슴다
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
