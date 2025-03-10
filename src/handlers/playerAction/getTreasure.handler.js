import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import { addItemToInventory } from '../player/inventory/inventoryManager.js';
import PACKET from '../../utils/packet/packet.js';

const REGEN_WAITING = 20000;
// getGameAssets().item.data를 통해 접근하는 게 옳지만...
const RARE_ITEM_ID = 20005;
const RARE_ITEM_NAME = "단열재가 들어간 판자";

const getTreasureHandler = async (socket, packetData) => {
  const player_id = socket.player.playerId; // 레디스 꺼, string

  const player = getPlayerSession().getPlayer(socket);

  const sector = getSectorSessions().getSector(player.getSectorId());
  sector.hasChest = false;  

  try {
    const slotIdx = await addItemToInventory(socket, player_id, RARE_ITEM_ID);
    socket.write(PACKET.S2CChat(0,`${RARE_ITEM_NAME}아이템을 1개 획득했습니다.`,"System"))
    console.log(`아이템이 인벤토리 ${slotIdx}번 슬롯에 저장되었습니다.`);
  } catch (err) {
    socket.write(PACKET.S2CChat(0,`아이템 획득에 실패했습니다.`,"System"))
    console.error(`인벤토리 업데이트 실패: ${err}`);
  }

  setTimeout(() => {
    sector.hasChest = true;
    sector.notify(PACKET.S2CRegenChest(sector.getSectorId()));
  }, REGEN_WAITING);
};

export default getTreasureHandler;
