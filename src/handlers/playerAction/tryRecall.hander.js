import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const RECALL_TIMER = 5;

const tryRecallHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);

  const packet = PACKET.S2CRecall(player.id, RECALL_TIMER);

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.notify(packet);
};

export default tryRecallHandler;
