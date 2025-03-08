import { getPlayerSession } from './sessions.js';

addPlayer = (player) => {
  const playerSession = getPlayerSession();
  playerSession.set(player.nickname, player);
};

getPlayerBySocketId = (socketId) => {
  const playerSession = getPlayerSession();

  for (const player of partySession) {
    if (player.socketId === socketId) {
      return player;
    }
  }

  return null;
};
