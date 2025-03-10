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
import {
  PACKET_ID,
  PACKET_ID_LENGTH,
  PACKET_SIZE,
} from '../constants/header.js';
import { BASE_STAT_DATA } from '../constants/PlayerBaseStat.js';
import { BATTLE_LOG_ID } from '../constants/BattleLog.js';
import { UPDATE_LOCATION } from '../constants/UpdateLocation.js';

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

    C2SEnterTown: PACKET_ID.C2SEnterTown,
    S2CEnterTown: PACKET_ID.S2CEnterTown,
    C2SMoveSector: PACKET_ID.C2SMoveSector,
    S2CMoveSector: PACKET_ID.S2CMoveSector,

    C2SEmote: PACKET_ID.C2SEmote,
    S2CEmote: PACKET_ID.S2CEmote,

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

    C2SPortal: PACKET_ID.C2SPortal,
    S2CPortal: PACKET_ID.S2CPortal,

    C2SRankingList: PACKET_ID.C2SRankingList,
    S2CUpdateRanking: PACKET_ID.S2CUpdateRanking,

    C2SCollision: PACKET_ID.C2SCollision,
    S2CCollision: PACKET_ID.S2CCollision,

    C2SItemObtained: PACKET_ID.C2SItemObtained,
    C2SItemDisassembly: PACKET_ID.C2SItemDisassembly,
    C2SItemDestroy: PACKET_ID.C2SItemDestroy,
    C2SInventorySort: PACKET_ID.C2SInventorySort,
    C2SItemMove: PACKET_ID.C2SItemMove,
    S2CInventoryUpdate: PACKET_ID.S2CInventoryUpdate,

    C2SHousingSave: PACKET_ID.C2SHousingSave,
    S2CHousingSave: PACKET_ID.S2CHousingSave,
    C2SHousingLoad: PACKET_ID.C2SHousingLoad,
    S2CHousingLoad: PACKET_ID.S2CHousingLoad,
    C2SFurnitureCraft: PACKET_ID.C2SFurnitureCraft,
    S2CFurnitureCraft: PACKET_ID.S2CFurnitureCraft,

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
    S2CUpdateParty: PACKET_ID.S2CUpdateParty,

    C2SMonsterLocation: PACKET_ID.C2SMonsterLocation,
    S2CMonsterLocation: PACKET_ID.S2CMonsterLocation,
    C2SDetectedPlayer: PACKET_ID.C2SDetectedPlayer,
    S2CDetectedPlayer: PACKET_ID.S2CDetectedPlayer,
    C2SMissingPlayer: PACKET_ID.C2SMissingPlayer,
    S2CMissingPlayer: PACKET_ID.S2CMissingPlayer,

    C2SResourcesList: PACKET_ID.C2SResourcesList,
    S2CResourcesList: PACKET_ID.S2CResourcesList,
    S2CUpdateDurability: PACKET_ID.S2CUpdateDurability,
    C2SGatheringStart: PACKET_ID.C2SGatheringStart,
    S2CGatheringStart: PACKET_ID.S2CGatheringStart,
    C2SGatheringSkillCheck: PACKET_ID.C2SGatheringSkillCheck,
    S2CGatheringSkillCheck: PACKET_ID.S2CGatheringSkillCheck,
    C2SGatheringDone: PACKET_ID.C2SGatheringDone,
    S2CGatheringDone: PACKET_ID.S2CGatheringDone,

    C2SOpenChest: PACKET_ID.C2SOpenChest,
    S2COpenChest: PACKET_ID.S2COpenChest,
    C2SGetTreasure: PACKET_ID.C2SGetTreasure,
    S2CRegenChest: PACKET_ID.S2CRegenChest,
    C2SGatheringAnimationEnd: PACKET_ID.C2SGatheringAnimationEnd,
    C2SRecall: PACKET_ID.C2SRecall,
    S2CRecall: PACKET_ID.S2CRecall,
    C2SThrowGrenade: PACKET_ID.C2SThrowGrenade,
    S2CThrowGrenade: PACKET_ID.S2CThrowGrenade,
    S2CTraps: PACKET_ID.S2CTraps,
    C2SSetTrap: PACKET_ID.C2SSetTrap,
    S2CSetTrap: PACKET_ID.S2CSetTrap,
    C2SRemoveTrap: PACKET_ID.C2SRemoveTrap,
    S2CRemoveTrap: PACKET_ID.S2CRemoveTrap,
    C2SStun: PACKET_ID.C2SStun,
    S2CStun: PACKET_ID.S2CStun,
    C2SEquipChange: PACKET_ID.C2SEquipChange,
    S2CEquipChange: PACKET_ID.S2CEquipChange,

    C2SAddExp: PACKET_ID.C2SAddExp,
    S2CAddExp: PACKET_ID.S2CAddExp,
    S2CLevelUp: PACKET_ID.S2CLevelUp,
    C2SInvestPoint: PACKET_ID.C2SInvestPoint,
    S2CInvestPoint: PACKET_ID.S2CInvestPoint,

    C2SGetInventorySlotByItemId: PACKET_ID.C2SGetInventorySlotByItemId,
    S2CGetInventorySlotByItemId: PACKET_ID.S2CGetInventorySlotByItemId,
    C2SCraftStart: PACKET_ID.C2SCraftStart,
    S2CCraftStart: PACKET_ID.S2CCraftStart,
    C2SCraftEnd: PACKET_ID.C2SCraftEnd,
    S2CCraftEnd: PACKET_ID.S2CCraftEnd,
    S2CPing: PACKET_ID.S2CPing,
    C2SPong: PACKET_ID.C2SPong,
  },
  newPlayerStatData: {
    BASE_STAT_DATA,
    hp: 3,
  },
  battletag: {
    Menu: BATTLE_LOG_ID.menu,
    Attack: BATTLE_LOG_ID.attack,
  },
  updateLocation: {
    tolerance: UPDATE_LOCATION.tolerance,
  },
  party: {
    MaxMember: 5,
  },
  sector: {
    town: 100,
    testfield: 2,
    S1: 101,
    S2: 102,
    S3: 103,
  },
  animCode: {
    happy: 111,
    sad: 222,
    greeting: 333,
  },
  blacklist: {
    MAX_REQUESTS_PER_SECOND: 70,
    MAX_PACKET_SIZE: 1024,
  },
};

export const packetIdEntries = Object.entries(config.packetId);
