import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';

const COOL_TIME = 5;
const MAX_TRAP_COUNT = 2;

const setTrapHandler = (socket, packetData) => {
  // [1] 설치 좌표 받고, 플레이어와 현 섹터 찾음
  const { trapPos } = packetData;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());

  // [2] 이미 설치해둔 덫이 있는 플레이어면 최대 개수 제한 확인
  if (sector.traps.has(player.id)) {
    const currentTraps = Array.from(sector.traps.get(player.id).values());
    // [2-1] 현재 설치된 덫 개수가 제한을 초과하면 가장 먼저 설치된 덫 제거
    if (currentTraps.length >= MAX_TRAP_COUNT) {
      const oldTrap = currentTraps.reduce((prevTrap, nextTrap) => {
        return prevTrap.timestamp < nextTrap.timestamp ? prevTrap : nextTrap;
      });

      const removeTrapPayload = sector.deleteTrap(
        player.getPlayerId(),
        oldTrap.pos,
        socket,
      );

      if (removeTrapPayload)
        sector.notify(PACKET.S2CRemoveTrap([removeTrapPayload]));
    }
  }

  // [3] 설치할 덫 정보 서버에 기록하고, 동일 섹터의 플레이어들에게 덫 설치 알림
  const setTrapPayload = sector.setTrap(
    player.getPlayerId(),
    PAYLOAD_DATA.Vec3(trapPos.x, trapPos.y || 0, trapPos.z),
  );

  sector.notify(PACKET.S2CSetTrap(setTrapPayload, COOL_TIME));
};

export default setTrapHandler;
