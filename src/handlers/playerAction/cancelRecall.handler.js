import { getPlayerSession } from '../../session/sessions.js';
import { getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const cancelRecallHandler = (socket, packetData) => {
  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const sectorCode = player.getSectorId();
  const packet = PACKET.S2CCancelRecall(player.id, sectorCode);

  if (sectorCode) {
    // 만약 던전이면
    const sectorSessions = getSectorSessions();
    const sector = sectorSessions.getSector(sectorCode);
    sector.notify(packet);
  } else {
    // 던전이 아니면
    playerSession.notify(packet);
  }
};

export default cancelRecallHandler;
