/**
 * Redis Session Store for koa-session
 * 
 * 实现 koa-session 的外部存储接口，使用 Redis 存储 session 数据
 * 
 * 特性：
 * - 支持多进程/多机部署（中心化存储）
 * - 自动过期（TTL）
 * - 优雅降级（Redis 不可用时不阻塞请求）
 * 
 * koa-session 外部存储接口要求：
 * - get(key, maxAge, { rolling }) -> session data
 * - set(key, sess, maxAge, { rolling, changed }) -> void
 * - destroy(key) -> void
 */

import logger from '../config/logger.js'

const KEY_PREFIX = 'sess:'

/**
 * Redis Session Store 类
 */
export class RedisSessionStore {
  /**
   * @param {import('ioredis').Redis} redis - ioredis 客户端实例
   */
  constructor(redis) {
    this.redis = redis
  }

  /**
   * 获取完整的 Redis key
   * @param {string} key - session key
   * @returns {string}
   */
  _getKey(key) {
    return `${KEY_PREFIX}${key}`
  }

  /**
   * 获取 session 数据
   * @param {string} key - session key
   * @param {number} maxAge - 最大存活时间（毫秒）
   * @param {object} options - { rolling: boolean }
   * @returns {Promise<object|null>}
   */
  async get(key, maxAge, { rolling }) {
    const redisKey = this._getKey(key)
    
    try {
      const data = await this.redis.get(redisKey)
      
      if (!data) {
        return null
      }

      // 如果 rolling=true，刷新 TTL
      if (rolling && maxAge) {
        const ttlSeconds = Math.ceil(maxAge / 1000)
        await this.redis.expire(redisKey, ttlSeconds)
      }

      return JSON.parse(data)
    } catch (err) {
      logger.error({ err: { message: err.message, code: err.code } }, 'Redis session get failed')
      return null // 优雅降级：返回 null，让 koa-session 创建新 session
    }
  }

  /**
   * 设置 session 数据
   * @param {string} key - session key
   * @param {object} sess - session 数据
   * @param {number} maxAge - 最大存活时间（毫秒）
   * @param {object} options - { rolling: boolean, changed: boolean }
   * @returns {Promise<void>}
   */
  async set(key, sess, maxAge, { rolling, changed }) {
    const redisKey = this._getKey(key)
    
    try {
      // 如果没有变化且不是 rolling 模式，跳过写入（减少 Redis 压力）
      if (!changed && !rolling) {
        return
      }

      const data = JSON.stringify(sess)
      const ttlSeconds = maxAge ? Math.ceil(maxAge / 1000) : 86400 // 默认 1 天

      await this.redis.setex(redisKey, ttlSeconds, data)
    } catch (err) {
      logger.error({ err: { message: err.message, code: err.code } }, 'Redis session set failed')
      // 优雅降级：不抛出异常，允许请求继续
    }
  }

  /**
   * 销毁 session
   * @param {string} key - session key
   * @returns {Promise<void>}
   */
  async destroy(key) {
    const redisKey = this._getKey(key)
    
    try {
      await this.redis.del(redisKey)
    } catch (err) {
      logger.error({ err: { message: err.message, code: err.code } }, 'Redis session destroy failed')
      // 优雅降级
    }
  }
}

/**
 * 创建 Redis Session Store 实例
 * 
 * @param {import('ioredis').Redis} redis - ioredis 客户端
 * @returns {RedisSessionStore}
 */
export function createRedisSessionStore(redis) {
  return new RedisSessionStore(redis)
}

export default { RedisSessionStore, createRedisSessionStore }
