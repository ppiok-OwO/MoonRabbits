import { getSectorSessions, getPlayerSession } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const playerSpawnNotificationHandler = (socket, packetData) => {
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);
  const sectorCode = player.getSectorId();
  const targetSector = getSectorSessions().getSector(sectorCode);

  const playerInfos = Array.from(targetSector.getAllPlayer().values()).map(
    (player) => {
      return player.getPlayerInfo();
    },
  );

  const packet = PACKET.S2CSpawn(playerInfos);

  targetSector.notify(packet);
};

export default playerSpawnNotificationHandler;
