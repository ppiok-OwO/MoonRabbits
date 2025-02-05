import { config } from "../config/config.js";
import makePacket from "../utils/packet/makePacket.js";
import payload from "../utils/packet/payload.js";
import payloadData from "../utils/packet/payloadData.js";

// 패킷 ID별로 핸들러 맵핑
const handlers = {
    0: (socket, packetData) => {
        let playerInfo = payloadData.PlayerInfo(123, packetData.nickname, 444, payloadData.TransformInfo(0,0,0,0), payloadData.StatInfo(1, 10, 10, 10, 10, 1, 1, 1, 1));
        let sEnterData = payload.S_Enter(playerInfo);
        socket.write(makePacket(config.packetId.S_Enter, sEnterData));
        
        let players = [];
        players.push(playerInfo);
        let sSpawnData = payload.S_Spawn(players);
        socket.write(makePacket(config.packetId.S_Spawn, sSpawnData));

        console.log('C_ENTER -> S_ENTER, S_SPAWN 테스트 패킷 전송 완료');
    },
    // 6: C_Move,
    // 8: C_Animation ,
    // 12: C_Chat,
    // 14: C_EnterDungeon,
    // 15: C_PlayerResponse,
}

export default handlers;
  