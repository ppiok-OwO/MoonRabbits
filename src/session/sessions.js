import PlayerSession from '../classes/session/playerSession.class.js';
import DungeonSession from '../classes/session/dungeonSession.class.js';
import PartySession from '../classes/session/partySession.class.js';

const playerSession = new PlayerSession();
const dungeonSession = new DungeonSession();
const partySession = new PartySession();

export const getPlayerSession = () => {
  return playerSession;
};

export const getDungeonSessions = () => {
  return dungeonSession;
};

export const getPartySessions = () => {
  return partySession;
};
