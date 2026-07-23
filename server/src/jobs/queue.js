import Queue from 'bull'
import { redisConfig } from '../config/database.js'

/**
 * Bull 队列 Redis 配置
 * 从 redisConfig 继承核心连接参数，排除 ioredis 专属选项
 * Bull 自行管理 Redis 连接生命周期
 */
const bullRedisConfig = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  db: redisConfig.db,
  connectTimeout: redisConfig.connectTimeout,
  retryStrategy: redisConfig.retryStrategy,
  maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
  enableOfflineQueue: redisConfig.enableOfflineQueue
}

// 创建一个通用队列实例
const cronQueue = new Queue('cron-jobs', {
  redis: bullRedisConfig
})

export { cronQueue }
