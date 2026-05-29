import { AsyncLocalStorage } from 'node:async_hooks'

/**
 * 请求级异步上下文存储（Node 16.4+ 原生）
 * 用于在异步调用链中保持 requestId、ip 等上下文信息
 */
export const asyncLocalStorage = new AsyncLocalStorage()

/**
 * 获取当前异步上下文中的存储数据
 * @returns {{ requestId?: string, ip?: string } | undefined}
 */
export const getAsyncStore = () => asyncLocalStorage.getStore()

/**
 * 全局错误捕获中间件
 * - 放在所有路由和中间件之前，确保洋葱模型最外层兜底
 * - 使用 AsyncLocalStorage 绑定请求上下文，解决多请求并发时日志关联问题
 * - 触发 ctx.app.emit('error') 供应用级错误监听处理
 */
export default async function errorCatch(ctx, next) {
  const requestId = ctx.state?.requestId || ctx.headers['x-request-id'] || 'unknown'
  await asyncLocalStorage.run({ requestId, ip: ctx.ip }, async () => {
    try {
      await next()
    } catch (err) {
      // 标记已处理，防止 Koa 默认 500 响应覆盖
      const status = err.statusCode || err.status || 500
      ctx.status = status

      // 5xx 错误不暴露内部细节，防止泄露数据库结构/文件路径等敏感信息
      const isServerError = status >= 500
      ctx.body = {
        code: err.code || String(status),
        msg: isServerError ? '服务器内部错误，请联系管理员' : err.message || '请求处理失败',
        requestId
      }

      // 触发应用级错误监听（由 app.js 中的 app.on('error') 处理日志）
      ctx.app.emit('error', err, ctx)
    }
  })
}
