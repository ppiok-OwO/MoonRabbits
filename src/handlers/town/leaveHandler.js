import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import Packet from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from '../town/playerSpawnNotification.handler.js';

const leaveHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.setSectorId());
  const partySession = getPartySessions();

  if (player.isInParty && player.isPartyLeader) {
    // 파티 인스턴스

  }

  const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것
  const { targetScene } = packetData;

  sector.notify(
    Packet.S2CPlayerDespawn(
      partyMembers.map((partyMember) => {
        return partyMember.id;
      }),
      player.getCurrentScene(),
    ),
  );
  // 파티가 있는지 체크
  // 파티가 있다면 파티원 전부의ㅏ playerId들을 가져와서 배열에 담는다
  // 디스폰 시켜야하고
  // 만약 어디로 갈 거라면 어디로 갈지 보내줘야하는데
  // 패킷에 추가를 안해놨네 써글
  // Leave에 targetScene 필요함 optional로
  player.setSectionId(targetScene || 2);

  socket.write(Packet.S2CEnter(player.getPlayerInfo()));


  partyMembers.forEach(partyMember =>{
    playerSpawnNotificationHandler(partyMember.user.socket, packetData);
  })
};

export default leaveHandler;
