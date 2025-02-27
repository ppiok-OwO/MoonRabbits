import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const itemObtainedHandler = async (socket, packetData) => {
  try {
    const { slotIdx, itemId } = packetData;

    const player_id = socket.player.playerId;

    const redisKey = `inventory:${player_id}`;
    await redisClient.hset(redisKey, slotIdx.toString(), JSON.stringify({ itemId }));

    console.log(`PlayerID ${player_id} 인벤토리 슬롯 ${slotIdx} 업데이트 : itemId ${itemId}`);
  } catch (error) {
    console.error(chalk.red('[itemObtainedHandler Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'itemObtainedhandler 에러'));
  }
};

export default itemObtainedHandler;
