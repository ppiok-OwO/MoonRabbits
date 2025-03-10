// redisSession.class.js
import redisClient from '../../utils/redis/redis.config.js';
import chalk from 'chalk';
import { getUserSessions, getPlayerSession, getPartySessions } from '../../session/sessions.js';
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
    console.log(chalk.green(`[Redis Log] partySession이 '${key}'에 저장(갱신)되었습니다.`));
  }

  /**
   * fullSession의 'ping' 필드를 업데이트하는 메서드
   * @param {Object} socket - 클라이언트 소켓 (여기서 socket.user가 있어야 함)
   * @param {number} pingValue - 체크된 레이턴시 또는 ping 값
   */
  async updatePing(socket, pingValue) {
    try {
      const user = socket.user;
      const date = new Date();
      if (!user || !user.userId) {
        console.error(chalk.red(`[updatePing Error] user 정보가 없음. socket.id: ${socket.id}`));
        return;
      }
      const key = `fullSession:${user.userId}`;
      // ping 값과 함께 현재 시간을 저장하여 업데이트 여부를 기록
      const pingData = {
        value: pingValue,
        timestamp: formatDate(date),
      };
      await redisClient.hset(key, 'ping', JSON.stringify(pingData));
      console.log(
        chalk.green(`[Redis Log] ${key}의 ping 업데이트 완료: ${JSON.stringify(pingData)}`),
      );
    } catch (error) {
      console.error(chalk.red(`[updatePing Error] ${error}`));
    }
  }

  /**
   * fullSession에 저장된 ping 정보가 일정 시간(staleThreshold) 이상 업데이트되지 않은 경우 TTL을 적용하여
   * 해당 세션이 자동 삭제되도록 하는 메서드
   * @param {string} userId - 사용자 고유 ID
   * @param {number} staleThreshold - ping 업데이트가 없다고 판단할 임계 시간 (ms 단위, 기본값: 15000)
   * @param {number} ttl - TTL 설정값 (초 단위, 기본값: 60)
   */
  async checkStalePing(userId, staleThreshold = 15000, ttl = 60) {
    try {
      const key = `fullSession:${userId}`;
      const pingDataStr = await redisClient.hget(key, 'ping');
      if (pingDataStr) {
        const pingData = JSON.parse(pingDataStr);
        const timeDiff = Date.now() - pingData.timestamp;
        if (timeDiff > staleThreshold) {
          // 예: 15초 이상 업데이트 안됨이면
          // TTL을 부여해 이후 자동 삭제되도록 함
          await redisClient.expire(key, ttl);
          console.log(
            chalk.yellow(`[Redis Log] ${key}에 TTL 적용 (TTL: ${ttl}초, 시간 차: ${timeDiff}ms)`),
          );
        }
      }
    } catch (error) {
      console.error(chalk.red(`[checkStalePing Error] ${error}`));
    }
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
