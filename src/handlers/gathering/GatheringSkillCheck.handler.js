import PACKET from '../../utils/packet/packet.js';
import { getPlayerSession, getSectorSessions } from '../../session/sessions.js';
import handleError from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { addExpHandler } from '../player/addExp.handler.js';
import { addItemToInventory } from '../player/inventory/InventoryManager.js';

export const gatheringSkillCheckHandler = async (socket, packetData) => {
  const { deltatime } = packetData;
  const player_id = socket.player.playerId;
  const player = getPlayerSession().getPlayer(socket);
  const sector = getSectorSessions().getSector(player.getSectorId());
  const placedId = player.getGatheringIdx();
  if (placedId >= 0 && placedId < sector.resources.length) {
    if (
      sector.resources[placedId].CheckValidateTiming(
        player.gatheringAngle,
        player.gatheringStartTime,
        deltatime,
      )
    ) {
      const durability = sector.resources[placedId].subDurability();
      if (durability < 0) {
        const packet = PACKET.S2CChat(0, '이미 소모된 자원입니다.', 'System');
        return socket.write(packet);
      }

      socket.write(PACKET.S2CGatheringSkillCheck(placedId, durability));

      const dropItem = sector.resources[placedId].dropItem();
      socket.write(PACKET.S2CGatheringDone(placedId, dropItem, 1));
      console.log('dropItem : \n', dropItem);

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

      // addExpHandler(socket, {
      //   count: sector.resources[placedId].getDifficulty(),
      // });

      if (durability <= 0) {
        setTimeout(
          () => sector.resetDurability(placedId),
          sector.resources[placedId].getRespawnTime(),
        );
      }
    } else {
      handleError(new CustomError(ErrorCodes.INVALID_INPUT, '이미 채집된 자원'));
    }
  } else {
    handleError(new CustomError(ErrorCodes.INVALID_INPUT, '잘못된 자원 데이터'));
  }
};

// message C2SGatheringSkillCheck{
//     int32 placedId;
//     int32 deltatime;
//   }
//   message S2CGatheringSkillCheck{
//     int32 placedId;
//     int32 durabillity;
//   }
