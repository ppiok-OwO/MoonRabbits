import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../../utils/packet/payloadData.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const getInventorySlotByItemIdHandler = async (socket, packetData) => {
  const itemIds = packetData.itemIds;
  const player_id = socket.player.playerId;
  const slots = [];

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

  // Redis에서 itemId(값)에 해당하는 slotIdx(키), stack(값) 가져오기
  try {
    for (const itemId of itemIds) {
      for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
        const redisSlot = JSON.parse(redisInventory[slotIdx]);
        if (redisSlot.itemId*1 === itemId) {
          slots.push(
            PAYLOAD_DATA.InventorySlot(slotIdx, itemId, redisSlot.stack),
          );
          break;
        }
      }
    }
  } catch (error) {
    socket.emit(
      new CustomError(ErrorCodes.HANDLER_ERROR, 'getInventorySlot 반복문 에러'),
    );
  }

  // 클라에 응답
  try {
    socket.write(PACKET.S2CGetInventorySlotByItemId(slots));
  } catch (error) {
    socket.emit(
      new CustomError(
        ErrorCodes.INVALID_PACKET,
        'S2CGetInventorySlotByItemId 패킷 생성 에러',
      ),
    );
  }
};
