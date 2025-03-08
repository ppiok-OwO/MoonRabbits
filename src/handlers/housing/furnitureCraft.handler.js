import { getGameAssets } from '../../init/assets.js';
import { getPlayerSession } from '../../session/sessions.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import PACKET from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';
import redisClient from '../../utils/redis/redis.config.js';

/**
 * furnitureCraftHandler
 * 클라이언트가 전송한 가구 아이템 ID를 기반으로 가구 제작(설치)을 실행하는 핸들러
 * - furniture_recipe.json에서 해당 레시피를 조회
 * - 플레이어 인벤토리에서 재료 확인 및 차감
 * - 인벤토리 업데이트 후 가구 설치 결과 패킷 전송
 */
export const furnitureCraftHandler = async (socket, packetData) => {
  // 클라이언트로부터 가구 제작 대상 아이템 ID 수신
  const { recipeId } = packetData;

  // furniture_recipe.json의 레시피 데이터를 불러옴
  const furnitureRecipes = getGameAssets().furniture_recipe.data;

  // 클라이언트가 보낸 itemId와 일치하는 가구 제작 레시피 검색
  const recipe = furnitureRecipes.find((r) => r.craft_item_id === recipeId);
  if (!recipe) {
    socket.emit(new Error('C2SFurnitureCraft: 해당 가구 레시피가 없습니다.'));
    return;
  }

  const playerId = socket.player.playerId;
  const player = getPlayerSession().getPlayer(socket);
  // 가구 제작 프로세스 시작 플래그 설정
  player.isCrafting = true;

  // Redis 인벤토리 키 설정 및 데이터 조회
  const redisKey = `inventory:${playerId}`;
  const redisInventory = {};
  try {
    const data = (await redisClient.hgetall(redisKey)) || {};
    Object.assign(redisInventory, data);
  } catch (error) {
    socket.emit(new CustomError(ErrorCodes.HANDLER_ERROR, 'redis inventory 조회 에러'));
    return;
  }

  // 인벤토리 데이터를 25 슬롯 배열로 파싱 (각 슬롯은 JSON 문자열로 저장됨)
  const newInventory = [];
  for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
    try {
      newInventory[slotIdx] = JSON.parse(redisInventory[slotIdx]);
    } catch (e) {
      newInventory[slotIdx] = { itemId: 0, stack: 0 };
    }
  }

  // 레시피에 등록된 각 재료가 인벤토리 내에서 충분한지 확인 후 차감
  let hasAllMaterials = true;
  for (const materialItem of recipe.material_items) {
    let materialFound = false;
    for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
      if (newInventory[slotIdx].itemId * 1 === materialItem.item_id) {
        if (newInventory[slotIdx].stack >= materialItem.count) {
          // 재료 차감 및 백업(추후 롤백용)
          newInventory[slotIdx].stack -= materialItem.count;
          player.backupCraftingSlot(slotIdx, materialItem.item_id, materialItem.count);
          if (newInventory[slotIdx].stack === 0) {
            newInventory[slotIdx].itemId = 0;
          }
          materialFound = true;
          break;
        } else {
          materialFound = false;
          break;
        }
      }
    }
    if (!materialFound) {
      hasAllMaterials = false;
      break;
    }
  }

  // 재료가 부족한 경우 실패 패킷을 전송하고 함수 종료
  if (!hasAllMaterials) {
    socket.write(PACKET.S2CFurnitureCraft(false, recipeId, '재료가 부족합니다.'));
    return;
  }

  // Redis 인벤토리 업데이트: 기존 데이터를 삭제 후 차감된 내용으로 재설정
  const slots = [];
  try {
    await redisClient.del(redisKey);
    for (let i = 0; i < 25; i++) {
      await redisClient.hset(redisKey, i.toString(), JSON.stringify(newInventory[i]));
      slots.push(PAYLOAD_DATA.InventorySlot(i, newInventory[i].itemId, newInventory[i].stack));
    }
    // 업데이트된 인벤토리 정보를 클라이언트에 전송
    socket.write(PACKET.S2CInventoryUpdate(slots));
  } catch (error) {
    socket.emit(new CustomError(ErrorCodes.HANDLER_ERROR, 'redis inventory 업데이트 에러'));
    return;
  }

  // 가구 제작(설치) 성공 결과 패킷 전송
  try {
    socket.write(PACKET.S2CFurnitureCraft(true, recipeId, '가구 설치 완료'));
  } catch (error) {
    socket.emit(new Error('S2CFurnitureCraft 패킷 생성 에러'));
  }
};

export default furnitureCraftHandler;
