import { config } from '../config/config.js';
import { getHandlerByPacketId } from '../handlers/index.js';
import { getProtoMessages } from '../init/loadProtos.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import printPacket from '../utils/log/printPacket.js';

export const onData = (socket) => async (data) => {
  if (!data) {
    console.log('Data is undefined or null');
    return;
  }

  try {
    socket.buffer = Buffer.concat([socket.buffer, data]);

    const packetSizeByte = 4; //config.header.sizeByte;
    const packetIdByte = 1; //config.header.idByte;
    const headerSize = packetSizeByte + packetIdByte;

    while (socket.buffer.length >= headerSize) {
      const packetSize = socket.buffer.readUInt32LE(0);
      const packetId = socket.buffer.readUInt8(packetSizeByte);

      if (socket.buffer.length >= packetSize) {
        const packetDataBuffer = socket.buffer.slice(headerSize, packetSize);
        socket.buffer = socket.buffer.slice(packetSize);

        // 패킷 아이디 -> 타입
        const packetIdValues = Object.values(config.packetId);
        const packetIdIndex = packetIdValues.findIndex((f) => f === packetId,);
        const packetType = Object.keys(config.packetId)[packetIdIndex];

        // 역직렬화 
        const proto = getProtoMessages()[packetType];
        const packetData = proto.decode(packetDataBuffer);

        // 디버그용 콘솔 출력, packetId 필터링해서 사용
        if (packetId >= 0) {
          printPacket(packetSize, packetId, packetData, 'in');
        }

        // 패킷타입별 핸들러 실행
        const handler = getHandlerByPacketId(packetId);
        handler(socket, packetData);
      }
    }
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, 'onData.js 패킷 디코딩 에러');
  }
};

// 패킷 규칙
// C_OOO : 클라이언트 → 서버 로 보내는 패킷
// S_OOO :  서버 → 클라이언트 로 보내는 패킷

// 패킷은 Protobuf 로 제작되며
// 앞에 4바이트는 패킷의 사이즈, 그 다음 1바이트는 패킷의 아이디가 담기며, 이 후 패킷데이터가 포함됩니다.
// [ PacketSize ] [ PacketId ] [ PacketData ]
//      4 bytes            1 bytes

// 클라이언트에서 서버로 보내는 경우 사이즈 정보 4bytes 에서 데이터가 리틀 엔디안 으로 전송합니다.
// [ 7 ] [ 0 ] [ 0 ] [ 0 ]   <- 사이즈가 7 인 경우 예시

// 서버에서 클라이언트로 보내는 경우 사이즈 정보 4bytes 에서 데이터를 빅 엔디안 으로 가정하고 파싱합니다.
// [ 0 ] [ 0 ] [ 0 ] [ 7 ]   <- 사이즈가 7 인 경우 예시

// 바이트 : 할당 사이즈

// gamePacket 메시지 사용시
// const proto = getProtoMessages().GamePacket;
// const gamePacket = proto.decode(payloadBuffer);
// const payload = gamePacket[gamePacket.payload];