import PlayerSession from '../classes/session/playerSession.class.js';
import SectorSession from '../classes/session/sectorSession.class.js';
import UserSession from '../classes/session/userSession.class.js';
import PartySession from '../classes/session/partySession.class.js';

const playerSession = new PlayerSession();
const sectorSession = new SectorSession();
const userSession = new UserSession();
const partySession = new PartySession();

export const getPlayerSession = () => {
  return playerSession;
};

export const getSectorSessions = () => {
  return sectorSession;
};

export const getUserSessions = () => {
  return userSession;
};

export const getPartySessions = () => {
  return partySession;
};
