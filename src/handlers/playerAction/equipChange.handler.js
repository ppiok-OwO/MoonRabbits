import {
  getPartySessions,
  getPlayerSession,
  getSectorSessions,
} from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';

const equipChangeHandler = (socket, packetData) => {
  const { nextEquip } = packetData;

  const player = getPlayerSession().getPlayer(socket);
  player.setCurrentEquip(nextEquip);

  // 만약 파티 중이라면 멤버 카드 UI 업데이트
  const partySession = getPartySessions();
  const partyId = player.getPartyId();
  if (partyId) {
    const party = partySession.getParty(partyId);
    const members = party.getAllMembers();

    members.forEach((value, key) => {
      const packet = PACKET.S2CUpdateParty(
        party.getId(),
        party.getPartyLeaderId(),
        party.getMemberCount(),
        party.getAllMemberCardInfo(value.id),
      );
      key.write(packet);
    });
  }

  const packet = PACKET.S2CEquipChange(player.id, nextEquip);

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.notify(packet);
};

export default equipChangeHandler;
