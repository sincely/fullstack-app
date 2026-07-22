import './env.js'

export const dbConfig = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // 连接池大小
  connectionLimit: Number.parseInt(process.env.DB_POOL_SIZE || '10', 10),
  waitForConnections: true,
  queueLimit: 0,

  // 超时配置（ms）
  connectTimeout: 10_000, // 建立连接超时 10s
  idleTimeout: 60_000, // 空闲连接超时 60s（mysql2 >= 3.3）

  // 保活，防止长时间空闲后被服务端断开（ECONNRESET）
  enableKeepAlive: true,
  keepAliveInitialDelay: 30_000,

  // 将 DATETIME / TIMESTAMP 类型解析为字符串，避免返回 Date 对象导致时区/格式问题
  dateStrings: true
}

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number.parseInt(process.env.REDIS_DB || '0', 10),
  // 自动重连
  retryStrategy: (times) => Math.min(times * 100, 3000)
}

/**
 * Redis 开关控制
 * 通过环境变量 REDIS_ENABLED 控制是否启用 Redis
 * 默认关闭，避免本地开发时强制依赖 Redis
 */
export const redisEnabled = process.env.REDIS_ENABLED === 'true'
