import { config, packetIdEntries } from '../config/config.js';
import { getHandlerByPacketId } from '../handlers/index.js';
import { getProtoMessages } from '../init/loadProtos.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import printPacket from '../utils/log/printPacket.js';
import { addBlacklist, addSuspect, isBlacklisted } from './blacklist.js';

export const onData = (socket) => {
  if (!socket.buffer) {
    console.log('socket.buffer is undefined of null');
    return;
  }

  socket.anomalyCounter = 0;
  socket.requestCounter = 0;

  setInterval(() => {
    socket.requestCounter = 0;
  }, 1000);

  return async (data) => {
    if (!data) {
      console.log('Data is undefined or null');
      return;
    }

    const clientIP = socket.remoteAddress;

    // 블랙리스트 IP인지 확인 후 차단
    if (await isBlacklisted(clientIP)) {
      console.log(`차단된 IP(${clientIP})의 접근 시도 감지 -> 연결 종료`);
      socket.destroy();
      return;
    }

    // 패킷 크기 검사
    if (data.length > config.blacklist.MAX_PACKET_SIZE) {
      console.log(
        `너무 큰 패킷 감지 (크기: ${data.length}, IP: ${clientIP}) -> 연결 종료`,
      );
      await addBlacklist(clientIP);
      socket.destroy();
      return;
    }

    // 초당 요청 제한
    socket.requestCounter++;
    if (socket.requestCounter > config.blacklist.MAX_REQUESTS_PER_SECOND) {
      console.log(
        `과도한 요청 감지 (요청 횟수 : ${socket.requestCounter}, IP: ${clientIP}) -> 용의자 리스트 추가`,
      );
      await addSuspect(socket.remoteAddress);
      socket.buffer = Buffer.alloc(0); // 버퍼 초기화
    }

    socket.buffer = Buffer.concat([socket.buffer, data]);

    const headerSize = config.packet.totalSize + config.packet.idLength;

    while (socket.buffer.length >= headerSize) {
      const packetSize = socket.buffer.readUInt32LE(0);

      if (
        !packetSize ||
        packetSize < headerSize ||
        packetSize > config.blacklist.MAX_PACKET_SIZE
      ) {
        console.log(
          `잘못된 패킷 크기: ${packetSize} (IP: ${socket.remoteAddress})`,
        );
        socket.buffer = Buffer.alloc(0); // 버퍼 초기화
        socket.anomalyCounter += 1;
        if (socket.anomalyCounter >= 5) {
          await addBlacklist(socket.remoteAddress);
          socket.destroy(); // 악의적인 패킷이므로 소켓 종료
        }
        return;
      }

      const packetId = socket.buffer.readUInt8(config.packet.totalSize);
      if (!packetIdEntries.some(([, id]) => id === packetId)) {
        console.log(
          `잘못된 패킷 ID: ${packetId} (IP: ${socket.remoteAddress})`,
        );
        socket.anomalyCounter += 1;
        socket.buffer = Buffer.alloc(0); // 버퍼 초기화
        if (socket.anomalyCounter >= 5) {
          console.log(`반복적인 잘못된 패킷 ID 감지 (IP: ${clientIP}) -> 차단`);
          await addBlacklist(clientIP);
          socket.destroy();
        }
        return;
      }

      if (socket.buffer.length >= packetSize) {
        const packetDataBuffer = socket.buffer.slice(headerSize, packetSize);
        socket.buffer = socket.buffer.slice(packetSize);

        // 패킷 아이디 -> 타입
        const packetType = packetIdEntries.find(([, id]) => id === packetId)[0];

        // 역직렬화
        const packetData = decodedPacket(socket, packetType, packetDataBuffer);
        // 이 부분에서 예외 처리(디도스 대비)
        if (!packetData) {
          console.log(
            `패킷 디코딩 실패 (ID: ${packetId}, IP: ${socket.remoteAddress})`,
          );
          socket.buffer = Buffer.alloc(0); // 버퍼 초기화
          socket.anomalyCounter += 1;
          if (socket.anomalyCounter >= 5) {
            await addBlacklist(socket.remoteAddress);
            socket.destroy(); // 악의적인 패킷이므로 소켓 종료
          }
          return;
        }

        // 디버그용 콘솔 출력, packetId 필터링해서 사용
        if (
          packetId !== config.packetId.C2SPong &&
          packetId !== config.packetId.C2SPlayerLocation &&
          packetId !== config.packetId.C2SCollision
        ) {
          printPacket(packetSize, packetId, packetData, 'in');
        }

        // 패킷타입별 핸들러 실행
        try {
          const handler = getHandlerByPacketId(packetId);
          handler(socket, packetData);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
};

const decodedPacket = (socket, packetType, packetDataBuffer) => {
  try {
    return getProtoMessages()[packetType].decode(packetDataBuffer);
  } catch (error) {
    console.log(`패킷 디코딩 실패 (IP: ${socket.remoteAddress})`);
    socket.buffer = Buffer.alloc(0); // 버퍼 초기화
    socket.anomalyCounter += 1;

    if (socket.anomalyCounter >= 5) {
      addBlacklist(socket.remoteAddress).then(() => {
        socket.destroy(); // 악의적인 패킷이므로 소켓 종료
      });
    }

    return null;
  }
};
