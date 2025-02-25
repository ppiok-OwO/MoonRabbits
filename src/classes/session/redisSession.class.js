// redisSession.class.js
import redisClient from '../../utils/redis/redis.config.js';
import chalk from 'chalk';
import {
  getUserSessions,
  getPlayerSession,
  getPartySessions,
  getSectorSessions,
} from '../../session/sessions.js';

class RedisSession {
  /**
   * 사용자 세션 데이터를 fullSession:{userId}의 "user" 필드에 저장
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
      status: user.status,
      currentSector: user.currentSector || null,
    };
    await redisClient.hset(key, 'user', JSON.stringify(userData));
    await redisClient.expire(key, 3600);
    console.log(chalk.green(`[Redis Log] userSession이 '${key}'에 저장되었습니다.`));
  }

  /**
   * 플레이어 세션 데이터를 fullSession:{userId}의 "player" 필드에 저장
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveToRedisPlayerSession(socket) {
    const playerSessionManager = getPlayerSession();
    const player = playerSessionManager.getPlayer(socket);
    if (!player) {
      console.error(
        chalk.red(
          `[saveToRedisPlayerSession Error] socket에서 playerId를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const userId = player.user.userId;
    if (!userId) {
      console.error(
        chalk.red(
          `[saveToRedisPlayerSession Error] player socket 데이터에서 userId를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }
    const key = `fullSession:${userId}`;
    const playerData = {
      playerIdx: player.id,
      nickname: player.nickname,
      classCode: player.classCode,
      status: 'active',
      currentSector: 'Town', // Town 입장 시 기본값, 필요에 따라 변경 가능
      loginTime: new Date().toISOString(),
    };
    await redisClient.hset(key, 'player', JSON.stringify(playerData));
    await redisClient.expire(key, 3600);
    console.log(chalk.green(`[Redis Log] playerSession이 '${key}'에 저장되었습니다`));
  }

  /**
   * 파티 세션 데이터를 fullSession:{userId}의 "party" 필드에 저장합니다.
   * 소켓에 연결된 사용자가 속한 파티를 partySession 매니저에서 조회합니다.
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
    // partySession은 Map에 파티 객체를 모두 저장합니다.
    // 여기에서는 해당 사용자가 리더이거나 구성원으로 포함된 첫번째 파티를 검색합니다.
    let partyData = null;
    for (const party of partySessionManager.getAllParties().values()) {
      // 예시로, 파티에 leader 속성이 있고 사용자가 리더인 경우를 확인
      if (party.leader && party.leader.userId === user.userId) {
        partyData = party;
        break;
      }
      // 추가적으로 파티 멤버 리스트에서 해당 userId를 찾을 수도 있습니다.
    }
    const key = `fullSession:${user.userId}`;
    if (partyData) {
      const partyObj = {
        partyId: partyData.getId(),
        // 파티의 추가 정보를 포함: 예를 들어 멤버 리스트 등
      };
      await redisClient.hset(key, 'party', JSON.stringify(partyObj));
      await redisClient.expire(key, 3600);
      console.log(chalk.green(`[Redis Log] partySession이 '${key}'에 저장되었습니다`));
    }
  }

  /**
   * 섹터 세션 데이터를 fullSession:{userId}의 "sector" 필드에 저장합니다.
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveToRedisSectorSession(socket) {
    // sectorSession 매니저에서 socket에 해당하는 섹터 정보를 가져온다고 가정합니다.
    const sectorSessionManager = getSectorSessions();
    const sector = sectorSessionManager.getSector(socket);
    if (!sector) {
      console.error(
        chalk.red(
          `[saveToRedisSectorSession Error] socket에 해당하는 sector 정보를 찾을 수 없습니다. : ${socket.id}`,
        ),
      );
      return;
    }

    // sector 객체에 userId 정보가 있다고 가정합니다.
    const key = `fullSession:${sector.userId}`;
    const sectorData = {
      currentSector: sector.currentSector || null,
      // 필요한 추가 데이터가 있다면 여기에 포함할 수 있습니다.
    };

    try {
      await redisClient.hset(key, 'sector', JSON.stringify(sectorData));
      await redisClient.expire(key, 3600);
      console.log(chalk.green(`[Redis Log] sectorSession이 '${key}'에 저장되었습니다`));
    } catch (error) {
      console.error(chalk.red(`[Redis Error] sectorSession 저장 실패 : ${error}`));
    }
  }

  /**
   * 전체 세션(user, player, party, sector)을 한 번에 저장하는 편의 메서드
   * @param {Object} socket - 현재 클라이언트 소켓
   */
  async saveFullSession(socket) {
    await this.saveToRedisUserSession(socket);
    await this.saveToRedisPlayerSession(socket);
    await this.saveToRedisPartySession(socket);
    await this.saveToRedisSectorSession(socket);
  }

  /**
   * userId 기반 통합 세션(fullSession:{userId})을 삭제합니다.
   * @param {string} userId - 사용자의 고유 ID
   */
  async removeFullSession(userId) {
    const key = `fullSession:${userId}`;
    await redisClient.del(key);
    console.log(chalk.green(`[Redis Log] 모든 세션이 삭제되었습니다. : ${userId}`));
  }
}

export default RedisSession;
