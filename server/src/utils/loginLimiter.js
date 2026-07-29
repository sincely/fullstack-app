/**
 * 登录防刷锁定工具
 *
 * 基于 Redis 实现按用户名维度的登录失败锁定：
 *  - 同一用户名连续失败 3 次后锁定 15 分钟
 *  - 登录成功后立即清除计数
 *
 * Redis Key: login:lock:{username} (String, TTL 900s)
 *
 * Redis 不可用时自动降级（跳过锁定检查，不阻塞登录）
 */

import { getRedisClient } from '../db/redis.js'
import logger from '../config/logger.js'

const KEY_PREFIX = 'login:lock:'
const MAX_ATTEMPTS = 3
const LOCK_WINDOW_SECONDS = 15 * 60 // 15 分钟

/**
 * 检查用户名是否被锁定
 * @param {string} username
 * @returns {Promise<{locked: boolean, attempts: number, remaining: number, retryAfter: number}>}
 */
export const checkLoginLock = async (username) => {
  const redis = getRedisClient()
  if (!redis) {
    return { locked: false, attempts: 0, remaining: MAX_ATTEMPTS, retryAfter: 0 }
  }

  try {
    const key = `${KEY_PREFIX}${username}`
    const attempts = Number(await redis.get(key)) || 0
    const locked = attempts >= MAX_ATTEMPTS

    if (locked) {
      const ttl = await redis.ttl(key)
      return {
        locked: true,
        attempts,
        remaining: 0,
        retryAfter: ttl > 0 ? ttl : LOCK_WINDOW_SECONDS
      }
    }

    return {
      locked: false,
      attempts,
      remaining: MAX_ATTEMPTS - attempts,
      retryAfter: 0
    }
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'checkLoginLock failed, skipping lock check')
    return { locked: false, attempts: 0, remaining: MAX_ATTEMPTS, retryAfter: 0 }
  }
}

/**
 * 记录一次登录失败
 * @param {string} username
 * @returns {Promise<{attempts: number, remaining: number, locked: boolean}>}
 */
export const recordLoginFailure = async (username) => {
  const redis = getRedisClient()
  if (!redis) {
    return { attempts: 0, remaining: MAX_ATTEMPTS, locked: false }
  }

  try {
    const key = `${KEY_PREFIX}${username}`
    const attempts = await redis.incr(key)

    // 首次失败时设置 TTL
    if (attempts === 1) {
      await redis.expire(key, LOCK_WINDOW_SECONDS)
    }

    // 达到上限时刷新 TTL（确保从最后一次失败开始计时）
    if (attempts >= MAX_ATTEMPTS) {
      await redis.expire(key, LOCK_WINDOW_SECONDS)
    }

    return {
      attempts,
      remaining: Math.max(0, MAX_ATTEMPTS - attempts),
      locked: attempts >= MAX_ATTEMPTS
    }
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'recordLoginFailure failed')
    return { attempts: 0, remaining: MAX_ATTEMPTS, locked: false }
  }
}

/**
 * 登录成功后清除锁定计数
 * @param {string} username
 */
export const clearLoginLock = async (username) => {
  const redis = getRedisClient()
  if (!redis) {
    return
  }

  try {
    await redis.del(`${KEY_PREFIX}${username}`)
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'clearLoginLock failed')
  }
}
