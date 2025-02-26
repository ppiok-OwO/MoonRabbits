import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';

const moveSectorHandler = (socket, packetData) => {
  const { targetScene } = packetData;

  const targetSectorCode = targetScene || 2;

  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const partySession = getPartySessions();

  const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것

  // 파티가 있는지 체크
  if (player.isInParty && player.isPartyLeader) {
    // 파티 인스턴스
    const party = partySession.getParty(player.partyId);
    const allMembers = party.getAllMembers();
    for (const member of allMembers) {
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
  // 현재는 섹터가 한개씩 존재함으로 섹터 코드로 탐색
  const newSector = getSectorSessions().getSectorBySectorCode(targetSectorCode);

  console.log(newSector.players.size);
  partyMembers.forEach((member) => {
    member.setSectorId(newSector.getSectorId());
    newSector.setPlayer(socket, member);
    const memberSocket = member.user.getSocket();
    memberSocket.write(Packet.S2CEnter(member.getPlayerInfo()));
    playerSpawnNotificationHandler(memberSocket, {});
  });
  console.log(newSector.players.size);
};

export default moveSectorHandler;
