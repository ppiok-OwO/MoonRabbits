import { getGameAssets } from '../../../init/assets.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../../utils/packet/payloadData.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const craftStartHandler = async (socket, packetData) => {
  const { recipeId } = packetData;

  const recipeData = getGameAssets().recipes.data;
  const recipe = recipeData.find((recipe) => recipe.recipe_id === recipeId);
  if (!recipe) {
    socket.emit(new Error('C2SCraft : 그런 레시피 없음'));
  }

  const player_id = socket.player.playerId;

  // Redis 인벤토리 키 설정
  const redisKey = `inventory:${player_id}`;

  // Redis 인벤토리 데이터
  const redisInventory = {};
  try {
    const data = (await redisClient.hgetall(redisKey)) || {};
    Object.assign(redisInventory, data);
  } catch (error) {
    socket.emit(
      new CustomError(ErrorCodes.HANDLER_ERROR, 'redis inventory 조회 에러'),
    );
  }

  const newInventory = [];
  let canCraft = false;

  // # 제작중... 재료 아이템 소모
  try {
    for (const materialItem of recipe.material_items) {
      for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
        newInventory[slotIdx] = JSON.parse(redisInventory[slotIdx]);
        if (newInventory[slotIdx].itemId * 1 === materialItem.item_id) {
          if (newInventory[slotIdx].stack >= materialItem.count) {
            canCraft = true;
            newInventory[slotIdx].stack -= materialItem.count;
            if (newInventory[slotIdx].stack === 0)
              newInventory[slotIdx].itemId = 0;
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
    socket.write(PACKET.S2CChat(0, '재료가 부족합니다.', 'System'));
    socket.write(
      PACKET.S2CCraftStart(false, recipeId, '재료 부족'),
    );
    return;
  }

  // 레디스 인벤토리 업데이트
  const slots = [];
  await redisClient.del(redisKey);
  for (let i = 0; i < 25; i++) {
    redisClient.hset(
      redisKey,
      i.toString(),
      JSON.stringify(newInventory[i]),
    );
    slots.push(PAYLOAD_DATA.InventorySlot(i, newInventory[i].itemId, newInventory[i].stack));
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
    socket.write(
      PACKET.S2CCraftStart(true, recipeId, '재작 시작... 재료 소모됨'),
    );
  } catch (error) {
    socket.emit(new Error('S2CCraftStart 제작 시작 패킷 생성 에러'));
  }
};
