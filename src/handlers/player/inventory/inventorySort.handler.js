import chalk from 'chalk';
import redisClient from '../../../utils/redis/redis.config.js';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import PACKET from '../../../utils/packet/packet.js';
import { inventoryUpdateHandler } from './inventoryUpdate.handler.js';

export const inventorySortHandler = async (socket, packetData) => {
  try {
    const { slots } = packetData;
    const player_id = socket.player.playerId;

    console.log(
      `${player_id}의 인벤토리 정렬 패킷 수신: ${slots.length}개의 슬롯 데이터`,
    );

    // Redis 인벤토리 키 설정
    const redisKey = `inventory:${player_id}`;

    // 현재 저장되어 있는 인벤토리 데이터를 초기화
    await redisClient.del(redisKey);

    // 정렬된 슬롯 배열의 순서대로 재인덱싱하여 저장
    for (let i = 0; i < slots.length; i++) {
      const { itemId, stack } = slots[i];
      await redisClient.hset(
        redisKey,
        i.toString(),
        JSON.stringify({ itemId, stack }),
      );
    }

    console.log(
      `Player ${player_id}의 인벤토리가 정렬되어 Redis에 업데이트되었습니다.`,
    );

    // await inventoryUpdateHandler(socket);
  } catch (error) {
    console.error(chalk.red('[inventorySort Error]\n', error));
    socket.emit(
      'error',
      new CustomError(ErrorCodes.HANDLER_ERROR, 'inventorySort 에러'),
    );
  }
};

export default inventorySortHandler;
