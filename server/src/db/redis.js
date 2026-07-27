/**
 * Redis 客户端模块
 *
 * 提供：
 *  - connectRedis()   启动时显式连接并验证（PING）
 *  - getRedisClient() 获取已连接的单例客户端
 *  - checkRedis()     健康检查（供 /api/health 探针使用）
 *  - closeRedis()     优雅关闭（供 graceful shutdown 使用）
 */
import Redis from 'ioredis'
import { redisConfig, redisEnabled } from '../config/database.js'
import logger from '../config/logger.js'

/** @type {Redis | null} */
let client = null

/** 记录连接状态，供健康检查读取 */
let connectionState = 'disconnected' // disconnected | connecting | connected | error
let lastError = null

// ──────────────────────────────────────────────
//  内部：创建 ioredis 实例并绑定事件
// ──────────────────────────────────────────────
function createClient() {
  const redis = new Redis(redisConfig)

  redis.on('connect', () => {
    connectionState = 'connected'
    lastError = null
    logger.info(`Redis 已连接 → ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`)
  })

  redis.on('ready', () => {
    connectionState = 'connected'
    logger.info('Redis 就绪，可接受命令')
  })

  redis.on('error', (err) => {
    connectionState = 'error'
    lastError = err.message
    logger.error({ err: { message: err.message, code: err.code } }, 'Redis 连接错误')
  })

  redis.on('close', () => {
    if (connectionState !== 'disconnected') {
      connectionState = 'disconnected'
      logger.warn('Redis 连接已关闭')
    }
  })

  redis.on('reconnecting', (ms) => {
    connectionState = 'connecting'
    logger.info(`Redis 正在重连（${ms}ms 后）...`)
  })

  redis.on('end', () => {
    connectionState = 'disconnected'
  })

  return redis
}

// ──────────────────────────────────────────────
//  启动时显式连接并验证
// ──────────────────────────────────────────────

/**
 * 初始化 Redis 连接
 * 使用 PING 验证连通性，超时 5s
 * @returns {Promise<Redis>} 已验证的 Redis 客户端
 * @throws 连接失败时抛出错误
 */
export async function connectRedis() {
  if (!redisEnabled) {
    logger.info('Redis 未启用（REDIS_ENABLED !== true），跳过连接')
    return null
  }

  if (client && connectionState === 'connected') {
    return client
  }

  connectionState = 'connecting'
  client = createClient()

  // 显式触发连接（因为 lazyConnect: true）
  try {
    await client.connect()
  } catch (err) {
    connectionState = 'error'
    lastError = err.message
    logger.error({ err: { message: err.message } }, 'Redis 连接失败')
    throw new Error(`Redis 连接失败: ${err.message}`)
  }

  // PING 验证
  try {
    const pong = await client.ping()
    if (pong !== 'PONG') {
      throw new Error(`Redis PING 返回异常值: ${pong}`)
    }
    logger.info('Redis PING/PONG 验证通过 ✓')
  } catch (err) {
    connectionState = 'error'
    lastError = err.message
    throw new Error(`Redis 健康验证失败: ${err.message}`)
  }

  return client
}

// ──────────────────────────────────────────────
//  获取客户端（同步，供业务层使用）
// ──────────────────────────────────────────────

/**
 * 获取 Redis 客户端单例
 * 必须先调用 connectRedis() 初始化
 * @returns {Redis | null}
 */
export function getRedisClient() {
  if (!redisEnabled) return null
  if (!client) {
    logger.warn('Redis 客户端未初始化，自动创建（建议启动时显式调用 connectRedis）')
    client = createClient()
    client.connect().catch((err) => {
      logger.error({ err: { message: err.message } }, 'Redis 自动连接失败')
    })
  }
  return client
}

// ──────────────────────────────────────────────
//  健康检查（供 /api/health 探针使用）
// ──────────────────────────────────────────────

/**
 * Redis 健康检查
 * @returns {Promise<{ status: string, latency: number | null, error?: string }>}
 */
export async function checkRedis() {
  if (!redisEnabled) {
    return { status: 'disabled', latency: null }
  }

  if (!client || connectionState !== 'connected') {
    return {
      status: 'down',
      latency: null,
      error: lastError || '未连接',
      state: connectionState
    }
  }

  const start = Date.now()
  try {
    const pong = await client.ping()
    const latency = Date.now() - start
    return {
      status: pong === 'PONG' ? 'up' : 'degraded',
      latency,
      host: `${redisConfig.host}:${redisConfig.port}`,
      db: redisConfig.db
    }
  } catch (err) {
    return {
      status: 'down',
      latency: Date.now() - start,
      error: err.message,
      state: connectionState
    }
  }
}

// ──────────────────────────────────────────────
//  优雅关闭
// ──────────────────────────────────────────────

/**
 * 优雅关闭 Redis 连接
 * 等待队列中的命令执行完毕后断开
 */
export async function closeRedis() {
  if (client) {
    try {
      await client.quit() // 等待剩余命令执行完毕后关闭
    } catch {
      // quit 失败时强制断开
      client.disconnect()
    }
    client = null
    connectionState = 'disconnected'
    logger.info('Redis 连接已优雅关闭')
  }
}

export default { connectRedis, getRedisClient, checkRedis, closeRedis }
