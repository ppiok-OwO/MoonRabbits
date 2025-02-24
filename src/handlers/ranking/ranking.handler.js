import Packet from '../../utils/packet/packet.js';
import redisClient from '../../utils/redis/redis.config.js';

// 메모리 내에 캐시 역할을 할 변수 (1시간마다 갱신)
let rankingCache = null;

/**
 * Redis의 Sorted Set("ranking")에서 전체 랭킹 리스트를 조회한 후 Redis Hash("player:{playerId}")에서 추가 정보를 가져와
 * rankingCache를 업데이트하는 함수
 */
async function updateRankingList() {
  try {
    // 모든 플레이어 데이터를 내림차순(경험치 기준)으로 조회 (전체 범위)
    const results = await redisClient.zRangeWithScores('ranking', 0, -1, { REV: true });
    const rankingList = [];
    let rank = 1;
    for (const entry of results) {
      const playerId = entry.value;
      // 개별 플레이어 정보는 해시에서 가져온다. (예시: 닉네임)
      const playerData = await redisClient.hGetAll(`player:${playerId}`);
      rankingList.push({
        rank: rank,
        player_id: playerId,
        nickname: playerData.nickname || '',
        exp: Math.floor(entry.score),
      });
      rank++;
    }
    rankingCache = rankingList;
    console.log(`랭킹 캐시가 ${new Date().toISOString()}에 갱신되었습니다.`);
  } catch (err) {
    console.error('랭킹 업데이트 오류:', err);
  }
}

// 1시간마다 랭킹 데이터를 갱신 (3600000 밀리초)
setInterval(updateRankingList, 3600000);
// 서버 시작 시 즉시 한 번 업데이트
updateRankingList();

/**
 * 패킷 번호에 따른 랭킹 관련 핸들러 맵핑
 * 패킷 디코딩 후 해당 번호로 호출하여 해당 핸들러가 클라이언트에 응답을 전송함
 */
const rankingHandlers = {
  // 전체 랭킹 리스트를 요청하는 클라이언트 처리 핸들러
  GET_ALL_RANKING: async (payload, socket) => {
    try {
      if (!rankingCache) {
        // 캐시가 아직 없다면 업데이트한 후 진행
        await updateRankingList();
      }
      // Packet.S2CRankingAll은 rankingCache 전체를 포함하는 응답 패킷을 생성해야 함
      const responsePacket = Packet.S2CUpdateRanking({
        rankingList: rankingCache,
        timestamp: new Date().toISOString(),
      });
      socket.write(responsePacket);
    } catch (err) {
      console.error('전체 랭킹 조회 오류:', err);
      const errorPacket = Packet.makeErrorPacket(0, '전체 랭킹 조회 오류 발생');
      socket.write(errorPacket);
    }
  },

  // 상위 1~10등 랭킹 리스트를 요청하는 클라이언트 처리 핸들러
  GET_TOP_RANKING: async (payload, socket) => {
    try {
      if (!rankingCache) {
        await updateRankingList();
      }
      // 상위 10명만 추출
      const top10 = rankingCache.slice(0, 10);
      const responsePacket = Packet.S2CUpdateRanking({
        rankingList: top10,
        timestamp: new Date().toISOString(),
      });
      socket.write(responsePacket);
    } catch (err) {
      console.error('상위 랭킹 조회 오류:', err);
      const errorPacket = Packet.makeErrorPacket(0, '상위 랭킹 조회 오류 발생');
      socket.write(errorPacket);
    }
  },
};

export default rankingHandlers;
