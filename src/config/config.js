import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
  REDIS_HOST,
  REDIS_PORT,
} from '../constants/env.js';
import { PACKET_ID, PACKET_ID_LENGTH, PACKET_SIZE } from '../constants/header.js';
import { BASE_STAT_DATA } from '../constants/PlayerBaseStat.js';
import { BATTLE_LOG_ID } from '../constants/BattleLog.js';
import { UPDATE_LOCATION } from '../constants/UpdateLocation.js';
import SCENE_CODE from '../constants/scene.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalSize: PACKET_SIZE,
    idLength: PACKET_ID_LENGTH,
  },
  databases: {
    PROJECT_R_USER_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  packetId: {
    C2SRegister: PACKET_ID.C2SRegister,
    S2CRegister: PACKET_ID.S2CRegister,
    C2SLogin: PACKET_ID.C2SLogin,
    S2CLogin: PACKET_ID.S2CLogin,
    C2SCreateCharacter: PACKET_ID.C2SCreateCharacter,
    S2CCreateCharacter: PACKET_ID.S2CCreateCharacter,
    C2SEnter: PACKET_ID.C2SEnter,
    S2CEnter: PACKET_ID.S2CEnter,
    C2SLeave: PACKET_ID.C2SLeave,
    S2CLeave: PACKET_ID.S2CLeave,
    C2SAnimation: PACKET_ID.C2SAnimation,
    S2CAnimation: PACKET_ID.S2CAnimation,
    C2SChat: PACKET_ID.C2SChat,
    S2CChat: PACKET_ID.S2CChat,
    S2CSpawn: PACKET_ID.S2CSpawn,
    S2CDespawn: PACKET_ID.S2CDespawn,
    C2SPlayerMove: PACKET_ID.C2SPlayerMove,
    S2CPlayerMove: PACKET_ID.S2CPlayerMove,
    C2SPlayerLocation: PACKET_ID.C2SPlayerLocation,
    S2CPlayerLocation: PACKET_ID.S2CPlayerLocation,
    C2SPlayerRunning: PACKET_ID.C2SPlayerRunning,
    S2CPlayerRunning: PACKET_ID.S2CPlayerRunning,
    C2SRankingList: PACKET_ID.C2SRankingList,
    S2CUpdateRanking: PACKET_ID.S2CUpdateRanking,
    C2SCollision: PACKET_ID.C2SCollision,
    S2CCollision: PACKET_ID.S2CCollision,
    C2SMonsterCollision: PACKET_ID.C2SMonsterCollision,
    S2CMonsterCollision: PACKET_ID.S2CMonsterCollision,
    C2SSelectStore: PACKET_ID.C2SSelectStore,
    S2CSelectStore: PACKET_ID.S2CSelectStore,
    C2SBuyItem: PACKET_ID.C2SBuyItem,
    S2CBuyItem: PACKET_ID.S2CBuyItem,
    C2SSellItem: PACKET_ID.C2SSellItem,
    C2SCreateParty: PACKET_ID.C2SCreateParty,
    S2CCreateParty: PACKET_ID.S2CCreateParty,
    C2SInviteParty: PACKET_ID.C2SInviteParty,
    S2CInviteParty: PACKET_ID.S2CInviteParty,
    C2SJoinParty: PACKET_ID.C2SJoinParty,
    S2CJoinParty: PACKET_ID.S2CJoinParty,
    C2SLeaveParty: PACKET_ID.C2SLeaveParty,
    S2CLeaveParty: PACKET_ID.S2CLeaveParty,
    C2SCheckPartyList: PACKET_ID.C2SCheckPartyList,
    S2CCheckPartyList: PACKET_ID.S2CCheckPartyList,
    C2SKickOutMember: PACKET_ID.C2SKickOutMember,
    S2CKickOutMember: PACKET_ID.S2CKickOutMember,
    C2SDisbandParty: PACKET_ID.C2SDisbandParty,
    S2CDisbandParty: PACKET_ID.S2CDisbandParty,
    C2SAllowInvite: PACKET_ID.C2SAllowInvite,
    S2CAllowInvite: PACKET_ID.S2CAllowInvite,
    C2SRejectInvite: PACKET_ID.C2SRejectInvite,
    S2CRejectInvite: PACKET_ID.S2CRejectInvite,
    C2SMonsterLocation: PACKET_ID.C2SMonsterLocation,
    S2CMonsterLocation: PACKET_ID.S2CMonsterLocation,
    C2SDetectedPlayer: PACKET_ID.C2SDetectedPlayer,
    S2CDetectedPlayer: PACKET_ID.S2CDetectedPlayer,
    C2SMissingPlayer: PACKET_ID.C2SMissingPlayer,
    S2CMissingPlayer: PACKET_ID.S2CMissingPlayer,
    S2CResourcesList: PACKET_ID.S2CResourcesList,
    S2CUpdateDurability: PACKET_ID.S2CUpdateDurability,
    C2SGatheringStart: PACKET_ID.C2SGatheringStart,
    S2CGatheringStart: PACKET_ID.S2CGatheringStart,
    C2SGatheringSkillCheck: PACKET_ID.C2SGatheringSkillCheck,
    S2CGatheringSkillCheck: PACKET_ID.S2CGatheringSkillCheck,
    S2CGatheringDone: PACKET_ID.S2CGatheringDone,
    C2SSectorEnter: PACKET_ID.C2SSectorEnter,
    S2CSectorEnter: PACKET_ID.S2CSectorEnter,
    C2SSectorLeave: PACKET_ID.C2SSectorLeave,
    S2CSectorLeave: PACKET_ID.S2CSectorLeave,
    C2SInPortal: PACKET_ID.C2SInPortal,
    S2CInPortal: PACKET_ID.S2CInPortal,
    C2SAddExp: PACKET_ID.C2SAddExp,
    S2CAddExp: PACKET_ID.S2CAddExp,
    S2CLevelUp: PACKET_ID.S2CLevelUp,
    C2SInvestPoint: PACKET_ID.C2SInvestPoint,
    S2CInvestPoint: PACKET_ID.S2CInvestPoint,
    S2CInventoryUpdate: PACKET_ID.S2CInventoryUpdate,
  },
  newPlayerStatData: {
    BASE_STAT_DATA,
  },
  battletag: {
    Menu: BATTLE_LOG_ID.menu,
    Attack: BATTLE_LOG_ID.attack,
  },
  updateLocation: {
    tolerance: UPDATE_LOCATION.tolerance,
  },
  sceneCode: {
    town: SCENE_CODE.TOWN,
    aSector: SCENE_CODE.A_SECTOR,
  },
  party: {
    MaxMember: 5,
  },
  sector: {
    town: 1,
    testfield: 2,
  },
};

export const packetIdEntries = Object.entries(config.packetId);
