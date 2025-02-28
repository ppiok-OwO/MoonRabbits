import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const RECALL_TIMER = 5;

const tryRecallHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);

  const sectorCode = player.getSectorId();
  const packet = PACKET.S2CRecall(player.id, sectorCode, RECALL_TIMER);

  // 만약 던전이면
  const sectorSessions = getSectorSessions();
  const sector = sectorSessions.getSector(sectorCode);
  sector.notify(packet);
};

export default tryRecallHandler;
