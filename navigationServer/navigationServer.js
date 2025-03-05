import net from 'net';
import { onConnection } from './events/onConnection.js';
import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { findPath } from './pathfinder/findPath.js';
import { getNavMesh } from './init/navMeshLoader/navMeshData.js';
import os from 'os';
import cluster from 'cluster';

dotenv.config();

const PORT = 3800;
const HOST = '0.0.0.0';

const numWorkers = os.cpus().length;

if (cluster.isMaster) {
  console.log(`마스터 프로세스 PID: ${process.pid}`);

  // 네비게이션 서버는 마스터 프로세스에서만 실행
  const navigationServer = net.createServer(onConnection);

  navigationServer.listen(PORT, HOST, () => {
    console.log(`[네비게이션 서버]가 ${HOST}:${PORT}에서 실행 중입니다.`);
  });

  // 워커 프로세스 생성
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} 종료됨 (code: ${code}, signal: ${signal}). 새로운 워커 생성.`);
    cluster.fork();
  });
} else {
  console.log(`Worker 프로세스 실행: PID ${process.pid}`);

  // Redis 연결
  const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  });

  new Worker(
    'navigationQueue',
    async (job) => {
      console.log(`Job 처리 중: ${job.id} (PID: ${process.pid})`);

      const { sectorCode, start, end, socketId } = job.data;
      const navMesh = getNavMesh(sectorCode);

      // 길찾기 수행
      const path = await findPath(navMesh, start, end);

      console.log(`경로 생성 완료: ${job.id} (PID: ${process.pid})`);

      return { path, socketId };
    },
    {
      concurrency: 2, // 각 프로세스에서 2개씩 처리
      connection,
    }
  );
}
