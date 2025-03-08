import net from 'net';
import { onConnection } from './events/onConnection.js';
import dotenv from 'dotenv';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import os from 'os';
import cluster from 'cluster';

dotenv.config();

const PORT = 3800;
const HOST = '0.0.0.0';

const numWorkers = os.cpus().length;

// Redis 연결
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

if (cluster.isMaster) {
  console.log(`마스터 프로세스 PID: ${process.pid}`);

  // 네비게이션 서버는 마스터 프로세스에서만 실행
  const sessionServer = net.createServer(onConnection);

  sessionServer.listen(PORT, HOST, () => {
    console.log(`[세션 서버]가 ${HOST}:${PORT}에서 실행 중입니다.`);
  });

  // 워커 프로세스 생성
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} 종료됨 (code: ${code}, signal: ${signal}). 새로운 워커 생성.`,
    );
    cluster.fork();
  });
} else {
  console.log(`Worker 프로세스 실행: PID ${process.pid}`);

  new Worker(
    'sessionQueue',
    async (job) => {
      console.log(`Job 처리 중: ${job.id} (PID: ${process.pid})`);
    },
    {
      concurrency: 2, // 각 프로세스에서 2개씩 처리
      connection,
    },
  );
}
