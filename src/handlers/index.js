import townEnterHandler from './town/townEnter.handler.js';

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  0: townEnterHandler,
  // 6: C_Move,
  // 8: C_Animation ,
  // 12: C_Chat,
  // 14: C_EnterDungeon,
  // 15: C_PlayerResponse,
};

export default handlers;
