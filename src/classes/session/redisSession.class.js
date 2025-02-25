import redisClient from '../../utils/redis/redis.config.js';
import chalk from 'chalk';
import {
  getUserSessions,
  getPlayerSession,
  getPartySession,
  getSectorSessions,
} from '../../session/sessions.js';

class RedisSession {
  /**
   * 소켓을 기반으로 모든 세션 정보를 한 사용자 통합 세션으로 Redis에 저장
   * 각 세션 매니저에서 소켓에 대응하는 데이터를 조회하여 하나의 객체로 구성
   * @param {Object} socket - 클라이언트 소켓 (고유식별자(socket.id)와 연결된 정보)
   */
  async saveSession(socket) {
    // userSession: 로그인 및 사용자 관련 정보
    const userSessionManager = getUserSessions();
    // playerSession: 플레이어 객체 관련 정보
    const playerSessionManager = getPlayerSession();
    // partySession: 파티 관련 데이터
    const partySessionManager = getPartySession();
    // sectorSession: 유저가 속한 섹터(Town, Sector 등) 관련 데이터
    const sectorSessionManager = getSectorSessions();

    const user = userSessionManager.getUser(socket);
    if (!user || !user.userId) {
      console.error(
        chalk.red(
          `RedisSession.saveSession - 유효한 user session이 존재하지 않습니다. socket id: ${socket.id}`,
        ),
      );
      return;
    }

    // 같은 소켓에 연결된 player 세션 데이터. 없으면 null.
    const player = playerSessionManager.getPlayer(socket) || null;

    // 파티 정보는 상황에 따라 여러 방식으로 조회할 수 있습니다.
    // 여기서는 파티 세션 매니저에 유저가 속한 파티가 있다고 가정하고 예시로 처리합니다.
    // 만약 partySessionManager에서 별도의 조회 함수(getPartyByUserId 등)가 있다면 사용.
    const party = partySessionManager.getParty(user.userId) || null;

    // 섹터 정보도 별도로 관리되는 경우, 해당 userId 또는 소켓 기반으로 조회합니다.
    // 예시로 sectorSession은 여러 섹터를 관리하므로, 현재 연결된 섹터를 찾는 메서드를 사용합니다.
    // 아래는 단순히 첫 번째 섹터를 조회하는 예시입니다.
    const sectors = Array.from(sectorSessionManager.getAllSectors());
    // 필드에 사용자 관련 섹터가 여러 개일 수 있으므로 조건에 맞게 필터하거나 첫 번째 항목만 선택
    const sector = sectors.length > 0 ? sectors[0] : null;

    // 모든 세션 정보를 하나의 객체로 통합
    const fullSession = {
      user: {
        userId: user.userId,
        nickname: user.nickname,
        loginTime: user.loginTime,
        status: user.status,
        currentSector: user.currentSector || null,
      },
      player: player
        ? {
            playeridx: player.id,
            playerId: player.playerId,
            nickname: player.nickname,
            classCode: player.classCode,
            // 필요한 추가 플레이어 필드들을 여기에 추가할 수 있음
          }
        : null,
      party: party ? party : null,
      sector: sector
        ? {
            sectorId: sector.id,
            sectorCode: sector.sectorCode,
            // 필요에 따라 섹터 내 플레이어 목록 등도 포함 가능
          }
        : null,
    };

    // Redis 키를 userId 기준 통합 세션으로 정의: fullSession:{userId}
    const key = `fullSession:${user.userId}`;
    try {
      // 전체 세션을 JSON 문자열로 Redis에 저장하고 만료시간(예: 1시간)을 설정
      await redisClient.set(key, JSON.stringify(fullSession), 'EX', 3600);
      console.log(chalk.green(`[Redis Log] Full session saved for userId: ${user.userId}`));
    } catch (error) {
      console.error(
        chalk.red(`[Redis Error] Saving full session for userId: ${user.userId} failed.`),
        error,
      );
    }
  }

  /**
   * userId 기반으로 저장된 통합 세션을 삭제합니다.
   * @param {string} userId - 해당 사용자의 고유 ID
   */
  async removeSession(userId) {
    try {
      const key = `fullSession:${userId}`;
      await redisClient.del(key);
      console.log(chalk.green(`[Redis Log] Full session removed for userId: ${userId}`));
    } catch (error) {
      console.error(
        chalk.red(`[Redis Error] Removing full session for userId: ${userId} failed.`),
        error,
      );
    }
  }
}

export default RedisSession;
