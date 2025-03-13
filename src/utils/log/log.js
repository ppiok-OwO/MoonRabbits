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

// 메트릭 기록
export function reportMetric() {
  redisClient.del('metricLogs');
  setInterval(async () => {
    const currentCpuUsage = process.cpuUsage();
    const userCpu = (currentCpuUsage.user - previousCpuUsage.user) / 1000;
    const systemCpu = (currentCpuUsage.system - previousCpuUsage.system) / 1000;
    const totalCpuTime = userCpu + systemCpu;
    const cores = os.cpus().length;
    const totalAvailableTime = 5000 * cores;
    const cpuUsagePercentage = ((totalCpuTime / totalAvailableTime) * 100).toFixed(2);
    previousCpuUsage = currentCpuUsage;

    const currentMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    
    const cpuUsage = `${cpuUsagePercentage}%`;
    const memoryUsage = `${currentMemoryUsage.toFixed(3)} MB`;
    const networkUsage = `ㅠㅠ`;
    const timestamp = Date.now();

    redisClient.zadd(
      'metricLogs',
      timestamp,
      JSON.stringify({ cpuUsage, memoryUsage, networkUsage, time: timestamp }),
      (err) => {
        if (err) console.error('Redis 메트릭 저장 실패', err);
      },
    );
  }, secPerReport * 1000);
}

function calculateMbps(interfaceName, currentStats, previousStats) {
  if (!previousStats[interfaceName]) return { rxMbps: 0, txMbps: 0 };

  const timeInterval = 1; // 측정 간격(초)
  const rxBytesDiff = currentStats.rxBytes - previousStats[interfaceName].rxBytes;
  const txBytesDiff = currentStats.txBytes - previousStats[interfaceName].txBytes;

  const rxMbps = (rxBytesDiff * 8) / (timeInterval * 1024 * 1024); // Mbps 계산
  const txMbps = (txBytesDiff * 8) / (timeInterval * 1024 * 1024); // Mbps 계산

  return { rxMbps, txMbps };
}