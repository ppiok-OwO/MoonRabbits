// redisSession.class.js
import redisClient from '../../utils/redis/redis.config.js';
import chalk from 'chalk';
import {
  getUserSessions,
  getPlayerSession,
  getPartySessions,
  getSectorSessions,
} from '../../session/sessions.js';
import { formatDate } from '../../utils/dateFormatter.js';

class RedisSession {
  /**
   * 사용자 세션 데이터를 fullSession:{userId}의 "user" 필드에 저장(최초 생성 후 갱신)
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveToRedisUserSession(socket) {
    const userSessionManager = getUserSessions();
    const user = userSessionManager.getUser(socket);
    if (!user || !user.userId) {
      console.error(
        chalk.red(
          `[saveToRedisUserSession Error] socket에서 userId를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const key = `fullSession:${user.userId}`;
    const userData = {
      userId: user.userId,
      loginTime: user.loginTime,
    };
    // 단일 객체로 저장하여 이후 호출 시 덮어씌움
    await redisClient.hset(key, 'user', JSON.stringify(userData));
    console.log(chalk.green(`[Redis Log] userSession이 '${key}'에 저장(갱신)되었습니다.`));
  }

  /**
   * 플레이어 세션 데이터를 fullSession:{userId}의 "player" 필드에 저장(최초 생성 후 갱신)
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveToRedisPlayerSession(socket) {
    const playerSessionManager = getPlayerSession();
    const player = playerSessionManager.getPlayer(socket);
    const sectorCode = player.getSectorId();

    if (!player) {
      console.error(
        chalk.red(
          `[saveToRedisPlayerSession Error] socket에서 player 데이터를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const userId = player.user.userId;
    if (!userId) {
      console.error(
        chalk.red(
          `[saveToRedisPlayerSession Error] player 데이터에서 userId를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const key = `fullSession:${userId}`;
    const date = new Date();
    const playerData = {
      playerId: socket.player.playerId,
      nickname: player.nickname,
      classCode: player.classCode,
      currentSector: sectorCode,
      loginTime: formatDate(date),
    };
    // 단일 객체로 저장하여 누적하지 않고 갱신
    await redisClient.hset(key, 'player', JSON.stringify(playerData));
    console.log(chalk.green(`[Redis Log] playerSession이 '${key}'에 저장(갱신)되었습니다.`));
  }

  /**
   * 파티 세션 데이터를 fullSession:{userId}의 "party" 필드에 저장(최초 생성 후 갱신)
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveToRedisPartySession(socket) {
    const userSessionManager = getUserSessions();
    const user = userSessionManager.getUser(socket);
    if (!user || !user.userId) {
      console.error(
        chalk.red(
          `[saveToRedisPartySession Error] socket에서 User를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const partySessionManager = getPartySessions();
    let partyData = null;
    for (const party of partySessionManager.getAllParties().values()) {
      if (party.leader && party.leader.userId === user.userId) {
        partyData = party;
        break;
      }
    }
    if (!partyData) {
      console.warn(
        chalk.yellow(
          `[saveToRedisPartySession Warning] 해당 유저의 파티 데이터를 찾지 못했습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const key = `fullSession:${user.userId}`;
    const partyObj = {
      partyId: partyData.getId(),
      // 파티의 추가 정보가 있다면 여기에 포함
    };
    // 단일 객체로 저장하여 이후 호출 시 덮어씌우도록 처리
    await redisClient.hset(key, 'party', JSON.stringify(partyObj));
    await redisClient.expire(key, 3600);
    console.log(chalk.green(`[Redis Log] partySession이 '${key}'에 저장(갱신)되었습니다.`));
  }

  /**
   * 전체 세션(user, player, party, sector)을 전체 fullSession에 저장(갱신)하는 편의 메서드
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveFullSession(socket) {
    await this.saveToRedisUserSession(socket);
    await this.saveToRedisPlayerSession(socket);
    await this.saveToRedisPartySession(socket);
  }

  /**
   * userId 기반 통합 세션(fullSession:{userId})을 삭제
   * @param {string} userId - 사용자의 고유 ID
   */
  async removeFullSession(userId) {
    const key = `fullSession:${userId}`;
    await redisClient.del(key);
    console.log(chalk.green(`[Redis Log] 모든 세션이 삭제되었습니다. : ${userId}`));
  }
}

export default RedisSession;
