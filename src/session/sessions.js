import PlayerSession from '../classes/session/userSession.class.js';
import DungeonSession from '../classes/session/dungeonSession.class.js';

const playerSession = new PlayerSession();
const dungeonSession = new DungeonSession();

export const getPlayerSession = () => {
  return playerSession;
};

export const getDungeonSessions = () => {
  return dungeonSession;
};
