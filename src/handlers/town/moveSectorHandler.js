import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { CODE_TO_ID, ID_TO_CODE } from '../../utils/tempConverter.js';

const moveSectorHandler = (socket, packetData) => {
  const { targetSector } = packetData;

  const targetSectorCode = targetSector || 2;

  const player = getPlayerSession().getPlayer(socket);
  const prevSector = getSectorSessions().getSector(
    CODE_TO_ID[player.getSectorId()],
  );
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
  prevSector.notify(
    Packet.S2CDespawn(
      partyMembers.map((partyMember) => {
        return partyMember.id;
      }),
      player.getSectorId(),
    ),
  );
  // 현재는 섹터가 한개씩 존재함으로 섹터 코드로 탐색
  const newSector = getSectorSessions().getSectorBySectorCode(targetSectorCode);

  console.log(newSector.players.size);
  // partyMembers.forEach((member) => {
  //   member.setSectorId(newSector.getSectorId());
  //   newSector.setPlayer(socket, member);
  //   const memberSocket = member.user.getSocket();
  //   memberSocket.write(Packet.S2CEnter(member.getPlayerInfo()));
  //   playerSpawnNotificationHandler(memberSocket, {});
  // });

  // @@@ setSectorId가 Player의 currentSector를 갱신하는디, 여기엔 코드가 들어가야해서 @@@
  // @@@ 기존 섹터에서 지워줘야함 @@@
  partyMembers.forEach((member) => {
    member.setSectorId(ID_TO_CODE[newSector.getSectorId()]);
    prevSector.deletePlayer(member.user.socket);
    newSector.setPlayer(socket, member);
    const memberSocket = member.user.getSocket();
    memberSocket.write(Packet.S2CEnter(member.getPlayerInfo()));
    playerSpawnNotificationHandler(memberSocket, {});
  });
  console.log(newSector.players.size);
};

export default moveSectorHandler;
