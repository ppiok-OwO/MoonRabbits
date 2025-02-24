import chalk from 'chalk';
import CustomError from '../../../utils/error/customError.js';
import { ErrorCodes } from '../../../utils/error/errorCodes.js';
import redisClient from '../../../utils/redis/redis.config.js';

export const itemDestroyHandler = async (socket, packetdata) => {
  try {
    // 클라이언트가 전송한 slotIdx와 itemId 추출
    const { slotIdx, itemId } = packetdata;

    // playerId 가져오기
    const player_id = socket.player.playerId;

    console.log(`${player_id} 요청: 슬롯 ${slotIdx}의 아이템 파괴 (itemId ${itemId})`);

    // Redis에 저장된 인벤토리에서 해당 슬롯의 아이템 삭제
    const redisKey = `inventory:${player_id}`;
    await redisClient.hDel(redisKey, slotIdx.toString());
    console.log(`아이템 파괴 완료: 슬롯 ${slotIdx}의 itemId ${itemId} 삭제됨`);

    // 아이템 파괴 후, 필요하다면 인벤토리 업데이트 패킷(S2CInventoryUpdate)을 전송
  } catch (error) {
    console.error(chalk.red('[itemDestroy Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'itemDestroy 에러'));
  }
};

export default itemDestroyHandler;
