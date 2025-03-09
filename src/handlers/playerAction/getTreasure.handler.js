import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import { addItemToInventory } from '../player/inventory/inventoryManager.js';
import PACKET from '../../utils/packet/packet.js';

const REGEN_WAITING = 20000;

const getTreasureHandler = async (socket, packetData) => {
  const player_id = socket.player.playerId; // 레디스 꺼, string

  const player = getPlayerSession().getPlayer(socket);

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.hasChest = false;

  const dropItem = sector.resources[1].dropItem(); // 아이템 뭐 줄지 골라야해
  
  try {
    const slotIdx = await addItemToInventory(socket, player_id, dropItem);
    console.log(`아이템이 인벤토리 ${slotIdx}번 슬롯에 저장되었습니다.`);
    // 원한다면 inventoryUpdate.handler.js를 호출해 최신 인벤토리 상태를 클라이언트로 전송할 수 있음
  } catch (err) {
    console.error(`인벤토리 업데이트 실패: ${err}`);
    // 인벤토리 오류 발생 시 클라이언트에 알림 처리 가능
  }

  setTimeout(() => {
    sector.hasChest = true;
    sector.notify(PACKET.S2CRegenChest(sector.getSectorId()));
  }, REGEN_WAITING);
};

export default getTreasureHandler;
