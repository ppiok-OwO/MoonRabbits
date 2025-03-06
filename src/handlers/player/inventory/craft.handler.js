import { getGameAssets } from '../../../init/assets.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../../utils/packet/payloadData.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const craftHandler = async (socket, packetData) => {
  const { recipeId, count } = packetData; // 조합식ID, 재료 정보 [{itemId, count}]

  const recipeData = getGameAssets().recipes.data;
  const recipe = recipeData.find((recipe) => recipe.recipe_id === recipeId);
  if (!recipe) {
    socket.emit(new Error('C2SCraft : 그런 레시피 없음'));
  }

  // 클라이언트에 결과로 보내줄 조합아이템
  const craftItemId = recipe.craft_item_id;
  let craftSlotIdx = -1;

  const player_id = socket.player.playerId;

  // Redis 인벤토리 키 설정
  const redisKey = `inventory:${player_id}`;

  // Redis에 저장된 인벤토리 데이터
  const redisInventory = {};
  try {
    const data = (await redisClient.hgetall(redisKey)) || {};
    Object.assign(redisInventory, data);
  } catch (error) {
    socket.emit(
      new CustomError(ErrorCodes.HANDLER_ERROR, 'redis inventory 조회 에러'),
    );
  }

  const slots = [];
  const newInventory = [];
  let canCraft = false;
  try {
    for (const materialItem of recipe.material_items) {
      for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
        newInventory[slotIdx] = JSON.parse(redisInventory[slotIdx]);
        slots.push(
          PAYLOAD_DATA.InventorySlot(
            slotIdx,
            newInventory[slotIdx].itemId*1,
            newInventory[slotIdx].stack,
          ),
        );
        if (newInventory[slotIdx].itemId*1 === materialItem.item_id) {
          if (newInventory[slotIdx].stack >= materialItem.count * count) {
            canCraft = true;
            newInventory[slotIdx].stack -= materialItem.count * count;
            slots[slotIdx].stack = newInventory[slotIdx].stack;
            if(newInventory[slotIdx].stack===0) newInventory[slotIdx].itemId = 0;
          }
        }
      }
    }
  } catch (error) {
    socket.emit(
      new CustomError(
        ErrorCodes.HANDLER_ERROR,
        'Craft 핸들러 재료 확인 반복문 에러',
      ),
    );
  }

  // 보유중인 재료가 부족할 때
  if (!canCraft) {
    socket.write(
      PACKET.S2CChat(
        0,
        '제작에 필요한 재료가 부족합니다.',
        'System',
      ),
    );
    return;
  }

  // 인벤토리 빈 슬롯 찾아서 제작 아이템 추가하기 
  canCraft = false;
  let isNewCraft = true;
  let tempSlotIdx = 100;

  // 인벤에 있는 경우, 기존 슬롯에 누적
  for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
    if (newInventory[slotIdx].itemId*1 === craftItemId) {
      isNewCraft = false;
      canCraft = true;
      slots[slotIdx].itemId = craftItemId;
      newInventory[slotIdx].stack += count;
      slots[slotIdx].stack = newInventory[slotIdx].stack;
    }
    if (newInventory[slotIdx].itemId*1 === 0) {
      tempSlotIdx = Math.min(slotIdx, tempSlotIdx);
    }
  }

  // 인벤에 없는 경우, 새 슬롯에 추가
  if(tempSlotIdx<100 && isNewCraft) {
    canCraft = true;
    newInventory[tempSlotIdx].itemId = craftItemId;
    slots[tempSlotIdx].itemId = craftItemId;
    newInventory[tempSlotIdx].stack = count;
    slots[tempSlotIdx].stack = count;
    craftSlotIdx = tempSlotIdx;
  }

  // 빈 인벤토리가 없어서 제작 아이템을 추가하지 못했을 때
  if (!canCraft) {
    socket.write(PACKET.S2CChat(0, '빈 인벤토리 슬롯이 없습니다', 'System'));
    return;
  }

  // 레디스 인벤토리 업데이트
  await redisClient.del(redisKey);
  for (let i = 0; i < 25; i++) {
    await redisClient.hset(
      redisKey,
      i.toString(),
      JSON.stringify(newInventory[i]),
    );
  }
  console.log(`플레이어 ${player_id}의 전체 인벤토리 업데이트 완료.`);

  // 인벤토리 업데이트 패킷 전송
  try {
    socket.write(PACKET.S2CInventoryUpdate(slots));
  } catch (error) {
    socket.emit(new Error('S2CCraft 인벤토리 업데이트 패킷 생성 에러'));
  }

  // 제작 결과 업데이트 패킷 전송
  try {
    socket.write(PACKET.S2CCraft(craftItemId, count, craftSlotIdx));
  } catch (error) {
    socket.emit(new Error('S2CCraft 제작 결과 패킷 생성 에러'));
  }
};
