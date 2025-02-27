import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import { CODE_TO_ID } from '../../utils/tempConverter.js';

const equipChangeHandler = (socket, packetData) => {
  const { nextEquip } = packetData;
  const player = getPlayerSession().getPlayer(socket);

  const sectorCode = player.getSectorId();
  const packet = PACKET.S2CEquipChange(player.id, sectorCode, nextEquip);

  const sectorSessions = getSectorSessions();
  const sector = sectorSessions.getSector(CODE_TO_ID[sectorCode]);
  sector.notify(packet);
};

export default equipChangeHandler;
