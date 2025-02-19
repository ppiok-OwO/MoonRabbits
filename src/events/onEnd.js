import chalk from 'chalk';
import { getPlayerSession, getUserSessions } from '../session/sessions.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다. (END)');

  // 1. userSession에서 해당 소켓에 대한 사용자 세션 삭제
  const userSessionManager = getUserSessions();
  if (userSessionManager.getUser(socket)) {
    userSessionManager.removeUser(socket);
    console.log(chalk.green(`[onEnd] userSession에서 삭제된 socket ID : ${socket.id}`));
    // } else {
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
