import {
  getPlayerSession,
  getSectorSessions,
  getPartySessions,
} from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import playerSpawnNotificationHandler from './playerSpawnNotification.handler.js';
import { getGameAssets } from '../../init/assets.js';
import TransformInfo from '../../classes/transformInfo.class.js';

const moveSectorHandler = (socket, packetData) => {
  // [1] 패킷 데이터에서 이동할 섹터코드 꺼내고, 내 플레이어 정보와 비교
  const { targetSector } = packetData;
  const player = getPlayerSession().getPlayer(socket);

  if (targetSector === player.getSectorId()) {
    const packet = PACKET.S2CChat(
      0,
      '현 위치와 같은 섹터로 이동할 순 없습니다',
      'System',
    );
    return socket.write(packet);
  }

  try {
    // [2] 이동할 섹터 유효한지 확인
    const newSector = getSectorSessions().getSector(targetSector);
    if (!newSector) {
      const packet = PACKET.S2CChat(
        0,
        '이동할 섹터를 찾을 수 없습니다.',
        'System',
      );
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
      prevSector.notifyExceptMe(PACKET.S2CRemoveTrap(oldTraps),player.id);
    }

    // [4] 내 플레이어 정보 갱신
    player.position = new TransformInfo();
    player.setPath(null);
    player.setSectorId(newSector.sectorCode);

    // [5] 신규 섹터에 내 플레이어 정보 기록하고, 이동에 필요한 데이터 준비
    const players = [];
    newSector.setPlayer(socket, player);
    newSector
      .getAllPlayer()
      .values()
      .forEach((player) => {
        players.push(player.getPlayerInfo());
      });
    // [5-1] 이동할 섹터가 마을이 아니면, 설치돼있는 덫 현황 가져옴
    const traps = newSector.sectorCode != 100 ? newSector.getAllTraps() : [];

    // [6] 준비한 데이터 모아서 패킷 전송 (나에게 다른 플레이어 및 설치된 덫들 보여주기 위함)
    socket.write(PACKET.S2CMoveSector(newSector.sectorCode, players, traps));

    // [7] 이동할 섹터에 있는 유저들에게 내 정보 전송할 예정 (다른 플레이어들에게 나를 보여주기 위함)
    playerSpawnNotificationHandler(socket);
  } catch (err) {
    console.error(err);
  }
};

export default moveSectorHandler;
