import path from 'path';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const redis = new Redis({
  host: 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const RedisStore = connectRedis(session);
