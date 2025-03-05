import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { findPath } from '../pathfinder/findPath.js';
import { getNaveMesh } from '../init/navMeshLoader/navMeshData.js';

dotenv.config();

// Redis 연결
export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// Worker 생성 (네비게이션 서버에서 실행)
export const navigationWorker = new Worker(
  'navigationQueue',
  async (job) => {
    console.log(`job 처리하는 중 : ${job.id}`);

    const { sectorCode, start, end, socketId } = job.data;

    const navMesh = getNaveMesh(sectorCode);

    // 길찾기 수행
    const path = await findPath(navMesh, start, end);

    console.log(`경로 생성 됨 : ${job.id}`);

    // Job 결과 반환
    return { path, socketId };
  },
  { connection },
);
