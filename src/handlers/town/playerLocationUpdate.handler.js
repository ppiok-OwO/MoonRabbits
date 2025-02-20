import { config } from '../../config/config.js';
import { getDungeonSessions, getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import makePacket from '../../utils/packet/makePacket.js';
import Packet from '../../utils/packet/packet.js';
import payload from '../../utils/packet/payload.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';

// !!! 패킷 변경에 따라 S_Chat -> S2CChat, S_Location -> S2CPlayerLocation으로 일괄 수정해씀다

// 경로 탐색 성공: [
//   { x: 0, y: 0, z: 0 },
//   { x: 5, y: 0, z: 5 },
//   { x: 10, y: 0, z: 15 },
//   { x: 20, y: 0, z: 30 }
// ]

// 이동중이라면 10프레임마다 location 패킷 전송
const playerLocationUpdateHandler = (socket, packetData) => {
  try {
    const { transform } = packetData;

    // 플레이어 세션을 통해 플레이어 인스턴스를 불러온다.
    const playerSession = getPlayerSession();
    const player = playerSession.getPlayer(socket);
    if (!player) {
      return socket.emit(
        'error',
        new CustomError(ErrorCodes.USER_NOT_FOUND, '플레이어 정보를 찾을 수 없습니다.'),
      );
    }

    const path = player.getPath();
    if (path === null) {
      console.log('생성된 경로가 없음!!');
    } else {
      // transform의 좌표로부터 가장 가까운 path상의 좌표 구하기
      // 두 좌표 사이의 거리가 루트2(대락 1.4)보다 작아야 한다.
      let minDistance = Infinity;
      let closestPoint = null;
      path.forEach((point) => {
        const distance = calculateDistance(point, transform);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = { PosX: point.x, PosY: point.y, PosZ: point.z }; // transform과 가장 가까운 경로상의 좌표
        }
      });
      console.log('closestPoint : ', closestPoint);
      console.log('transform :', transform);
      console.log('minDistance :', minDistance);

      if (minDistance > 1.4) {
        // 오차범위를 벗어나면 플레이어의 위치를 closestPoint로 재조정한다.
        const syncLocationPacket = Packet.S2CChat(0, '플레이어의 위치를 재조정합니다.');

        const newTransform = { ...closestPoint, rot: transform.rot };
        const packet = Packet.S2CPlayerLocation(
          player.id,
          newTransform,
          false,
          player.getCurrentScene(),
        );

        // 위치동기화 브로드 캐스트
        const dungeonId = player.getDungeonId();
        if (dungeonId) {
          // 만약 던전이면
          const dungeonSessions = getDungeonSessions();
          const dungeon = dungeonSessions.getDungeon(dungeonId);
          dungeon.notify(packet);
          // dungeon.notify(syncLocationPacket);
        } else {
          // 던전이 아니면playerSession.notify(syncLocationPacket);
          playerSession.notify(packet);
          // playerSession.notify(syncLocationPacket);
        }

        return;
      }
    }

    const packet = Packet.S2CPlayerLocation(player.id, transform, true, player.getCurrentScene());

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
    console.error(error);
  }
};

function calculateDistance(point1, transform) {
  const dx = point1.x - transform.posX;
  const dy = point1.y - transform.posY;
  const dz = point1.z - transform.posZ;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export default playerLocationUpdateHandler;
