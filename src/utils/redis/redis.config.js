import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../../constants/env.js';

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});
