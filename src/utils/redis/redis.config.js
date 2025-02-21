import Redis from 'ioredis';
import chalk from 'chalk';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../../constants/env.js';

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  // 자동 재연결 전략: 재연결 시도를 할 때마다 지연시간을 증가
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// 연결 성공 시 로그 출력
redisClient.on('connect', () => {
  console.log(`${chalk.green('[ioredis]')} Redis에 성공적으로 연결되었습니다.`);
});

// 에러 발생 시 로그 출력 (에러가 발생해도 server crash 없이 계속 운영)
redisClient.on('error', (error) => {
  console.error(`${chalk.red('[ioredis]')} Redis 연결 에러 발생:`, error);
  // 에러가 발생해도 서버 종료 없이 재연결을 시도
});

export default redisClient;
