/**
 * 基于内存的速率限制中间件
 * 防止暴力攻击和频繁请求
 * 适用于单机部署，集群环境建议使用 Redis
 */

// 存储请求记录：Map<IP地址, Map<请求路径, 时间戳数组>>
const requestStore = new Map()

// 清理过期记录的定时器（每 5 分钟清理一次）
const CLEANUP_INTERVAL = 5 * 60 * 1000
setInterval(() => {
  const now = Date.now()
  for (const [ip, pathMap] of requestStore.entries()) {
    for (const [path, timestamps] of pathMap.entries()) {
      // 保留最近 10 分钟的记录
      const valid = timestamps.filter((t) => now - t < 10 * 60 * 1000)
      if (valid.length === 0) {
        pathMap.delete(path)
      } else {
        pathMap.set(path, valid)
      }
    }
    if (pathMap.size === 0) {
      requestStore.delete(ip)
    }
  }
}, CLEANUP_INTERVAL)

/**
 * 创建速率限制中间件
 * @param {Object} options 配置选项
 * @param {number} options.window - 时间窗口（毫秒），默认 15 分钟
 * @param {number} options.maxRequests - 最大请求数，默认 100 次
 * @param {Function} options.keyGenerator - 生成限制 key 的函数，默认基于 IP
 * @param {Array} options.whitelist - 白名单路径（不进行速率限制）
 * @param {Array} options.blacklist - 黑名单路径（更严格的限制）
 */
export const createRateLimiter = (options = {}) => {
  const {
    window = 15 * 60 * 1000, // 15 分钟
    maxRequests = 100, // 100 次请求
    keyGenerator = (ctx) => ctx.ip, // 基于 IP 限制
    whitelist = ['/api/health'], // 白名单
    blacklist = ['/api/login'], // 黑名单（更严格）
    blacklistMaxRequests = 20 // 黑名单路径的最大请求数
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
    const windowName = isBlacklisted ? '1分钟' : '15分钟'
    const windowTime = isBlacklisted ? 60 * 1000 : window

    const key = keyGenerator(ctx)
    const now = Date.now()

    // 初始化存储
    if (!requestStore.has(key)) {
      requestStore.set(key, new Map())
    }

    const pathMap = requestStore.get(key)

    if (!pathMap.has(path)) {
      pathMap.set(path, [])
    }

    const timestamps = pathMap.get(path)

    // 清理过期记录
    const validTimestamps = timestamps.filter((t) => now - t < windowTime)

    // 检查是否超过限制
    if (validTimestamps.length >= limit) {
      ctx.status = 429
      ctx.body = {
        code: 429,
        msg: `请求过于频繁，${windowName}内最多允许 ${limit} 次请求`,
        data: {
          retryAfter: Math.ceil((validTimestamps[0] + windowTime - now) / 1000)
        }
      }
      ctx.set('Retry-After', String(Math.ceil((validTimestamps[0] + windowTime - now) / 1000)))
      return
    }

    // 记录本次请求
    validTimestamps.push(now)
    pathMap.set(path, validTimestamps)

    // 设置响应头
    ctx.set('X-RateLimit-Limit', String(limit))
    ctx.set('X-RateLimit-Remaining', String(limit - validTimestamps.length - 1))
    ctx.set('X-RateLimit-Reset', String(Math.ceil((validTimestamps[0] + windowTime) / 1000)))

    await next()
  }
}

/**
 * 默认速率限制器
 * - 普通接口：15 分钟内最多 100 次
 * - 登录接口：1 分钟内最多 20 次
 */
export const rateLimiter = createRateLimiter({
  window: 15 * 60 * 1000,
  maxRequests: 100,
  blacklist: ['/api/login'],
  blacklistMaxRequests: 20
})

export default rateLimiter
