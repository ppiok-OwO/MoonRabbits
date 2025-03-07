import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';
import { animationHandler } from '../social/playerAnimation.handler.js';
import { addItemToInventory } from '../player/inventory/inventoryManager.js';
import { getGameAssets } from '../../init/assets.js';

export const gatheringDoneHandler = async (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const placedId = player.getGatheringIdx();
  const player_id = player.getPlayerId();
  if (player.gatheringSuccess) {
    player.gatheringSuccess = false;

    const dropItem = sector.resources[placedId].dropItem();
    const dropItemData = getGameAssets().item.data.find(item =>{return item.item_id == dropItem});
    const quentity = 1;
    player.sendPacket(PACKET.S2CChat(
      0,
      `${dropItemData.item_name}아이템을 ${quentity}개 획득했습니다.`,
      'System',
    ))
    socket.write(PACKET.S2CGatheringDone(placedId, dropItem, 1));
    console.log('dropItem : \n', dropItem);
    const durability = sector.subDurability(placedId);

    if (durability <= 0) {
      setTimeout(
        () => sector.resetDurability(placedId),
        sector.resources[placedId].getRespawnTime(),
      );
    }

    // 채집한 아이템을 인벤토리 추가하는 로직
    // dropItem을 Redis 인벤토리에 저장하는 로직 추가
    try {
      const slotIdx = await addItemToInventory(socket, player_id, dropItem);
      console.log(`아이템이 인벤토리 ${slotIdx}번 슬롯에 저장되었습니다.`);
      // 원한다면 inventoryUpdate.handler.js를 호출해 최신 인벤토리 상태를 클라이언트로 전송할 수 있음
    } catch (err) {
      console.error(`인벤토리 업데이트 실패: ${err}`);
      // 인벤토리 오류 발생 시 클라이언트에 알림 처리 가능
    }

    addExpHandler(socket, {
      count: sector.resources[placedId].getDifficulty(),
    });

  }
};

