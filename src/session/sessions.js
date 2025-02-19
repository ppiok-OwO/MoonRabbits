import PlayerSession from '../classes/session/playerSession.class.js';
import DungeonSession from '../classes/session/dungeonSession.class.js';
import UserSession from '../classes/session/userSession.class.js';

import MonsterSession from '../classes/session/monsterSession.class.js';

import PartySession from '../classes/session/partySession.class.js';
const playerSession = new PlayerSession();
const dungeonSession = new DungeonSession();
const userSession = new UserSession();
const monsterSession = new MonsterSession();
const partySession = new PartySession();

monsterSession.initArea();
setInterval(async () => {
  await monsterSession.update();
}, 16); // 게임 프레임 간격으로 호출

export const getPlayerSession = () => {
  return playerSession;
};

export const getDungeonSessions = () => {
  return dungeonSession;
};

export const getUserSessions = () => {
  return userSession;
};

export const getMonsterSessions = () => {
  return monsterSession;
};

export const getPartySessions = () => {
  return partySession;
};
