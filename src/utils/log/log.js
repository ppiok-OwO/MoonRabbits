import os from 'os';
import redisClient from '../redis/redis.config.js';

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
  setInterval(() => {
    if (serverLogs.length <= 0) return;

    for (const log of serverLogs) {
      redisClient.zadd(
        'serverLogs',
        log.time,
        JSON.stringify(log),
        (err) => {
          if (err) console.error('Redis 서버 로그 저장 실패:', err);
        },
      );
    }

    serverLogs.length = 0;
  }, secPerReport * 1000);
}

// 에러 기록
export function reportErrorLog() {
  setInterval(() => {
    if (errorLogs.length <= 0) return;

    for (const log of errorLogs) {
      redisClient.zadd(
        'errorLogs',
        log.time,
        JSON.stringify(log),
        (err) => {
          if (err) console.error('Redis 에러 로그 저장 실패:', err);
        },
      );
    }

    errorLogs.length = 0;
  }, secPerReport * 1000);
}

// 메트릭 기록
export function reportMetric() {
  setInterval(() => {
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
      },
    );
  }, secPerReport * 1000);
}
