import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';

const COOL_TIME = 5;

const setTrapHandler = (socket, packetData) => {
  const { trapPos } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  const sector = getSectorSessions().getSector(player.getSectorId());

  const payload = sector.setTrap(
    player.getPlayerId(),
    PAYLOAD_DATA.Vec3(trapPos.x, trapPos.y || 0, trapPos.z),
  );

  sector.notify(PACKET.S2CSetTrap(payload, COOL_TIME));
};

export default setTrapHandler;
