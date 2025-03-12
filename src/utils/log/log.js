import os from 'os';
import redisClient from '../redis/redis.config.js';
import { setInterval } from 'timers/promises';

const serverLogs = [];
const errorLogs = [];

const secPerReport = 5;

export function addServerLog(message) {
  const timestamp = Date.now();
  serverLogs.push({ message, time: timestamp });
}

export function addErrorLog(message) {
  const timestamp = Date.now();
  errorLogs.push({ message, time: timestamp });
}

// 로그 기록
export function reportServerLog() {
  console.log('로그 인터벌 시작', serverLogs);
  setInterval(() => {
    console.log('로그 기록');
    if (serverLogs.length <= 0) return;

    for (const log of serverLogs) {
      redisClient.zadd(
        'serverLogs',
        log.timestamp,
        JSON.stringify(log),
        (err) => {
          if (err) console.error('Redis 서버 로그 저장 실패:', err);
          else console.log('서버 로그 저장 성공:', message);
        },
      );
    }

    serverLogs = [];
  }, secPerReport * 1000);
}

// 에러 기록
export function reportErrorLog() {
  console.log('에러 인터벌 시작');
  setInterval(() => {
    console.log('에러 기록');
    if (errorLogs.length <= 0) return;

    for (const log of errorLogs) {
      redisClient.zadd(
        'errorLogs',
        log.timestamp,
        JSON.stringify(log),
        (err) => {
          if (err) console.error('Redis 에러 로그 저장 실패:', err);
          else console.log('에러 로그 저장 성공:', message);
        },
      );
    }

    errorLogs = [];
  }, secPerReport * 1000);
}

// 메트릭 기록
export function reportMetric() {
  console.log('메트릭 인터벌 시작');
  setInterval(() => {
    console.log('메트릭 기록');
    const cpuUsage = os.loadavg()[0];
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const message = `CPU 사용량: ${cpuUsage}, 메모리 사용량: ${memoryUsage.toFixed(3)} MB`;
    const timestamp = Date.now();

    redisClient.zadd(
      'metricLogs',
      timestamp,
      JSON.stringify({ message, time: timestamp }),
      (err) => {
        if (err) console.error('Redis 메트릭 저장 실패', err);
        else console.log('메트릭 로그 저장 성공:', message);
      },
    );
  }, 3 * 1000);
}
