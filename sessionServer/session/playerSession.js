import { getPlayerSession } from './sessions.js';

export const addPlayer = (player) => {
  const playerSession = getPlayerSession();
  playerSession.set(player.socketId, player);
};

export const getPlayer = (socketId) => {
  const playerSession = getPlayerSession();
  return playerSession.get(socketId);
};

export const getPlayerByNickname = (nickname) => {
  const playerSession = getPlayerSession();

  for (const player of playerSession) {
    if (player.nickname === nickname) {
      return player;
    }
  }

  return null;
};
