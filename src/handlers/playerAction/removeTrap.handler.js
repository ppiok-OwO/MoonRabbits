import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';

const removeTrapHandler = (socket, packetData) => {
  const { casterId, pos } = packetData.trapInfo;

  const player = getPlayerSession().getPlayer(socket);

  const sector = getSectorSessions().getSector(player.getSectorId());

  const payload = sector.deleteTrap(
    casterId, // 자연 파괴인 경우 playerId와 같지만, 발동 파괴인 경우 다름
    PAYLOAD_DATA.Vec3(pos.x, pos.y || 0 , pos.z),
    socket,
  );
  if (payload) sector.notify(PACKET.S2CRemoveTrap([payload]));
};

export default removeTrapHandler;
