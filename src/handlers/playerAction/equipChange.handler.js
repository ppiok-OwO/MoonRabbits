import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const equipChangeHandler = (socket, packetData) => {
  const { nextEquip } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  const packet = PACKET.S2CEquipChange(player.id, nextEquip);
  
  const sector =  getSectorSessions().getSector(player.getSectorId());
  sector.notify(packet);
};

export default equipChangeHandler;
