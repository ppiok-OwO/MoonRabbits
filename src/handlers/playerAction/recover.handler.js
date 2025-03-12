import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const recoverHandler = (socket, packetData) => {
  const { targetPlayerId } = packetData;

  const caster = getPlayerSession().getPlayer(socket);
  const targetPlayer = getPlayerSession().getPlayerById(targetPlayerId);

  const partyId = caster.getPartyId();
  const partyIdOfTarget = targetPlayer.getPartyId();

  if (!partyId || !partyIdOfTarget || partyId !== partyIdOfTarget) {
    socket.write(
      PACKET.S2CChat(0, '같은 파티에 속한 플레이어만 구조할 수 있습니다.', 'System'),
    );
    return;
  }

  targetPlayer.setHp(3);

  const partySession = getPartySessions();

  if (partyId) {
    const party = partySession.getParty(partyId);
    const members = party.getAllMembers();

    members.forEach((value, key) => {
      const partyPacket = PACKET.S2CUpdateParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(partyPacket);
    });
  }

  const sector = getSectorSessions().getSector(caster.getSectorId());

  if (caster.getSectorId() !== targetPlayer.getSectorId()) return;

  sector.notify(PACKET.S2CRecover(caster.id, targetPlayerId));
};

export default recoverHandler;
