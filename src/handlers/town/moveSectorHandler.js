import { getPlayerSession, getSectorSessions, getPartySessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { getGameAssets } from '../../init/assets.js';
import TransformInfo from '../../classes/transformInfo.class.js';
import RedisSession from '../../classes/session/redisSession.class.js';

const moveSectorHandler = async (socket, packetData) => {
  // [1] 패킷 데이터에서 이동할 섹터코드 꺼내고, 내 플레이어 정보와 비교
  const { targetSector } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const redisSession = new RedisSession();

  if (targetSector === player.getSectorId()) {
    const packet = PACKET.S2CChat(0, '현 위치와 같은 섹터로 이동할 순 없습니다', 'System');
    return socket.write(packet);
  }

  try {
    // [2] 이동할 섹터 유효한지 확인
    const newSector = getSectorSessions().getSector(targetSector);
    if (!newSector) {
      const packet = PACKET.S2CChat(0, '이동할 섹터를 찾을 수 없습니다.', 'System');
      return socket.write(packet);
    }

    // [3] 전체 유저들에게 내 플레이어를 디스폰시킴 (클라의 PlayerList 갱신을 위해선 전체에 보내야함)
    getPlayerSession().notify(PACKET.S2CDespawn(player.id));
    // [3-1] 이전 섹터에서 내 정보를 제거
    const prevSector = getSectorSessions().getSector(player.getSectorId());
    prevSector.deletePlayer(socket);
    // [3-2] 이전 섹터가 마을이 아니면, 내가 남긴 덫들 제거
    if (prevSector.sectorCode != 100) {
      const oldTraps = prevSector.removeTraps(player.id);
      prevSector.notifyExceptMe(PACKET.S2CRemoveTrap(oldTraps), player.id);
    }

    // [4] 내 플레이어 정보 갱신
    player.position = new TransformInfo();
    player.setPath(null);
    player.setSectorId(newSector.sectorCode);

    // [5] 신규 섹터에 내 플레이어 정보 기록하고, 이동에 필요한 데이터 준비
    const players = [];
    newSector.setPlayer(socket, player);
    for (const player of newSector.getAllPlayer().values()) {
      players.push(player.getPlayerInfo());
    }
    // [5-1] 이동할 섹터가 마을이 아니면, 설치돼있는 덫 현황 가져옴
    const traps = newSector.sectorCode != 100 ? newSector.getAllTraps() : [];

    // [5-2] Redis에 이동한 setorCode 저장
    await redisSession.saveToRedisPlayerSession(socket);

    // [6] 준비한 데이터 모아서 패킷 전송 (나에게 다른 플레이어 및 설치된 덫들 보여주기 위함)
    socket.write(PACKET.S2CMoveSector(newSector.sectorCode, players, traps));

    // [7] 이동할 섹터에 있는 유저들에게 내 정보 전송할 예정 (다른 플레이어들에게 나를 보여주기 위함)
    playerSpawnNotificationHandler(socket);
  } catch (err) {
    console.error(err);
  }
};

// const moveSectorHandler = (socket, packetData) => {
//   const { targetSector } = packetData;
//   const gameAssets = getGameAssets();

//   const player = getPlayerSession().getPlayer(socket);
//   const prevSector = getSectorSessions().getSector(player.getSectorId());
//   const partySession = getPartySessions();

//   const partyMembers = [player]; // 본인만 혹은 파티원 배열에 넣을 것

//   // 파티가 있는지 체크
//   if (player.partyId) {
//     const party = getPartySessions().getParty(player.partyId);

//     if (party.getPartyLeaderId() === player.id) {
//       // 파티 인스턴스
//       const party = partySession.getParty(player.partyId);
//       const allMembers = party.getAllMembers().values();
//       for (const member of allMembers) {
//         // 나 자신은 제외해야 함
//         if (member.id === player.id) continue;
//         partyMembers.push(member);
//       }
//     } else {
//       const packet = PACKET.S2CChat(0, '당신은 파티장이 아닙니다.', 'System');
//       return socket.write(packet);
//     }
//   }

//   try {
//     // 현재는 섹터가 한개씩 존재함으로 섹터 코드로 탐색
//     const newSector = getSectorSessions().getSectorByCode(targetSector);
//     if (!newSector) {
//       const packet = PACKET.S2CChat(0, '섹터가 존재하지 않습니다.', 'System');
//       return socket.write(packet);
//     }
//     // 디스폰
//     prevSector.notify(
//       PACKET.S2CDespawn(
//         partyMembers.map((partyMember) => {
//           return partyMember.id;
//         }),
//       ),
//     );

//     partyMembers.forEach((member) => {
//       member.setSectorId(newSector.getSectorId());
//       prevSector.deletePlayer(member.user.socket);
//       newSector.setPlayer(member.user.socket, member);
//       const memberSocket = member.user.getSocket();
//       memberSocket.write(
//         PACKET.S2CEnter(newSector.getSectorId(), member.getPlayerInfo()),
//       );

//       if (prevSector.sectorCode != 100) {
//         const oldTraps = prevSector.removeTraps(member.getPlayerId());
//         prevSector.notify(PACKET.S2CRemoveTrap(oldTraps)); // 이전 섹터에 남은 덫 제거
//       }
//       if (targetSector.sectorCode != 100) {
//         memberSocket.write(PACKET.S2CTraps(newSector.getAllTraps())); // 새 섹터의 덫 현황
//       }

//       playerSpawnNotificationHandler(member.user.socket, {});

//       // 파티 멤버의 경로 초기화
//       member.setPath(null);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

export default moveSectorHandler;
