/**
 * Redis 缓存工具模块
 * 
 * 提供两类缓存：
 *  1. 认证缓存（auth cache）  — 缓存 sessionId/sessionExpire，减少 MySQL 查询
 *  2. 权限缓存（perm cache）  — 缓存角色关联的菜单路径，减少 authorize 中间件查库
 * 
 * 所有方法在 Redis 不可用时优雅降级（返回 null / 不抛异常）
 */

import { getRedisClient } from '../db/redis.js'
import logger from '../config/logger.js'

// ─── Key 前缀 & TTL ─────────────────────────────────────

const AUTH_KEY_PREFIX = 'auth:user:'
const PERM_KEY_PREFIX = 'perm:role:'

const AUTH_TTL = 3600        // 认证缓存 1 小时
const PERM_TTL = 300         // 权限缓存 5 分钟

// ─── 内部工具 ────────────────────────────────────────────

/**
 * 安全获取 Redis 客户端，不可用时返回 null
 */
function safeGetRedis() {
  try {
    return getRedisClient()
  } catch {
    return null
  }
}

/**
 * 将 roleIds 数组/单值归一化为稳定的缓存 key
 * @param {number|string|number[]} roleIds
 * @returns {string}
 */
function normalizeRoleKey(roleIds) {
  if (Array.isArray(roleIds)) {
    return [...roleIds].sort((a, b) => a - b).join(',')
  }
  return String(roleIds)
}

// ═══════════════════════════════════════════════════════════
//  认证缓存 (Auth Cache)
//  Key: auth:user:{userId}
//  Value: { sessionId, sessionExpire }
//  TTL: 1 小时
// ═══════════════════════════════════════════════════════════

/**
 * 读取用户的认证缓存（sessionId + sessionExpire）
 * @param {number} userId
 * @returns {Promise<{ sessionId: string, sessionExpire: string } | null>}
 */
export async function getAuthCache(userId) {
  const redis = safeGetRedis()
  if (!redis) return null

  try {
    const data = await redis.get(`${AUTH_KEY_PREFIX}${userId}`)
    return data ? JSON.parse(data) : null
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Auth cache read failed')
    return null
  }
}

/**
 * 写入用户的认证缓存
 * @param {number} userId
 * @param {{ sessionId: string, sessionExpire: string }} data
 */
export async function setAuthCache(userId, data) {
  const redis = safeGetRedis()
  if (!redis) return

  try {
    await redis.setex(
      `${AUTH_KEY_PREFIX}${userId}`,
      AUTH_TTL,
      JSON.stringify(data)
    )
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Auth cache write failed')
  }
}

/**
 * 删除用户的认证缓存（登出 / 换设备登录时调用）
 * @param {number} userId
 */
export async function delAuthCache(userId) {
  const redis = safeGetRedis()
  if (!redis) return

  try {
    await redis.del(`${AUTH_KEY_PREFIX}${userId}`)
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Auth cache delete failed')
  }
}

// ═══════════════════════════════════════════════════════════
//  权限缓存 (Permission Cache)
//  Key: perm:role:{roleIds}   — roleIds 为排序后的逗号分隔字符串
//  Value: string[]            — 角色关联的 routePath 列表
//  TTL: 5 分钟
// ═══════════════════════════════════════════════════════════

/**
 * 读取角色权限缓存（菜单路径列表）
 * @param {number|string|number[]} roleIds
 * @returns {Promise<string[] | null>}
 */
export async function getPermCache(roleIds) {
  const redis = safeGetRedis()
  if (!redis) return null

  try {
    const key = `${PERM_KEY_PREFIX}${normalizeRoleKey(roleIds)}`
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Perm cache read failed')
    return null
  }
}

/**
 * 写入角色权限缓存
 * @param {number|string|number[]} roleIds
 * @param {string[]} routePaths - 菜单路径列表
 */
export async function setPermCache(roleIds, routePaths) {
  const redis = safeGetRedis()
  if (!redis) return

  try {
    const key = `${PERM_KEY_PREFIX}${normalizeRoleKey(roleIds)}`
    await redis.setex(key, PERM_TTL, JSON.stringify(routePaths))
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Perm cache write failed')
  }
}

/**
 * 删除指定角色的权限缓存
 * @param {number} roleId
 */
export async function delPermCacheByRole(roleId) {
  const redis = safeGetRedis()
  if (!redis) return

  try {
    await redis.del(`${PERM_KEY_PREFIX}${roleId}`)
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Perm cache delete failed')
  }
}

/**
 * 删除所有权限缓存（菜单变更时调用）
 * 使用 SCAN 而非 KEYS，避免阻塞 Redis
 */
export async function delAllPermCache() {
  const redis = safeGetRedis()
  if (!redis) return

  try {
    let cursor = '0'
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', `${PERM_KEY_PREFIX}*`, 'COUNT', 100)
      cursor = nextCursor
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } while (cursor !== '0')
  } catch (err) {
    logger.warn({ err: { message: err.message } }, 'Perm cache bulk delete failed')
  }
}

// ═══════════════════════════════════════════════════════════
//  缓存统计（供健康检查 / 监控使用）
// ═══════════════════════════════════════════════════════════

/**
 * 获取缓存统计信息
 * @returns {Promise<{ authKeys: number, permKeys: number }>}
 */
export async function getCacheStats() {
  const redis = safeGetRedis()
  if (!redis) return { authKeys: 0, permKeys: 0 }

  try {
    const [authKeys, permKeys] = await Promise.all([
      countKeys(redis, `${AUTH_KEY_PREFIX}*`),
      countKeys(redis, `${PERM_KEY_PREFIX}*`)
    ])
    return { authKeys, permKeys }
  } catch {
    return { authKeys: 0, permKeys: 0 }
  }
}

async function countKeys(redis, pattern) {
  let count = 0
  let cursor = '0'
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
    cursor = nextCursor
    count += keys.length
  } while (cursor !== '0')
  return count
}
