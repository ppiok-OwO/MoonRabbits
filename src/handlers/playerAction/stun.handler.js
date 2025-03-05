import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';

const STUN_TIMER = { 1: 3, 2: 5 };

const stunHandler = (socket, packetData) => {
  const { skillType, playerIds, monsterIds } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  const packet = PACKET.S2CStun(STUN_TIMER[skillType], playerIds, monsterIds);

  const sector = getSectorSessions().getSector(player.getSectorId());

  // Todo: Monster 몬스터 관련 로직도 해야함

  sector.setSturnMonster(monsterIds, STUN_TIMER[skillType]);

  sector.notify(packet);
};

export default stunHandler;
