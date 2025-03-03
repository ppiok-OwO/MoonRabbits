import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const makePingPacket = (timestamp) => {
  const packetId = config.packetId.S2CPing;

  // 페이로드
  const proto = getProtoMessages().S2CPing;
  const packetDataBuffer = proto.encode({ timestamp }).finish();

  // 패킷 크기
  const packetSize = 5 + packetDataBuffer.length;

  // 헤더 쓰기 - 패킷 크기
  const packetSizeBuffer = Buffer.alloc(4);
  packetSizeBuffer.writeUint32LE(packetSize, 0);

  // 헤더 쓰기 - 패킷 아이디
  const packetIdBuffer = Buffer.alloc(1);
  packetIdBuffer.writeUInt8(packetId, 0);

  // 패킷 만들기
  return Buffer.concat([packetSizeBuffer, packetIdBuffer, packetDataBuffer]);
};
