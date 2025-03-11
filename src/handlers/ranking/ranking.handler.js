import chalk from 'chalk';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import redisClient from '../../utils/redis/redis.config.js';
import PACKET from '../../utils/packet/packet.js';
import { rankingDataSaveToRedis } from '../../db/user/user.db.js';
import { formatDate } from '../../utils/dateFormatter.js';

let rankingCache = null;

// Redis에서 전체 랭킹 리스트를 업데이트하는 함수
async function updateRankingList() {
  try {
    await rankingDataSaveToRedis();

    const date = new Date();
    const results = await redisClient.zrevrange('ranking', 0, -1, 'WITHSCORES');
    const rankingList = [];
    let rank = 1;

    // results 배열은 [playerId, score, playerId, score, ...] 형태
    for (let i = 0; i < results.length; i += 2) {
      const memberJson = results[i];
      const score = results[i + 1];
      let memberData;
      try {
        // JSON 문자열을 파싱하여 랭킹 정보를 추출
        memberData = JSON.parse(memberJson);
      } catch (error) {
        console.error('Ranking member 파싱 오류:', error);
        continue;
      }
      rankingList.push({
        rank: rank,
        playerId: memberData.playerId,
        nickname: memberData.nickname,
        exp: Math.floor(Number(score)),
      });
      rank++;
    }
    rankingCache = rankingList;
    console.log(`랭킹 캐시가 ${formatDate(date)}에 갱신되었습니다.`);
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
    const date = new Date();

    if (!rankingCache) await updateRankingList();

    let responseData;
    if (type === 'TOP10') {
      responseData = rankingCache.slice(0, 10); // 전체 유저 리스트
    } else if (type === 'TOP20') {
      responseData = rankingCache.slice(0, 20); // 상위 10명만 추출
    } else if (type === 'TOP30') {
      responseData = rankingCache.slice(0, 30); // 상위 10명만 추출
    } else {
      throw new Error('유효하지 않은 요청 유형');
    }

    const responsePacket = PACKET.S2CUpdateRanking('success', {
      rankingList: responseData,
      timestamp: formatDate(date),
    });
    socket.write(responsePacket);
  } catch (error) {
    console.error(chalk.red('[rankingHandler Error]\n', error));
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'rankingHandler 에러'));
  }
};

export default rankingHandler;
