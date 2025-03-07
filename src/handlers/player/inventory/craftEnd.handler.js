import { getGameAssets } from '../../../init/assets.js';
import { getPlayerSession } from '../../../session/sessions.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../../utils/packet/payloadData.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const craftEndHandler = async (socket, packetData) => {
  const { recipeId } = packetData;

  const recipeData = getGameAssets().recipes.data;
  const recipe = recipeData.find((recipe) => recipe.recipe_id === recipeId);
  if (!recipe) {
    socket.emit(new Error('C2SCraft : 그런 레시피 없음'));
  }

  const player_id = socket.player.playerId;
  const player = getPlayerSession().getPlayer(socket);
  if (player.isCrafting === false) {
    socket.emit(new CustomError(ErrorCodes.INVALID_INPUT, '잘못된 제작 완료 요청'));
    return;
  }

  // 클라이언트에 결과로 보내줄 조합아이템
  const craftItemId = recipe.craft_item_id;
  let craftSlotIdx = -1;

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

  // 인벤토리 빈 슬롯 찾아서 제작 아이템 추가하기
  canCraft = false;
  let isNewCraft = true;
  let tempSlotIdx = 100;

  // 인벤에 있는 경우, 기존 슬롯에 누적
  for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
    try {
        newInventory[slotIdx] = JSON.parse(redisInventory[slotIdx]);
    } catch (error) {
        console.error(`invalid format : redisInventory[slotIdx]`);
        return;
    }
    if (newInventory[slotIdx].itemId * 1 === craftItemId) {
      isNewCraft = false;
      canCraft = true;
      newInventory[slotIdx].stack += 1;
    }
    if (newInventory[slotIdx].itemId * 1 === 0) {
      tempSlotIdx = Math.min(slotIdx, tempSlotIdx);
    }
  }

  // 인벤에 없는 경우, 새 슬롯에 추가
  if (tempSlotIdx < 100 && isNewCraft) {
    canCraft = true;
    newInventory[tempSlotIdx].itemId = craftItemId;
    newInventory[tempSlotIdx].stack = 1;
    craftSlotIdx = tempSlotIdx;
  }

  // 빈 인벤토리가 없어서 제작 아이템을 추가하지 못했을 때
  if (!canCraft) {
    socket.write(PACKET.S2CChat(0, '빈 인벤토리 슬롯이 없습니다', 'System'));
    socket.write(PACKET.S2CCraftEnd(false, '빈 슬롯이 없어서 제작 완료 실패'));
    return;
  }

  // 레디스 인벤토리 업데이트
  const slots = [];
  await redisClient.del(redisKey);
  for (let i = 0; i < 25; i++) {
    redisClient.hset(redisKey, i.toString(), JSON.stringify(newInventory[i]));
    slots.push(PAYLOAD_DATA.InventorySlot(i, newInventory[i].itemId, newInventory[i].stack));
  }
  
  // 인벤토리 업데이트 패킷 전송
  try {
    socket.write(PACKET.S2CInventoryUpdate(slots));
  } catch (error) {
    socket.emit(new Error('S2CCraft 인벤토리 업데이트 패킷 생성 에러'));
  }

  // 제작 결과 업데이트 패킷 전송
  try {
    socket.write(PACKET.S2CCraftEnd(true, '제작 완료'));
  } catch (error) {
    socket.emit(new Error('S2CCraftEnd 제작 완료 패킷 생성 에러'));
  }

  // 세션 업데이트
  player.isCrafting = false;
  player.craftingSlots = [];
};
