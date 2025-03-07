import { getGameAssets } from '../../../init/assets.js';
import { getPlayerSession } from '../../../session/sessions.js';
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
  const player = getPlayerSession().getPlayer(socket);
  player.isCrafting = true;

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
  let canCraft = true;
  let hasMaterial = false;

  // # 제작중... 재료 아이템 소모
  try {
    for (let slotIdx = 0; slotIdx < 25; slotIdx++) {

      newInventory[slotIdx] = JSON.parse(redisInventory[slotIdx]);
      for (const materialItem of recipe.material_items) {
        if (newInventory[slotIdx].itemId * 1 === materialItem.item_id) {
          hasMaterial = true;
          if (newInventory[slotIdx].stack >= materialItem.count) {
            newInventory[slotIdx].stack -= materialItem.count;
            player.backupCraftingSlot(slotIdx, materialItem.item_id, materialItem.count);
            if (newInventory[slotIdx].stack === 0)
              newInventory[slotIdx].itemId = 0;
          }else {
            canCraft = false;
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

  // 보유중인 재료가 없거나 부족할 때
  if (!canCraft || !hasMaterial) {
    socket.write(PACKET.S2CCraftStart(false, recipeId, '재료가 부족합니다.'));
    return;
  }

  // 레디스 인벤토리 업데이트
  const slots = [];
  await redisClient.del(redisKey);
  for (let i = 0; i < 25; i++) {
    redisClient.hset(redisKey, i.toString(), JSON.stringify(newInventory[i]));
    try {
      slots.push(
        PAYLOAD_DATA.InventorySlot(
          i,
          newInventory[i].itemId,
          newInventory[i].stack,
        ),
      );
    } catch (error) {
        socket.emit(
          new CustomError(ErrorCodes.HANDLER_ERROR, 'redis inventory 저장장 에러'),
        );
        return;
    }
  }

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
