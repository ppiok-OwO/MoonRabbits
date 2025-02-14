import net from 'net';
import { getProtoMessages } from '../init/loadProtos.js';
import { config, packetIdEntries } from '../config/config.js';
import printPacket from '../utils/log/printPacket.js';
import cPacket from './c_packet.js';
import payloadData from '../utils/packet/payloadData.js';

const HOST = '127.0.0.1';
const PORT = '3000';

export class Client {
  constructor() {
    this.socket = new net.Socket();
    this.isConnected = true;

    this.socket.connect(PORT, HOST, () => {
      console.log(
        `Connected to server on ${this.socket.remoteAddress}:${this.socket.remotePort}`,
      );
      this.socket.buffer = Buffer.alloc(0);
    });
    this.socket.on('data', this.onData.bind(this));
    this.socket.on('end', this.onEnd.bind(this));
    this.socket.on('error', this.onError.bind(this));

    this.id = null;
    this.nickname = null;
    this.class = null;
    this.transform = {};
    this.statInfo = {};
    this.players = [];
  }

  // 게임 로직
  async register() {
    return;
  }

  async login(id, password) {
    return;
    this.id = id;
    this.password = password;
  }

  async enter(nickname = 'test', _class = 1001) {
    this.sendPacket(config.packetId.C_Enter, cPacket.C_Enter(nickname, _class));
  }

  async move() {
    this.transform.posX += Math.random() * 2 - 1;
    this.transform.posZ += Math.random() * 2 - 1;
    this.sendPacket(config.packetId.C_Move, cPacket.C_Move(this.transform));
  }

  async chat(chatMsg) {
    this.sendPacket(
      config.packetId.C_Chat,
      cPacket.C_Chat(this.id, this.nickname, chatMsg),
    );
  }

  // 핸들러
  async S_EnterHandler(data) {
    this.id = data.player.playerId;
    this.nickname = data.player.nickname;
    this.class = data.player.class;
    this.transform = data.player.transform;
    this.statInfo = data.player.statInfo;
    // Player 소환
  }
  async S_SpawnHandler(data) {
    this.players = data.players;
    // Other Players 소환
  }
  async S_MoveHandler(data) {
    // playerId 찾아서 이동
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === data.playerId) {
        this.players[i].transform = data.transform;
      }
    }
  }
  async S_ChatHandler(data) {
    console.log(`[채팅] ${data.chatMsg}`);
  }

  sendPacket(packetId, packetData) {
    // 패킷 아이디 -> 타입
    const packetType = packetIdEntries.find(([, id]) => id === packetId)[0];

    // 페이로드
    const packetDataBuffer = getProtoMessages()
      [packetType].encode(packetData)
      .finish();

    // 패킷 크기
    const packetSize =
      config.packet.totalSize +
      config.packet.idLength +
      packetDataBuffer.length;

    // 버퍼 쓰기 - 패킷 크기
    const packetSizeBuffer = Buffer.alloc(4);
    packetSizeBuffer.writeUInt32LE(packetSize, 0);

    // 버퍼 쓰기 - 패킷 아이디
    const packetIdBuffer = Buffer.alloc(1);
    packetIdBuffer.writeUInt8(packetId, 0);

    printPacket(packetSize, packetId, packetData, 'out');

    // 패킷 전송
    this.socket.write(
      Buffer.concat([packetSizeBuffer, packetIdBuffer, packetDataBuffer]),
    );
  }

  // EVENT
  async onData(data) {
    try {
      this.socket.buffer = Buffer.concat([this.socket.buffer, data]);
      const headerSize = config.packet.totalSize + config.packet.idLength;

      while (this.socket.buffer.length >= headerSize) {
        const packetSize = this.socket.buffer.readUInt32LE(0);

        if (this.socket.buffer.length >= packetSize) {
          const packetId = this.socket.buffer.readUInt8(
            config.packet.totalSize,
          );
          const packetType = packetIdEntries.find(
            ([, id]) => id === packetId,
          )[0];
          const packetDataBuffer = this.socket.buffer.slice(headerSize, packetSize);
          this.socket.buffer = this.socket.buffer.slice(packetSize);

          const packetData =
            getProtoMessages()[packetType].decode(packetDataBuffer);

          printPacket(packetSize, packetId, packetData, 'in');

          switch (packetId) {
            case config.packetId.S_Enter:
              this.S_EnterHandler(packetData);
              break;
            case config.packetId.S_Spawn:
              this.S_SpawnHandler(packetData);
            default:
              break;
          }
        }
      }
    } catch (error) {
      console.log('패킷 수신 오류');
      console.error(error);
    }
  }

  async onEnd() {
    this.isConnected = false;
    console.log(`${this.id ? this.id : ''} Connection closed`);
  }

  async onError(err) {
    this.isConnected = false;
    console.error(`${this.id ? this.id : ''} Client error:${err}`);
  }
}
