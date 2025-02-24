import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from '../town/playerSpawnNotification.handler.js';

const leaveHandler = (socket, packetData) => {
  const { targetScene } = packetData;

  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const partySession = getPartySessions();

  const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것

  // 파티가 있는지 체크
  if (player.isInParty && player.isPartyLeader) {
    // 파티 인스턴스
    const party = partySession.getParty(player.partyId);
    const allMembers = party.getAllMembers();
    for (const member in allMembers) {
      partyMembers.push(member);
    }
  } else if (player.isInParty) {
    const packet = Packet.S2CChat(0, '당신은 파티장이 아닙니다.', 'System');
    return socket.write(packet);
  }

  // 디스폰
  sector.notify(
    Packet.S2CPlayerDespawn(
      partyMembers.map((partyMember) => {
        return partyMember.id;
      }),
      player.getSectorId(),
    ),
  );

  const newSector = getSectorSessions().getSector(targetScene || 2);
  partyMembers.forEach((member) => {
    member.setSectorId(targetScene || 2);
    newSector.setPlayer(socket, member);
    const memberSocket = member.user.getSocket();
    memberSocket.write(Packet.S2CEnter(member.getPlayerInfo()));
    playerSpawnNotificationHandler(memberSocket, {});
  });
};

export default leaveHandler;
