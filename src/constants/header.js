export const PACKET_SIZE = 4; // 전체 길이를 나타내는 4바이트
export const PACKET_ID_LENGTH = 1; // 패킷ID의 길이

export const PACKET_ID = {
  C2SRegister: 0,
  S2CRegister: 1,
  C2SLogin: 2,
  S2CLogin: 3,
  C2SCreateCharacter: 4,
  S2CCreateCharacter: 5,
  C2SEnterTown: 10,
  S2CEnterTown: 11,
  C2SMoveSector: 12,
  S2CMoveSector: 13,
  C2SEmote: 14,
  S2CEmote: 15,
  C2SChat: 20,
  S2CChat: 21,
  S2CSpawn: 22,
  S2CDespawn: 23,
  C2SPlayerMove: 30,
  S2CPlayerMove: 31,
  C2SPlayerLocation: 32,
  S2CPlayerLocation: 33,
  C2SPlayerRunning: 34,
  S2CPlayerRunning: 35,
  C2SPortal: 36,
  S2CPortal: 37,
  C2SRankingList: 50,
  S2CUpdateRanking: 51,
  C2SCollision: 60,
  S2CCollision: 61,
  C2SItemObtained: 80,
  C2SItemDisassembly: 81,
  C2SItemDestroy: 82,
  C2SInventorySort: 83,
  C2SItemMove: 84,
  S2CInventoryUpdate: 85,
  C2SCreateParty: 100,
  S2CCreateParty: 101,
  C2SInviteParty: 102,
  S2CInviteParty: 103,
  C2SJoinParty: 104,
  S2CJoinParty: 105,
  C2SLeaveParty: 106,
  S2CLeaveParty: 107,
  C2SCheckPartyList: 108,
  S2CCheckPartyList: 109,
  C2SKickOutMember: 110,
  S2CKickOutMember: 111,
  C2SDisbandParty: 112,
  S2CDisbandParty: 113,
  C2SAllowInvite: 114,
  S2CAllowInvite: 115,
  C2SRejectInvite: 116,
  S2CRejectInvite: 117,
  C2SMonsterLocation: 120,
  S2CMonsterLocation: 121,
  C2SDetectedPlayer: 122,
  S2CDetectedPlayer: 123,
  C2SMissingPlayer: 124,
  S2CMissingPlayer: 125,
  C2SResourcesList: 141,
  S2CResourcesList: 142,
  S2CUpdateDurability: 143,
  C2SGatheringStart: 144,
  S2CGatheringStart: 145,
  C2SGatheringSkillCheck: 146,
  S2CGatheringSkillCheck: 147,
  C2SGatheringDone: 148,
  S2CGatheringDone: 149,
  C2SGatheringAnimationEnd: 150,
  C2SRecall: 160,
  S2CRecall: 161,
  C2SThrowGrenade: 162,
  S2CThrowGrenade: 163,
  S2CTraps: 164,
  C2SSetTrap: 165,
  S2CSetTrap: 166,
  C2SRemoveTrap: 167,
  S2CRemoveTrap: 168,
  C2SStun: 169,
  S2CStun: 170,
  C2SEquipChange: 171,
  S2CEquipChange: 172,
  C2SAddExp: 200,
  S2CAddExp: 201,
  S2CLevelUp: 202,
  C2SInvestPoint: 203,
  S2CInvestPoint: 204,
  C2SGetInventorySlotByItemId: 209,
  S2CGetInventorySlotByItemId: 210,
  C2SCraftStart: 211,
  S2CCraftStart: 212,
  C2SCraftEnd: 213,
  S2CCraftEnd: 214,
  S2CPing: 254,
  C2SPong: 255,
};
