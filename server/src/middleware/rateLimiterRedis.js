/**
 * 基于 Redis 的滑动窗口限流中间件
 * 
 * 使用 Redis Sorted Set 实现精确的滑动窗口算法：
 *  - 每个 IP + 路径组合对应一个 Sorted Set
 *  - score = 请求时间戳（ms）
 *  - 通过 ZRANGEBYSCORE 统计窗口内的请求数
 * 
 * 适用于集群部署：所有实例共享同一份计数
 * 
 * Redis 不可用时自动降级（放行请求，不阻塞）
 */

import { getRedisClient } from '../db/redis.js'
import logger from '../config/logger.js'

const KEY_PREFIX = 'ratelimit:'

/**
 * 创建基于 Redis 的速率限制中间件
 * @param {Object} options 配置选项
 * @param {number} options.window - 时间窗口（毫秒），默认 15 分钟
 * @param {number} options.maxRequests - 最大请求数，默认 100 次
 * @param {Function} options.keyGenerator - 生成限制 key 的函数，默认基于 IP
 * @param {Array} options.whitelist - 白名单路径（不进行速率限制）
 * @param {Array} options.blacklist - 黑名单路径（更严格的限制）
 * @param {number} options.blacklistMaxRequests - 黑名单路径的最大请求数
 * @param {number} options.blacklistWindow - 黑名单路径的时间窗口（毫秒）
 */
export const createRedisRateLimiter = (options = {}) => {
  const {
    window = 15 * 60 * 1000,
    maxRequests = 100,
    keyGenerator = (ctx) => ctx.ip,
    whitelist = ['/api/health'],
    blacklist = ['/api/user/auth/login'],
    blacklistMaxRequests = 20,
    blacklistWindow = 60 * 1000
  } = options

  return async (ctx, next) => {
    const path = ctx.path

    // 白名单路径不限制
    if (whitelist.some((w) => path.startsWith(w))) {
      await next()
      return
    }

    // 判断是否使用更严格的限制
    const isBlacklisted = blacklist.some((b) => path.startsWith(b))
    const limit = isBlacklisted ? blacklistMaxRequests : maxRequests
    const windowMs = isBlacklisted ? blacklistWindow : window
    const windowName = isBlacklisted ? '1分钟' : '15分钟'

    const redis = getRedisClient()

    // Redis 不可用时降级放行
    if (!redis) {
      await next()
      return
    }

    const now = Date.now()
    const windowStart = now - windowMs
    const clientKey = keyGenerator(ctx)
    const redisKey = `${KEY_PREFIX}${clientKey}:${path}`

    try {
      // 滑动窗口算法（pipeline 减少 RTT）
      const pipeline = redis.pipeline()
      pipeline.zremrangebyscore(redisKey, 0, windowStart) // 清除过期记录
      pipeline.zadd(redisKey, now, `${now}:${Math.random()}`) // 添加当前请求
      pipeline.zcard(redisKey) // 统计窗口内请求数
      pipeline.expire(redisKey, Math.ceil(windowMs / 1000)) // 设置 key 过期
      const results = await pipeline.exec()

      // zcard 结果在 pipeline 第 3 个命令（index 2）
      const currentCount = results[2][1]
      const remaining = Math.max(0, limit - currentCount)
      const resetAt = Math.ceil((now + windowMs) / 1000)

      // 设置响应头
      ctx.set('X-RateLimit-Limit', String(limit))
      ctx.set('X-RateLimit-Remaining', String(remaining))
      ctx.set('X-RateLimit-Reset', String(resetAt))

      if (currentCount > limit) {
        ctx.status = 429
        ctx.set('Retry-After', String(Math.ceil(windowMs / 1000)))
        ctx.body = {
          code: 429,
          msg: `请求过于频繁，${windowName}内最多允许 ${limit} 次请求`,
          data: {
            retryAfter: Math.ceil(windowMs / 1000)
          }
        }
        return
      }
    } catch (err) {
      // Redis 操作失败时降级放行，不阻塞正常请求
      logger.warn({ err: { message: err.message } }, 'Redis rate limiter failed, passing request')
    }

    await next()
  }
}

/**
 * 默认 Redis 速率限制器
 * - 普通接口：15 分钟内最多 100 次
 * - 登录接口：1 分钟内最多 20 次
 */
export const redisRateLimiter = createRedisRateLimiter({
  window: 15 * 60 * 1000,
  maxRequests: 100,
  blacklist: ['/api/user/auth/login'],
  blacklistMaxRequests: 20,
  blacklistWindow: 60 * 1000
})

export default redisRateLimiter
