import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import { syncInventoryToRedisAndSend } from '../../../db/user/user.db.js';
import PACKET from '../../../utils/packet/packet.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const inventoryUpdateHandler = async (socket, packetData) => {
  try {
    // socket에서 플레이어 ID 가져오기
    const player_id = socket.player.playerId;
    const redisKey = `inventory:${player_id}`;

    // 클라이언트로부터 슬롯 데이터가 전송된 경우 (즉, 인벤토리 상태 변화가 있을 경우)
    if (
      packetData &&
      Array.isArray(packetData.slots) &&
      packetData.slots.length > 0
    ) {
      // 현재 Redis에 저장되어 있는 인벤토리 데이터를 불러옴 (25칸 유지)
      const currentData = (await redisClient.hgetall(redisKey)) || {};
      const fullInventory = [];

      // 25칸 인벤토리 기본값(빈 슬롯: itemId=0, stack=0)으로 배열 생성
      for (let i = 0; i < 25; i++) {
        const key = i.toString();
        if (currentData[key]) {
          try {
            fullInventory[i] = JSON.parse(currentData[key]);
          } catch (err) {
            console.error(`슬롯 ${i} 데이터 파싱 에러: ${err}`);
            fullInventory[i] = { itemId: 0, stack: 0 };
          }
        } else {
          fullInventory[i] = { itemId: 0, stack: 0 };
        }
      }

      // 클라이언트에서 전송한 변경 슬롯을 병합 (해당 슬롯만 업데이트)
      for (const slot of packetData.slots) {
        const { slotIdx, itemId, stack } = slot;
        if (slotIdx >= 0 && slotIdx < 25) {
          fullInventory[slotIdx] = { itemId: +itemId, stack };
        }
      }

      // Redis에 저장된 기존 인벤토리 데이터를 삭제 후, 전체 25칸 업데이트
      await redisClient.del(redisKey);
      for (let i = 0; i < 25; i++) {
        await redisClient.hset(
          redisKey,
          i.toString(),
          JSON.stringify(fullInventory[i]),
        );
      }
      console.log(
        `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 전체 인벤토리 업데이트 완료.`,
      );

      // 전체 25 슬롯 배열을 포함한 패킷 생성 및 전송
      const fullInventoryPacket = fullInventory.map((data, i) => ({
        slotIdx: i,
        itemId: data.itemId == null ? 0 : data.itemId,
        stack: data.stack,
      }));
      console.log('fullInventoryPacket Checkt : \n', fullInventoryPacket);
      const packet = PACKET.S2CInventoryUpdate(fullInventoryPacket);
      return socket.write(packet);
    } else {
      // 슬롯 업데이트 정보가 없으면 Sector 이동에 따른 MySQL 동기화 수행
      await syncInventoryToRedisAndSend(player_id);
      console.log(
        `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 Sector 이동에 따른 동기화 수행됨.`,
      );

      // 기존 방식대로 Redis 저장 데이터를 불러와서 클라이언트에 전송
      const redisData = (await redisClient.hgetall(redisKey)) || {};
      const slots = [];
      const keys = Object.keys(redisData)
        .map(Number)
        .sort((a, b) => a - b);

      for (const key of keys) {
        const slotData = redisData[key.toString()];
        if (!slotData) {
          console.warn(
            `플레이어 ${player_id}의 슬롯 ${key} 데이터가 undefined입니다.`,
          );
          continue;
        }
        try {
          const dataObj = JSON.parse(slotData);
          slots.push({
            slotIdx: key,
            itemId: +dataObj.itemId,
            stack: dataObj.stack,
          });
        } catch (err) {
          console.error(`슬롯 ${key} 데이터 파싱 에러: ${err}`);
          continue;
        }
      }
      const packet = PACKET.S2CInventoryUpdate(slots);
      return socket.write(packet);
    }
  } catch (error) {
    console.error(chalk.red('[inventoryUpdate Error]\n', error));
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'inventoryUpdate 에러'),
    );
  }
};

export default inventoryUpdateHandler;
