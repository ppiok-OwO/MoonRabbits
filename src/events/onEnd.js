import chalk from 'chalk';
import { getPartySessions, getPlayerSession, getUserSessions } from '../session/sessions.js';
import { updateInventory } from '../db/user/user.db.js';
import RedisSession from '../classes/session/redisSession.class.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다. (END)');

  await updateInventory();
  console.log('인벤토리 DB 저장 완료');

  // 1. userSession에서 해당 소켓에 대한 사용자 세션 삭제
  const userSessionManager = getUserSessions();
  const user = userSessionManager.getUser(socket);
  if (userSessionManager.getUser(socket)) {
    userSessionManager.removeUser(socket);
    console.log(chalk.green(`[onEnd] userSession에서 삭제된 socket ID : ${socket.id}`));
    // Redis에 저장된 전체 세션(fullSession:{userId})도 삭제
    const redisSession = new RedisSession();
    await redisSession.removeFullSession(user.userId);
    console.log(chalk.green(`[onEnd] Redis에 저장된 fullSession:${user.userId} 삭제됨`));
  } else {
    console.log(chalk.yellow(`[onEnd] userSession에서 찾을 수 없습니다. : ${socket.id}`));
  }

  // 2. playerSession에서 해당 소켓에 대한 플레이어 세션 삭제
  const playerSessionManager = getPlayerSession();
  if (playerSessionManager.getPlayer(socket)) {
    playerSessionManager.removePlayer(socket);
    console.log(chalk.green(`[onEnd] playerSession에서 삭제된 socket ID: ${socket.id}`));
  } else {
    console.log(
      chalk.yellow(`[onEnd] playerSession에서 찾을 수 없습니다. socket ID : ${socket.id}`),
    );
  }
};
