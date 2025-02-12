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

  const movePacket = Packet.C_Move(
    9.666666030883789,
    0.6866678595542908,
    139.01998901367188,
    6.039999961853027,
    -0.5933334231376648,
    150.5399932861328
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
    case 1:
      console.log('Handle packet 1:', packetData);
      break;
    case 2:
      console.log('Handle packet 2:', packetData);
      break;
    case 3:
      console.log('Handle packet 3:', packetData);
      break;
    case 6:
      console.log('Handle packet 6:', packetData);
      break;
    case 7:
      console.log('Handle packet 7:', packetData);
      break;
    default:
      console.warn('Unhandled packet ID:', packetId);
      break;
  }
};
