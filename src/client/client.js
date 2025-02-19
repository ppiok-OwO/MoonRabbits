import net from 'net';
import { getProtoMessages } from '../init/loadProtos.js';
import { config, packetIdEntries } from '../config/config.js';
import printPacket from '../utils/log/printPacket.js';
import cPacket from './c_packet.js';
import payloadData from '../utils/packet/payloadData.js';
import bcrypt from 'bcrypt';

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

    this.email = null;
    this.accountId = null;
    this.id = null;
    this.nickname = null;
    this.class = null;
    this.transform = {};
    this.statInfo = {};
    this.players = [];
  }

  // #C2S Request 요청 패킷
  async register(email, pw, pwCheck) {
    this.sendPacket(
      config.packetId.C2SRegister,
      cPacket.C2SRegister(email, pw, pwCheck),
    );
    return;
  }

  async login(email, pw) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pw, salt);
    this.sendPacket(config.packetId.C2SLogin, cPacket.C2SLogin(email, pw));
    return;
  }

  async createCharacter(nickname, classCode) {
    this.sendPacket(
      config.packetId.C2SCreateCharacter,
      cPacket.C2SCreateCharacter(this.nickname, this.class),
    );
  }

  async enter(nickname = 'test', _class = 1001) {
    this.sendPacket(
      config.packetId.C2STownEnter,
      cPacket.C2STownEnter(nickname, _class),
    );
  }

  async move() {
    this.transform.posX += Math.random() * 2 - 1;
    this.transform.posZ += Math.random() * 2 - 1;
    this.sendPacket(config.packetId.C_Move, cPacket.C_Move(this.transform));
  }

  async chat(chatMsg) {
    this.sendPacket(
      config.packetId.C2SChat,
      cPacket.C_Chat(this.id, this.nickname, chatMsg),
    );
  }

  async addExp(count) {
    console.log(`클라이언트 경험치 획득`);
    this.sendPacket(config.packetId.C2SAddExp, cPacket.C2SAddExp(count));
  }

  async selectAP() {
    const investPoints = [];
    investPoints.push(payloadData.InvestPoint(1, 3));
    investPoints.push(payloadData.InvestPoint(2, 2));
    investPoints.forEach(({ statCode, point }) =>
      console.log(`C2S 능력치(${statCode}) ${point}만큼 증가`),
    );
    this.sendPacket(config.packetId.C2SSelectAP, cPacket.C2SSelectAP(investPoints));
  }

  // 핸들러
  handler = {
    S2CRegister: async (data) => {
      console.log(data.msg);
    },
    S2CLogin: async (data) => {
      const { isSuccess, msg, ownedCharacters } = data;
      console.log(`${msg}`);
    },
    S2CChat: async (data) => {
      const { playerId, chatMsg } = data;
      console.log(`${chatMsg}`);
    },
    S2CTownEnter: async (data) => {
      const { player } = data;
      this.id = player.playerId;
      this.nickname = player.nickname;
      this.class = player.classCode;
      this.transform = player.transform;
      this.statInfo = player.statInfo;
    },
    S2CTownLeave: async (data) => {
      console.log(`${this.nickname} 마을 나감`);
    },
    S2CAnimation: async (data) => {
      const { playerId, animCode } = data;
      console.log(`플레이어${playerId} 애니메이션 시전 ${animCode}`);
    },
    S2CPlayerSpawn: async (data) => {
      const { players } = data;
      this.players = players;
    },
    S2CPlayerDespawn: async (data) => {
      const { playerIds } = data;
      this.players.filter((player) => !playerIds.includes(player.id));
    },
    S2CPlayerMove: async (data) => {
      //?
    },
    S2CPlayerLocation: async (data) => {
      const { playerId, transform, isValidTransform } = data;
      console.log(`${isValidTransform ? '위치 응답' : '위치이상 응답'}`);
    },
    S2CPlayerCollision: async (data) => {
      const { playerId, collisionPushInfo } = data;
      console.log(`플레이어${playerId} 충돌 응답`);
    },
    S2CMonsterCollision: async (data) => {
      const { monsterId, collisionPushInfo } = data;
      console.log(`몬스터${monsterId} 충돌 응답`);
    },
    S2CCreateParty: async (data) => {
      const { partyId, leaderId, memberCount, members } = data;
      console.log(`파티 생성 응답`);
    },
    S2CInviteParty: async (data) => {
      const { partyId, leaderId, memberCount, members } = data;
      console.log(`파티 초대 응답`);
    },
    S2CJoinParty: async (data) => {
      const { partyId, leaderId, memberCount, members } = data;
      console.log(`파티 참가 응답`);
    },
    S2CLeaveParty: async (data) => {
      const { partyId, leaderId, memberCount, members } = data;
      console.log(`파티 탈퇴 응답`);
    },
    S2CSetPartyLeader: async (data) => {
      const { partyId, leaderId, memberCount, members } = data;
      console.log(`파티장 위임 응답`);
    },
    S2CBuff: async (data) => {
      const { partyId, players } = data;
      console.log(`버프 응답`);
    },
    S2CAddExp: async (data) => {
      const { updatedExp } = data;
      console.log(`경험치가 ${updatedExp}로 증가`);
    },
    S2CLevelUp: async (data) => {
      const { playerId, updatedLevel, newTargetExp } = data;
      console.log(
        `레벨이 ${updatedLevel}레벨로 올랐습니다. 다음 레벨까지 필요한 경험치 : ${newTargetExp}`,
      );
    },
    S2CSelectAP: async (data) => {
      const { statInfo } = data;
      console.log(`레벨업 능력치 선택 응답`);
    },
  };

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
          const packetDataBuffer = this.socket.buffer.slice(
            headerSize,
            packetSize,
          );
          this.socket.buffer = this.socket.buffer.slice(packetSize);

          const packetData =
            getProtoMessages()[packetType].decode(packetDataBuffer);

          printPacket(packetSize, packetId, packetData, 'in');

          switch (packetId) {
            case config.packetId.S2CRegister:
              this.handler.S2CRegister(packetData);
              break;
            case config.packetId.S2CLogin:
              this.handler.S2CLogin(packetData);
              break;
            case config.packetId.S2CChat:
              this.handler.S2CChat(packetData);
              break;
            case config.packetId.S2CTownEnter:
              this.handler.S2CTownEnter(packetData);
              break;
            case config.packetId.S2CAddExp:
              this.handler.S2CAddExp(packetData);
              break;
            case config.packetId.S2CLevelUp:
              this.handler.S2CLevelUp(packetData);
              break;
            case config.packetId.S2CSelectAP:
              this.handler.S2CSelectAP(packetData);
              break;
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
