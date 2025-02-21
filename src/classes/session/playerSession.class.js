import chalk from 'chalk';
import redisClient from '../../utils/redis/redis.config.js';
import Player from '../player.class.js';

class PlayerSession {
  players = new Map();
  playerId = 1;

  async addPlayer(socket, user, nickname, classCode, statData) {
    this.players.set(socket, new Player(user, this.playerId++, nickname, classCode, statData));

    const newPlayer = this.players.get(socket);

    return newPlayer;
  }

  removePlayer(socket) {
    const player = this.players.get(socket);
    console.log('removePlayer 할 때 players.get(socket) 뭐 나오나 : ', player.id);
    if (player) {
      const key = `playerSession:${player.id}`;
      redisClient.del(key);
      this.players.delete(socket);
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
    this.players.forEach((player) => {
      redisClient.del(`playerSession:${player.id}`);
    });
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
        id: player.id,
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
