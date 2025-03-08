import { getPlayerSession } from './sessions.js';

addPlayer = (player) => {
  const playerSession = getPlayerSession();
  playerSession.set(player.socketId, player);
};

getPlayerByNickname = (nickname) => {
  const playerSession = getPlayerSession();

  for (const player of playerSession) {
    if (player.nickname === nickname) {
      return player;
    }
  }

  return null;
};
