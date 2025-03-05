import chalk from 'chalk';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import redisClient from '../../utils/redis/redis.config.js';
import PACKET from '../../utils/packet/packet.js';

let rankingCache = null;

// Redis에서 전체 랭킹 리스트를 업데이트하는 함수
async function updateRankingList() {
  try {
    // ioredis v5에서는 zRangeWithScore 대신 zrevrange와 WITHSCORES 옵션을 사용합니다.
    const results = await redisClient.zrevrange('ranking', 0, -1, 'WITHSCORES');
    const rankingList = [];
    let rank = 1;

    // results 배열은 [playerId, score, playerId, score, ...] 형태입니다.
    for (let i = 0; i < results.length; i += 2) {
      const playerId = results[i];
      const score = results[i + 1];
      // hgetall은 소문자형태로 제공됩니다.
      const playerData = await redisClient.hgetall(`player:${playerId}`);
      rankingList.push({
        rank: rank,
        player_id: playerId,
        nickname: playerData.nickname || '',
        exp: Math.floor(Number(score)),
      });
      rank++;
    }
    rankingCache = rankingList;
    console.log(`랭킹 캐시가 ${new Date().toISOString()}에 갱신되었습니다.`);
  } catch (err) {
    console.error('랭킹 업데이트 오류:', err);
  }
}

// 1시간마다 랭킹 캐시 갱신
setInterval(updateRankingList, 3600000);
updateRankingList();
// 전체 또는 상위 랭킹 리스트를 요청하는 핸들러
export const rankingHandler = async (socket, packetData) => {
  try {
    const { type } = packetData;

    if (!rankingCache) await updateRankingList();

    let responseData;
    if (packetData === 'ALL') {
      responseData = rankingCache; // 전체 유저 리스트
    } else if (packetData === 'TOP') {
      responseData = rankingCache.slice(0, 10); // 상위 10명만 추출
    } else {
      throw new Error('유효하지 않은 요청 유형');
    }

    const responsePacket = PACKET.S2CUpdateRanking({
      status: 'success',
      data: {
        rankingList: responseData,
        timestamp: new Date().toLocaleDateString(),
      },
    });

    socket.write(responsePacket);
  } catch (error) {
    console.error(chalk.red('[rankingHandler Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'rankingHandler 에러'));
  }
};

export default rankingHandler;
