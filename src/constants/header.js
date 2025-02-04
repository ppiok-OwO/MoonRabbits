export const PACKET_SIZE = 4; // 전체 길이를 나타내는 4바이트
export const PACKET_ID_LENGTH = 1; // 패킷ID의 길이

export const PACKET_ID = {
  C_Enter: 0,
  S_Enter: 1,
  S_Spawn: 2,
  S_Despawn: 5,
  C_Move: 6,
  S_Move: 7,
  C_Animation: 8,
  S_Animation: 9,
  C_Chat: 12,
  S_Chat: 13,
  C_EnterDungeon: 14,
  C_PlayerResponse: 15,
  S_EnterDungeon: 16,
  S_LeaveDungeon: 17,
  S_ScreenText: 18,
  S_ScreenDone: 19,
  S_BattleLog: 20,
  S_SetPlayerHp: 21,
  S_SetPlayerMp: 22,
  S_SetMonsterHp: 23,
  S_PlayerAction: 24,
  S_MonsterAction: 25,
  // 추가
};
