import os from 'os';
import redisClient from '../redis/redis.config.js';

const serverLogs = [];
const packetLogs = [];
const errorLogs = [];

const secPerReport = 5;

export function addServerLog(message) {
  const timestamp = Date.now();
  serverLogs.push({ message, time: timestamp });
}

export function addPacketLog(packetType, message){
  const timestamp = Date.now();
  packetLogs.push({ packetType, message, time: timestamp });
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

// 패킷 로그 기록
export function reportPacketLog() {
  setInterval(() => {
    if (packetLogs.length <= 0) return;

    for (const log of packetLogs) {
      redisClient.zadd(
        'packetLogs',
        log.time,
        JSON.stringify(log),
        (err) => {
          if (err) console.error('Redis 서버 로그 저장 실패:', err);
        },
      );
    }

    packetLogs.length = 0;
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
  }, secPerReport * 1000 * 2);
}

let previousCpuUsage = process.cpuUsage();
let previousNetworkStats = {};

// 메트릭 기록
export function reportMetric() {
  setInterval(() => {
    //const cpuUsage = os.loadavg()[0];{
    const currentCpuUsage = process.cpuUsage();
    const userCpu = (currentCpuUsage.user - previousCpuUsage.user) / 1000;
    const systemCpu = (currentCpuUsage.system - previousCpuUsage.system) / 1000;
    const totalCpuTime = userCpu + systemCpu;
    const cores = os.cpus().length;
    const totalAvailableTime = 5000 * cores;
    const cpuUsagePercentage = ((totalCpuTime / totalAvailableTime) * 100).toFixed(2);

    const currentMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    
    //const message = `CPU 사용량: ${cpuUsage}, 메모리 사용량: ${memoryUsage.toFixed(3)} MB`;
    const networkInterfaces = os.networkInterfaces();
    const currentNetworkStats = [];

    let totalTx = 0;
    let totalRx = 0;

    for (const [key, interfaces] of Object.entries(networkInterfaces)) {
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          currentNetworkStats[key] = {
            tx: iface.tx_bytes || 0,
            rx: iface.rx_bytes || 0,
          };

          // 이전 상태와 현재 상태 비교
          if (previousNetworkStats[key]) {
            const diffTx = currentNetworkStats[key].tx - previousNetworkStats[key].tx;
            const diffRx = currentNetworkStats[key].rx - previousNetworkStats[key].rx;

            totalTx += diffTx > 0 ? diffTx : 0;
            totalRx += diffRx > 0 ? diffRx : 0;
          }
        }
      }
    }

    previousCpuUsage = currentCpuUsage;

    const cpuUsage = `${cpuUsagePercentage}%`;
    const memoryUsage = `${currentMemoryUsage.toFixed(3)} MB`;
    const networkUsage = `(TX):${totalTx}bytes, (RX):${totalRx}bytes`;
    const timestamp = Date.now();

    redisClient.zadd(
      'metricLogs2',
      timestamp,
      JSON.stringify({ cpuUsage, memoryUsage, networkUsage, time: timestamp }),
      (err) => {
        if (err) console.error('Redis 메트릭 저장 실패', err);
      },
    );
  }, secPerReport * 1000);
}
