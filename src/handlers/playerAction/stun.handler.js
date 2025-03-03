import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';

const STUN_TIMER = [3, 5];

const stunHandler = (socket, packetData) => {
  const { skillType, playerIds, monsterIds } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  // 몬스터 관련 로직도 해야함

  const packet = PACKET.S2CStun(STUN_TIMER[skillType], playerIds, monsterIds);

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.notify(packet);
};

export default stunHandler;
