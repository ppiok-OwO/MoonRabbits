import net from 'net';
import { getProtoMessages, loadProtos } from './init/loadProtos.js';
import { config, packetIdEntries } from './config/config.js';
import Packet from './utils/packet/packet.js';
import printPacket from './utils/log/printPacket.js';

const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();
client.buffer = Buffer.alloc(0);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.connect(PORT, HOST, async () => {
  console.log('Connected to server');
  await loadProtos();

  // 캐릭터 입장
  const enterPacket = Packet.C_Enter('테스트클라', '1001');
  client.write(enterPacket);

  await delay(500);

  // 이동 테스트
  const movePacket = Packet.C_Move(
    -4.5963, // startPosX
    0.6657553, // startPosY
    136.5156, // startPosZ
    9.453333, // targetPosX
    0.7933332, // targetPosY
    119.18, // targetPosZ
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
    case 2: // S_Enter
      console.log('Enter response:', packetData);
      break;
    case 3: // S_Spawn
      console.log('Spawn event:', packetData);
      break;
    case 7: // S_Move
      console.log('Move response:', packetData);
      handleMoveResponse(packetData);
      break;
    case 13: // Chat 또는 에러 메시지
      console.log('Server message:', packetData.chatMsg);
      break;
    default:
      if (packetId !== 13) {
        // 13번 패킷은 일반적인 서버 메시지이므로 경고하지 않음
        console.warn('Unhandled packet ID:', packetId);
      }
      break;
  }
};

function handleMoveResponse(moveData) {
  if (moveData.path) {
    console.log('Path points:', moveData.path);
    // 경로 포인트에 대한 추가 처리
  }
}
