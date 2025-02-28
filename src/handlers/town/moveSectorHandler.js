import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { getGameAssets } from '../../init/assets.js';

const moveSectorHandler = (socket, packetData) => {
  const { targetSector } = packetData;
  const gameAssets = getGameAssets();

  const targetSectorCode = targetSector || 2;

  const player = getPlayerSession().getPlayer(socket);
  const prevSector = getSectorSessions().getSector(player.getSectorId());
  const partySession = getPartySessions();

  const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것

  // 파티가 있는지 체크
  if (player.partyId) {
    const party = getPartySessions().getParty(player.partyId);

    if (party.getPartyLeaderId() === player.id) {
      // 파티 인스턴스
      const party = partySession.getParty(player.partyId);
      const allMembers = party.getAllMembers().values();
      for (const member of allMembers) {
        partyMembers.push(member);
      }
    } else {
      const packet = PACKET.S2CChat(0, '당신은 파티장이 아닙니다.', 'System');
      return socket.write(packet);
    }
  }

  try {
    // 현재는 섹터가 한개씩 존재함으로 섹터 코드로 탐색
    const newSector = getSectorSessions().getSectorByCode(targetSectorCode);
    if (!newSector) {
      const packet = PACKET.S2CChat(0, '섹터가 존재하지 않습니다..', 'System');
      return socket.write(packet);
    }
    // 디스폰
    prevSector.notify(
      PACKET.S2CDespawn(
        partyMembers.map((partyMember) => {
          return partyMember.id;
        }),
        player.getSectorId(),
      ),
    );

    partyMembers.forEach((member) => {
      member.setSectorId(newSector.getSectorId());
      prevSector.deletePlayer(member.user.socket);
      newSector.setPlayer(member.user.socket, member);
      const memberSocket = member.user.getSocket();
      memberSocket.write(PACKET.S2CEnter(member.getPlayerInfo()));
      playerSpawnNotificationHandler(member.user.socket, {});
    });

  } catch (err) {
    console.error(err);
  }
};

export default moveSectorHandler;
