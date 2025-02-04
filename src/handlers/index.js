import { config } from '../config/config.js';
import makePacket from '../utils/packet/makePacket.js';

// 패킷 ID별로 핸들러 맵핑
const handlers = {
  0: (socket, packetData) => {
    let response = {
      playerId: 1,
      nickname: packetData.nickname,
      class: 1001,
      transform: { posX: 0, poxY: 0, posZ: 0, rot: 0 },
      statInfo: {
        level: 1,
        hp: 10,
        maxHp: 10,
        mp: 10,
        maxMp: 10,
        atk: 1,
        def: 1,
        magic: 1,
        speed: 1,
      },
    };
    socket.write(makePacket(config.packetId.S_Enter, response));
    console.log('응답 후 로그');
  },
  // 6: C_Move,
  // 8: C_Animation ,
  // 12: C_Chat,
  // 14: C_EnterDungeon,
  // 15: C_PlayerResponse,
};

export default handlers;
