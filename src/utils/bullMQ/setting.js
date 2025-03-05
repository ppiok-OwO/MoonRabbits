import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

// Redis 연결
export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// BullMQ Queue 생성
export const navigationQueue = new Queue('navigationQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50, // 마지막 50개 Job만 유지
    removeOnFail: 50, // 마지막 50개 실패한 Job만 유지
  },
});

export const queueEvents = new QueueEvents('navigationQueue', {
  connection,
});