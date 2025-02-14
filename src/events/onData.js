import { config, packetIdEntries } from '../config/config.js';
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
  if (!socket.buffer) {
    console.log('socket.buffer is undefined of null');
    return;
  }

  socket.buffer = Buffer.concat([socket.buffer, data]);

  const headerSize = config.packet.totalSize + config.packet.idLength;

  while (socket.buffer.length >= headerSize) {
    const packetSize = socket.buffer.readUInt32LE(0);
    if (!packetSize)
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.MISSING_FIELDS,
          'packetSize is missing in header',
        ),
      );
    const packetId = socket.buffer.readUInt8(config.packet.totalSize);
    if (packetId === null || packetId === undefined)
      socket.emit(
        'error',
        new CustomError(
          ErrorCodes.MISSING_FIELDS,
          'packetId is missing in header',
        ),
      );

    if (socket.buffer.length >= packetSize) {
      const packetDataBuffer = socket.buffer.slice(headerSize, packetSize);
      socket.buffer = socket.buffer.slice(packetSize);

      // 패킷 아이디 -> 타입
      const packetType = packetIdEntries.find(([, id]) => id === packetId)[0];

      // 역직렬화
      const packetData = decodedPacket(packetType, packetDataBuffer);

      // 디버그용 콘솔 출력, packetId 필터링해서 사용
      if (packetId >= 0) {
        printPacket(packetSize, packetId, packetData, 'in');
      }

      // 패킷타입별 핸들러 실행
      try {
        const handler = getHandlerByPacketId(packetId);
        handler(socket, packetData);
      } catch (error) {
        socket.emit(
          'error',
          new CustomError(
            error.code ? error.code : ErrorCodes.HANDLER_ERROR,
            error,
          ),
        );
      }
    }
  }
};

const decodedPacket = (packetType, packetDataBuffer) => {
  try {
    return getProtoMessages()[packetType].decode(packetDataBuffer);
  } catch (error) {
    socket.emit(
      'error',
      new CustomError(
        ErrorCodes.PACKET_DECODE_ERROR,
        'onData 패킷 디코딩 에러',
      ),
    );
  }
};
