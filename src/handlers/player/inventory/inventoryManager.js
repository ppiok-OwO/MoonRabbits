// inventoryManager.js
import redisClient from '../../../utils/redis/redis.config.js';
import { inventoryUpdateHandler } from './inventoryUpdate.handler.js'; // 경로는 프로젝트 구조에 맞게 수정

/**
 * 플레이어의 인벤토리에 dropItem 추가 후, 업데이트된 슬롯 정보를 클라이언트에 전달함.
 * @param {object} socket - 플레이어의 소켓 객체
 * @param {string} playerId - 플레이어의 ID
 * @param {number} dropItem - 단순 itemId 값 (예: 1001)
 * @returns {number} 업데이트된 슬롯 번호
 */
export const addItemToInventory = async (socket, playerId, dropItem) => {
  // dropItem은 단순 itemId이므로 객체로 변환하여 기본 옵션 적용 (stack은 항상 1씩 증가)
  const item = { itemId: dropItem, stackable: true, stack: 1 };

  const redisKey = `inventory:${playerId}`;
  // Redis에서 기존 인벤토리 데이터 가져오기 (없을 경우 빈 객체)
  const currentData = (await redisClient.hgetall(redisKey)) || {};
  const inventorySlots = [];

  console.log('currentData : \n', currentData);

  // 25칸 인벤토리 기본값 초기화 (빈 슬롯: itemId 0, stack 0)
  for (let i = 0; i < 25; i++) {
    const key = i.toString();
    if (currentData[key]) {
      try {
        inventorySlots[i] = JSON.parse(currentData[key]);
      } catch (err) {
        console.error(`슬롯 ${i} 파싱 에러: ${err}`);
        inventorySlots[i] = { itemId: 0, stack: 0 };
      }
    } else {
      inventorySlots[i] = { itemId: 0, stack: 0 };
    }
  }

  let updatedSlotIdx = -1;
  let updatedStack = 0;

  // 스택 가능한 아이템의 경우, 기존 인벤토리 내에 동일한 itemId가 있다면 무조건 +1로 증가
  if (item.stackable) {
    for (let i = 0; i < inventorySlots.length; i++) {
      if (inventorySlots[i].itemId === item.itemId) {
        inventorySlots[i].stack += 1; // 항상 +1씩 증가
        updatedSlotIdx = i;
        updatedStack = inventorySlots[i].stack;
        await redisClient.hset(redisKey, i.toString(), JSON.stringify(inventorySlots[i]));
        break;
      }
    }
  }

  // 동일 아이템이 없으면 빈 슬롯에 저장 (stack은 1로 설정)
  if (updatedSlotIdx === -1) {
    for (let i = 0; i < inventorySlots.length; i++) {
      if (inventorySlots[i].itemId === 0) {
        inventorySlots[i] = { itemId: item.itemId, stack: item.stack };
        updatedSlotIdx = i;
        updatedStack = item.stack;
        await redisClient.hset(redisKey, i.toString(), JSON.stringify(inventorySlots[i]));
        break;
      }
    }
  }

  if (updatedSlotIdx === -1) {
    throw new Error('인벤토리가 가득 차있습니다.');
  }

  // 업데이트된 슬롯 정보를 포함하는 패킷 데이터 구성 (InventorySlot 구조: slotIdx, itemId, stack)
  const updateData = {
    slots: [
      {
        slotIdx: updatedSlotIdx,
        itemId: item.itemId,
        stack: updatedStack,
      },
    ],
  };

  // inventoryUpdate.handler.js를 호출하여 Redis에 저장된 전체 인벤토리(25 슬롯) 데이터를 클라이언트에 전송
  await inventoryUpdateHandler(socket, updateData);

  return updatedSlotIdx;
};
