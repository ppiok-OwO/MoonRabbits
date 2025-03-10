import redisClient from '../utils/redis/redis.config.js';
import chalk from 'chalk';

export const addBlacklist = async (IP) => {
  try {
    // Redis에 블랙리스트 추가 (Set 자료형 사용)
    await redisClient.sadd('Blacklist:abuserIPs', IP);
    console.log(
      chalk.green(`[Redis Log] ${IP}가 블랙리스트에 추가되었습니다.`),
    );
  } catch (error) {
    console.error(
      chalk.red(`[Redis Error] 블랙리스트 추가 실패: ${error.message}`),
    );
  }
};

export const getBlacklist = async () => {
  try {
    // Redis에서 모든 블랙리스트 IP 조회
    const blacklistedIPs = await redisClient.smembers('Blacklist:abuserIPs');
    return new Set(blacklistedIPs);
  } catch (error) {
    console.error(
      chalk.red(`[Redis Error] 블랙리스트 조회 실패: ${error.message}`),
    );
    return new Set();
  }
};

export const isBlacklisted = async (IP) => {
  try {
    // 해당 IP가 블랙리스트에 포함되어 있는지 확인
    const isMember = await redisClient.sismember('Blacklist:abuserIPs', IP);
    return isMember === 1;
  } catch (error) {
    console.error(
      chalk.red(`[Redis Error] 블랙리스트 확인 실패: ${error.message}`),
    );
    return false;
  }
};
