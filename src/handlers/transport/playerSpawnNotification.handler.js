import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const playerSpawnNotificationHandler = (socket) => {
  // [1] 내 플레이어 정보를 찾음
  const player = getPlayerSession().getPlayer(socket);
  // [2] 다른 유저들에게 내 플레이어를 스폰시킬 섹터를 찾음
  const targetSector = getSectorSessions().getSector(player.getSectorId());
  // [3] 해당 섹터에 위치한 유저들에게 내 플레이어를 스폰시킴
  targetSector.notifyExceptMe(
    PACKET.S2CSpawn(player.getPlayerInfo()),
    player.id,
  );
};

export default playerSpawnNotificationHandler;
