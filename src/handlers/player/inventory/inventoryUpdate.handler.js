import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import { syncInventoryToRedisAndSend } from '../../../db/user/user.db.js';
import PACKET from '../../../utils/packet/packet.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const inventoryUpdateHandler = async (socket) => {
  try {
    // player_id는 socket에 저장해둔 데이터를 사용
    const player_id = socket.player.playerId;

    // MySQL에 있는 인벤토리 데이터를 Redis에 저장시켜주는 DB 함수
    await syncInventoryToRedisAndSend(player_id);

    // Redis에 저장된 데이터를 다시 읽어와 InventorySlot 배열로 재구성합니다.
    const redisKey = `inventory:${player_id}`;
    const redisData = await redisClient.hGetAll(redisKey);
    const slots = []; // payload에 Redis 데이터 담기 위한 배열
    // 정렬을 위해 슬롯 번호를 숫자로 변환하여 오름차순 정렬합니다.
    const keys = Object.keys(redisData)
      .map(Number)
      .sort((a, b) => a - b);
    for (const key of keys) {
      let dataObj;
      try {
        dataObj = JSON.parse(redisData[key.toString()]);
      } catch (err) {
        console.error(`슬롯 ${key} 데이터 파싱 에러: ${err}`);
        continue;
      }
      slots.push({
        slotIdx: key,
        itemId: dataObj.itemId,
        stack: dataObj.stack,
      });
    }
    // Redis에서 가져온 slots 데이터 payload에 담기
    const payload = { slots };

    console.log(
      `${chalk.green('[InventoryHandler Log]')} 플레이어 ${player_id}의 인벤토리 Update!`,
    );

    // const packet = PACKET.S2CInventoryUpdate(payload);
    // return socket.write(packet);
  } catch (error) {
    console.error(chalk.red('[inventoryUpdate Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'inventoryUpdate 에러'));
  }
};
