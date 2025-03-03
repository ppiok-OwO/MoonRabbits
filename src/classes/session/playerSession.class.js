import chalk from 'chalk';
import redisClient from '../../utils/redis/redis.config.js';
import Player from '../player.class.js';
import { getSectorSessions, getPartySessions } from '../../session/sessions.js';
import { leavePartyHandler } from '../../handlers/social/party/leaveParty.handler.js';
import PACKET from '../../utils/packet/packet.js';

class PlayerSession {
  players = new Map();
  playerIdx = 1;

  async addPlayer(socket, user, nickname, classCode, statData) {
    const newPlayer = new Player(
      user,
      this.playerIdx++,
      nickname,
      classCode,
      statData,
    );
    this.players.set(socket, newPlayer);

    // @@@ getSector가 sectorId로 탐색해서 수정 @@@
    getSectorSessions().getSector(100).setPlayer(socket, newPlayer);

    return newPlayer;
  }

  removePlayer(socket) {
    const SectorSessionManager = getSectorSessions();
    const partySessionManager = getPartySessions();

    // 2. playerSession에서 해당 소켓에 대한 플레이어 세션 삭제
    const player = this.getPlayer(socket);
    if (player) {
      const playerSectorId = player.getSectorId();
      const sector = SectorSessionManager.getSector(playerSectorId);
      sector.deletePlayer(player.user.socket);
      const partyId = player.getPartyId();
      if (partyId) {
        const party = partySessionManager.getParty(partyId);
        leavePartyHandler(socket, { partyId, leftPlayerId: player.id });
      }
      // 디스폰
      sector.notify(PACKET.S2CDespawn([player.id], playerSectorId));

      this.players.delete(socket);

      console.log(
        chalk.green(`[onEnd] playerSession에서 삭제된 socket ID: ${socket.id}`),
      );
    } else {
      console.log(
        chalk.yellow(
          `[onEnd] playerSession에서 찾을 수 없습니다. socket ID : ${socket.id}`,
        ),
      );
    }
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }

  getPlayerById(playerId) {
    for (const player of this.players.values()) {
      if (player.id === playerId) return player;
    }
    return -1;
  }

  getAllPlayers() {
    // return this.players.values();
    return this.players;
  }

  getPlayerByNickname(nickname) {
    for (const player of this.players.values()) {
      if (player.nickname === nickname) {
        return player;
      }
    }
    return -1;
  }

  clearSession() {
    this.players.clear();
  }

  notify(packet) {
    for (const player of this.players.keys()) {
      player.write(packet);
    }
  }

  // Redis에 Player 데이터를 저장하는 메서드
  async saveToRedis(key, player) {
    try {
      await redisClient.hset(key, {
        playerIdx: player.id,
        userId: player.user.userId,
        nickname: player.nickname,
        classCode: player.classCode,
        status: 'active',
        currentSector: 'Town', // 기본적으로 Town으로 설정
        loginTime: new Date().toISOString(),
      });
      await redisClient.expire(key, 3600); // 만료 시간 설정
      console.log(
        `${chalk.green('[Redis Log]')} Player 데이터 저장 완료: ${key}`,
      );
    } catch (error) {
      console.error(
        `${chalk.green('[Redis Error]')} Player 데이터 저장 실패: ${key}`,
        error,
      );
    }
  }
}

export default PlayerSession;
