import { config } from '../../config/config.js';
import {
  getDungeonSessions,
  getPlayerSession,
} from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import payloadData from '../../utils/packet/payloadData.js';

// 경로 탐색 성공: [
//   { x: 0, y: 0, z: 0 },
//   { x: 5, y: 0, z: 5 },
//   { x: 10, y: 0, z: 15 },
//   { x: 20, y: 0, z: 30 }
// ]

const playerLocationUpdateHandler = (socket, packetData) => {
  const { transform } = packetData;

  // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  if (!player) {
    socket.emit(
      'error',
      new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '플레이어 정보를 찾을 수 없습니다.',
      ),
    );
  }

  //

  const move = payload.S_Move(player.id, transform);

  const packet = makePacket(config.packetId.S_Location, move);

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
