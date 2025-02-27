import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';

const STUN_TIMER = [3, 5];

const stunHandler = (socket, packetData) => {
  const { skillType, playerIds, monsterIds } = packetData;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  const sectorCode = player.getSectorId();

  const packet = PACKET.S2CStun(
    sectorCode,
    STUN_TIMER[skillType],
    playerIds,
    monsterIds,
  );

  const sectorSession = getSectorSessions();
  const sector = sectorSession.getSector(sectorCode);
  sector.notify(packet);
};

export default stunHandler;
