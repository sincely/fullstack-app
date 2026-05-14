/**
 * 登录速率限制中间件（已禁用 Redis 依赖）
 * 当前为空实现，直接放行所有请求
 * 如需启用限流功能，请配置 Redis 后恢复原实现
 */

export const loginRateLimiter = async (ctx, next) => {
  await next()
}

export default loginRateLimiter