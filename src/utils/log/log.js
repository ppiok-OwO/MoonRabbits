import os from 'os';
import redisClient from '../redis/redis.config.js';
import { setInterval } from 'timers/promises';

const serverLogs = [];
const errorLogs = [];

const secPerUpdate = 5;

// 로그 기록
export function addServerLog(message) {
  const timestamp = Date.now();
  serverLogs.push({ message, time: timestamp });
}

// 에러 기록
export function addErrorLog(message) {
  const timestamp = Date.now();
  errorLogs.push({ message, time: timestamp });
}

export function reportServerLog(){
    setInterval(() => {
        if(serverLogs.length<=0) return;

        for(const log of serverLogs){
            redisClient.zadd('serverLogs', log.timestamp, JSON.stringify(log),
            (err) => {
                if (err) console.error('Redis 서버 로그 저장 실패:', err);
                else console.log('서버 로그 저장 성공:', message);
            })
        }

        serverLogs = [];
    }, secPerUpdate * 1000);
}

export function reportErrorLog(){
    setInterval(() => {
        if(errorLogs.length <= 0) return;
    
        for(const log of errorLogs){
            redisClient.zadd('errorLogs', log.timestamp, JSON.stringify(log),
            (err) => {
                if (err) console.error('Redis 에러 로그 저장 실패:', err);
                else console.log('에러 로그 저장 성공:', message);
            })
        }
    
        errorLogs = [];
    }, secPerUpdate * 1000);
}

// 메트릭 기록
export function collectMetric() {
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
        else console.log('메트릭 로그 저장 성공:', message);
      },
    );
  }, secPerUpdate * 1000);
}
