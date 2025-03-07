import chalk from 'chalk';
import { getPlayerSession, getUserSessions } from '../session/sessions.js';
import { updateInventory } from '../db/user/user.db.js';
import RedisSession from '../classes/session/redisSession.class.js';
import redisClient from '../utils/redis/redis.config.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다. (END)');

  const player_id = socket.player.playerId;
  const inventoryKey = `inventory:${player_id}`;
  const fullSessionKey = `fullSession:${player_id}`;

  await updateInventory(player_id);
  await redisClient.expire(inventoryKey, 1200);
  await redisClient.expire(fullSessionKey, 1200);
  console.log('인벤토리 DB 저장 완료');
  console.log('Inventory TTL 적용');

  const userSessionManager = getUserSessions();

  // 1. userSession에서 해당 소켓에 대한 사용자 세션 삭제
  const user = userSessionManager.getUser(socket);
  if (user) {
    userSessionManager.removeUser(socket);
    console.log(chalk.green(`[onEnd] userSession에서 삭제된 socket ID : ${socket.id}`));
    // Redis에 저장된 전체 세션(fullSession:{userId})도 삭제
    const redisSession = new RedisSession();
    await redisSession.removeFullSession(user.userId);
    console.log(chalk.green(`[onEnd] Redis에 저장된 fullSession:${user.userId} 삭제됨`));
  } else {
    console.log(chalk.yellow(`[onEnd] userSession에서 찾을 수 없습니다. : ${socket.id}`));
  }
};
