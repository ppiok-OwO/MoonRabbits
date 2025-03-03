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

  const player = getPlayerSession().getPlayer(socket);
  const prevSector = getSectorSessions().getSector(player.getSectorId());
  const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것

  // 플레이어가 파티에 소속되어 있는지 체크
  const party = getPartySessions().getParty(player.partyId);
  if (party) {
    if (party.getPartyLeaderId() === player.id) {
      // 파티 인스턴스
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
    const newSector = getSectorSessions().getSectorByCode(targetSector);
    if (!newSector) {
      const packet = PACKET.S2CChat(0, '섹터가 존재하지 않습니다.', 'System');
      return socket.write(packet);
    }
    // 디스폰
    prevSector.notify(
      PACKET.S2CDespawn(
        partyMembers.map((partyMember) => {
          return partyMember.id;
        }),
      ),
    );

    partyMembers.forEach((member) => {
      member.setSectorId(newSector.getSectorId());
      prevSector.deletePlayer(member.user.socket);
      newSector.setPlayer(member.user.socket, member);
      const memberSocket = member.user.getSocket();
      memberSocket.write(
        PACKET.S2CEnter(newSector.getSectorId(), member.getPlayerInfo()),
      );

      if (prevSector.sectorCode != 100) {
        const oldTraps = prevSector.removeTraps(member.getPlayerId());
        prevSector.notify(PACKET.S2CRemoveTrap(oldTraps)); // 이전 섹터에 남은 덫 제거
      }
      if (targetSector.sectorCode != 100) {
        memberSocket.write(PACKET.S2CTraps(newSector.getAllTraps())); // 새 섹터의 덫 현황
      }

      playerSpawnNotificationHandler(member.user.socket, {});

      // 경로 초기화
      member.setPath(null);
    });
  } catch (err) {
    console.error(err);
  }
};
export default moveSectorHandler;
