import chalk from 'chalk';
import { getPlayerSession, getUserSessions } from '../session/sessions.js';
import { updateInventory } from '../db/user/user.db.js';
import RedisSession from '../classes/session/redisSession.class.js';
import redisClient from '../utils/redis/redis.config.js';

export const onEnd = (socket) => async () => {
  try {
    console.log('클라이언트 연결이 종료되었습니다. (END)');

    // socket에 player 데이터가 존재할 경우
    if (socket.player && socket.player.playerId !== undefined) {
      const player_id = socket.player.playerId;
      const inventoryKey = `inventory:${player_id}`;
      // const fullSessionKey = `fullSession:${player_id}`;

      const player = getPlayerSession().getPlayer(socket);

      if (player && player.isCrafting) {
        console.error('\x1b[31m제작중 종료 발생, 소모한 재료 복구 실행\x1b[0m');
        // redis 인벤토리 가져옴
        const redisKey = `inventory:${player_id}`;
        const redisInventory = await redisClient.hgetall(redisKey);

        // 소모한 재료 복구
        try {
          for (const slot of player.craftingSlots) {
            const stack = JSON.parse(redisInventory[slot.slotIdx]).stack + slot.stack;
            redisClient.hset(
              redisKey,
              slot.slotIdx.toString(),
              JSON.stringify({ itemId: slot.itemId, stack }),
            );
          }
          console.log('복구 완료');
        } catch (error) {
          console.error('복구중 에러 :', error);
        }
      } else {
      }

      await updateInventory(player_id);
      await redisClient.expire(inventoryKey, 1200);

      console.log('인벤토리 DB 저장 완료');
      console.log('Inventory TTL 적용');

      await deleteUserSession(socket);
    } else {
      await deleteUserSession(socket);
    }
  } catch (error) {
    console.error(error);
  }
};

async function deleteUserSession(socket) {
  const userSessionManager = getUserSessions();
  const user = userSessionManager.getUser(socket);
  if (user) {
    //있을때만 적용
    if(user.userId){
      // Redis에 저장된 전체 세션(fullSession:{userId})도 삭제
      const redisSession = new RedisSession();
      await redisSession.removeFullSession(socket.user.userId);
      console.log(chalk.green(`[onEnd] Redis에 저장된 fullSession:${user.userId} 삭제됨`));
    }
    userSessionManager.removeUser(socket);
    console.log(chalk.green(`[onEnd] userSession에서 삭제된 socket ID : ${socket.id}`));
  } else {
    console.log(chalk.yellow(`[onEnd] userSession에서 찾을 수 없습니다. : ${socket.id}`));
  }
}

export default onEnd;
