import { packetIdEntries } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import printPacket from '../log/printPacket.js';

// payload 내용물이 없는 패킷들을 위해 packetData 매개변수에 default value 설정해씀다
// 빈 객체로 하는 것이 Buffer 메서드랑 호환도 좋고 최대한 성능에 지연 없다고 합니당
// 임시 조치니 의도에 맞게 재수정해주세요!

function makePacket(packetId, packetData = {}) {
  // 패킷 아이디 -> 타입
  const packetType = packetIdEntries.find(([, id]) => id === packetId)[0];

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

  // 디버그용 콘솔 출력, packetId 필터링해서 사용
  if (packetId >= 0) {
    printPacket(packetSize, packetId, packetData, 'out');
  }

  // 패킷 만들기
  return Buffer.concat([packetSizeBuffer, packetIdBuffer, packetDataBuffer]);
}

export default makePacket;
