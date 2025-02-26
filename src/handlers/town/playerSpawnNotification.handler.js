import { config } from '../../config/config.js';
import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import makePacket from '../../utils/packet/makePacket.js';
import payload from '../../utils/packet/payload.js';
import { CODE_TO_ID } from '../../utils/tempConverter.js';

// !!! 패킷 정의 변경에 따라 S_Spawn -> S2CPlayerSpawn으로 일괄 수정해씀다

const playerSpawnNotificationHandler = (socket, packetData) => {
  const playerSession = getPlayerSession();
  const currentPlayer = playerSession.getPlayer(socket);
  const players = playerSession.getAllPlayers();

  //클라이언트에서 자신을 제외처리해야함
  const playerInfoArray = Array.from(players.values()).map((player) => {
    return player.getPlayerInfo();
  });

  const spawn = payload.S2CSpawn(playerInfoArray);
  const packet = makePacket(config.packetId.S2CSpawn, spawn);

  // const sectorId = playerSession.getPlayer(socket).getSectorId();
  // if (sectorId) {
  //   const sectorSessions = getSectorSessions();
  //   const sector = sectorSessions.getSector(sectorId);
  //   sector?.notify(packet);
  // } else {
  //   playerSession.notify(packet);
  // }

  // @@@ getSectorId 메서드가 사실 sectorCode를 가져옴... @@@
  const sectorCode = playerSession.getPlayer(socket).getSectorId();
  if (sectorCode) {
    const sectorSessions = getSectorSessions();
    const sector = sectorSessions.getSector(CODE_TO_ID[sectorCode]);
    sector?.notify(packet);
  } else {
    playerSession.notify(packet);
  }
};

export default playerSpawnNotificationHandler;
