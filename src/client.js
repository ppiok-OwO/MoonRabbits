import net from 'net';
import { getProtoMessages, loadProtos } from './init/loadProtos.js';
import { config, packetIdEntries } from './config/config.js';
import Packet from './utils/packet/packet.js';
import CustomError from './utils/error/customError.js';
import { ErrorCodes } from './utils/error/errorCodes.js';
import printPacket from './utils/log/printPacket.js';

const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();
client.buffer = Buffer.alloc(0);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.connect(PORT, HOST, async () => {
  console.log('Connected to server');
  await loadProtos();

  const enterPacket = Packet.C_Enter('테스트클라', '1001');
  client.write(enterPacket);

  await delay(500);

  // Vector3 형식으로 시작 위치와 목표 위치 전달
  const movePacket = Packet.C_Move(
    { x: -4.5963, y: 0.6657553, z: 136.5156 }, // startPos
    { x: 9.453333, y: 0.7933332, z: 119.18 }, // targetPos
  );
  client.write(movePacket);
});

client.on('data', (data) => {
  if (!data) {
    console.log('Data is undefined or null');
    return;
  }

  client.buffer = Buffer.concat([client.buffer, data]);
  const headerSize = config.packet.totalSize + config.packet.idLength;

  while (client.buffer.length >= headerSize) {
    const packetSize = client.buffer.readUInt32LE(0);
    const packetId = client.buffer.readUInt8(config.packet.totalSize);

    if (client.buffer.length >= packetSize) {
      const packetDataBuffer = client.buffer.slice(headerSize, packetSize);
      client.buffer = client.buffer.slice(packetSize);

      const packetType = packetIdEntries.find(([, id]) => id === packetId)?.[0];
      if (!packetType) {
        console.error('Unknown packet ID:', packetId);
        return;
      }

      const packetData = decodedPacket(packetType, packetDataBuffer);
      if (packetId >= 0) {
        printPacket(packetSize, packetId, packetData, 'in');
      }
      handlePacket(packetId, packetData);
    } else {
      break;
    }
  }
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});

const decodedPacket = (packetType, packetDataBuffer) => {
  try {
    return getProtoMessages()[packetType].decode(packetDataBuffer);
  } catch (error) {
    console.error('Packet decode error:', error);
    return null;
  }
};

const handlePacket = (packetId, packetData) => {
  switch (packetId) {
    case config.packetIds.S_Enter: // 2
      console.log('Login response:', packetData);
      break;
    case config.packetIds.S_Spawn: // 3
      console.log('Spawn event:', packetData);
      break;
    case config.packetIds.S_Move: // 7
      console.log('Move response:', packetData);
      break;
    case config.packetIds.S_PathResult: // 11
      console.log('Path result:', packetData);
      // 경로 데이터 시각화나 처리
      if (packetData.path) {
        console.log('Calculated path points:', packetData.path);
      }
      break;
    default:
      console.warn('Unhandled packet ID:', packetId);
      break;
  }
};
