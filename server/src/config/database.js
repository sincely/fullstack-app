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

  // 连接超时（ms）
  connectTimeout: 5_000,

  // 命令执行超时（ms），防止慢查询阻塞
  commandTimeout: 3_000,

  // 单次请求最大重试次数（超过后不再自动重连，直接报错）
  maxRetriesPerRequest: 3,

  // 自动重连策略：指数退避，上限 3s
  retryStrategy: (times) => {
    if (times > 10) return null // 超过 10 次重连后放弃
    return Math.min(times * 200, 3000)
  },

  // 延迟连接：由应用显式调用 connect()，便于启动时统一检测和错误处理
  lazyConnect: true,

  // 启用离线队列：连接断开期间的命令会排队，重连后自动执行
  enableOfflineQueue: true
}

/**
 * Redis 开关控制
 * 通过环境变量 REDIS_ENABLED 控制是否启用 Redis
 * 默认关闭，避免本地开发时强制依赖 Redis
 */
export const redisEnabled = process.env.REDIS_ENABLED === 'true'
