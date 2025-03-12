import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';
import {
  getPartySessions,
  getPlayerSession,
  getSectorSessions,
} from '../../session/sessions.js';

const STUN_TIMER = { 1: 3, 2: 5 };

const stunHandler = (socket, packetData) => {
  const { skillType, playerIds, monsterIds, trap } = packetData;

  const player = getPlayerSession().getPlayer(socket);

  let newPlayerIds = playerIds;

  const party = getPartySessions().getParty(player.getPartyId());

  if (party) {
    const memberIds = [];
    for (const member of party.members.values()) {
      memberIds.push(member.id);
    }

    newPlayerIds = playerIds.filter((id) => !memberIds.includes(id));
  }

  const sector = getSectorSessions().getSector(player.getSectorId());

  sector.setStunMonster(monsterIds, STUN_TIMER[skillType]);

  if (newPlayerIds.length >= 1 || monsterIds >= 1) {
    const packet = PACKET.S2CStun(
      STUN_TIMER[skillType],
      newPlayerIds,
      monsterIds,
    );

    sector.notify(packet);

    if (skillType == 2) {
      const payload = sector.deleteTrap(
        player.id,
        PAYLOAD_DATA.Vec3(trap.pos.x, trap.pos.y || 0, trap.pos.z),
        socket,
      );

      if (payload) sector.notify(PACKET.S2CRemoveTrap([payload]));
    }
  }
};

export default stunHandler;
