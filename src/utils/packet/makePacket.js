import { config } from "../../config/config.js";
import { getProtoMessages } from "../../init/loadProtos.js";
import printPacket from "../log/printPacket.js";

function makePacket(packetId, packetData) {   
    // 패킷 아이디 -> 타입
    const packetIdValues = Object.values(config.packetId);
    const packetIdIndex = packetIdValues.findIndex((f) => f === packetId,);
    const packetType = Object.keys(config.packetId)[packetIdIndex];

    // 페이로드
    const proto = getProtoMessages()[packetType];
    const packetDataBuffer = proto.encode(packetData).finish();

  // 패킷 크기
  const packetSize = 5 + packetDataBuffer.length;

  // 헤더 쓰기 - 패킷 크기
  const packetSizeBuffer = Buffer.alloc(4);
  packetSizeBuffer.writeUint32LE(packetSize, 0);

  // 헤더 쓰기 - 패킷 아이디
  const packetIdBuffer = Buffer.alloc(1);
  packetIdBuffer.writeUInt8(packetId, 0);

    // 헤더 만들기
    const headerBuffer = Buffer.concat([
      packetSizeBuffer,
      packetIdBuffer,
    ]);
 
    // 디버그용 콘솔 출력, packetId 필터링해서 사용
    if (packetId >= 0) {
      printPacket(packetSize, packetId, packetData, 'out');
    }

  // 패킷 만들기
  const packetBuffer = Buffer.concat([headerBuffer, packetDataBuffer]);

  return packetBuffer;
}

export default makePacket;