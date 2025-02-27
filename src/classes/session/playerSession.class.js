import chalk from 'chalk';
import redisClient from '../../utils/redis/redis.config.js';
import Player from '../player.class.js';
import { getSectorSessions } from '../../session/sessions.js';
import { config } from '../../config/config.js';

class PlayerSession {
  players = new Map();
  playerIdx = 1;

  async addPlayer(socket, user, nickname, classCode, statData) {
    const newPlayer = new Player(user, this.playerIdx++, nickname, classCode, statData);
    this.players.set(socket, newPlayer);

    // getSectorSessions()
    //   .getSector(config.sector.town)
    //   .setPlayer(socket, newPlayer);

    // @@@ getSector가 sectorId로 탐색해서 수정 @@@
    getSectorSessions().getSector(100).setPlayer(socket, newPlayer);

    return newPlayer;
  }

  removePlayer(socket) {
    this.players.delete(socket);
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
      console.log(`${chalk.green('[Redis Log]')} Player 데이터 저장 완료: ${key}`);
    } catch (error) {
      console.error(`${chalk.green('[Redis Error]')} Player 데이터 저장 실패: ${key}`, error);
    }
  }
}

export default PlayerSession;
