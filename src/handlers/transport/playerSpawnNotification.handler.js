import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const playerSpawnNotificationHandler = (socket,packetData) => {
  // [1] 내 플레이어 정보를 찾음
  const myPlayer = getPlayerSession().getPlayer(socket);

  // [2] 다른 유저들에게 내 플레이어를 스폰시킬 섹터를 찾음
  const mySector = getSectorSessions().getSector(myPlayer.getSectorId());
  
  // [3 A] moveSector나 enterTown에서 건너온 경우
  // [3 B] 클라에서 C2SSpawn을 받은 경우
  if (!packetData) {
    // [A-1] 해당 섹터에 위치한 유저들에게 내 플레이어를 스폰시킴
    mySector.notifyExceptMe(
      PACKET.S2CSpawn(myPlayer.getPlayerInfo()),
      myPlayer.id,
    );
  } else {
    // [B-1] 요청받은 플레이어를 찾아봄
    const otherPlayer = getPlayerSession().getPlayerById(packetData.playerId);
    // [B-2] 플레이어 정보가 서버에 있으면, 그 플레이어가 위치한 섹터 찾아봄
    if (otherPlayer !== -1) {
      const otherSector = getSectorSessions().getSector(otherPlayer.getSectorId());
      // [B-3] 요청자와 요청대상 플레이어의 섹터가 동일하다면 요청자에게 스폰 시켜줌
      if (mySector.getSectorId() === otherSector.getSectorId())  {
        socket.write(PACKET.S2CSpawn(otherPlayer.getPlayerInfo()));
      }
    }
  }
};

export default playerSpawnNotificationHandler;
