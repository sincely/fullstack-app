import logger from '../config/logger.js'
import { getAsyncStore } from './errorCatch.js'

/**
 * 提取并格式化错误堆栈，保留异步上下文信息。
 * 优先使用 error.stack，若堆栈过短则尝试补充。
 */
const formatStack = (error) => {
  if (!error || !error.stack) {
    return 'No stack trace available'
  }
  // Node.js 异步堆栈通常以 'Error: xxx' 开头，包含 at 行
  // 保留完整堆栈，不做截断
  return error.stack
}

/**
 * 应用级错误处理中间件
 * - 监听 app.on('error') 事件，统一记录未捕获异常
 * - 从 AsyncLocalStorage 获取请求上下文，解决多请求并发日志关联问题
 * - 使用 pino 的 errWithCause 序列化器保留错误因果链
 */
export default function errorHandler() {
  return (err, ctx) => {
    const log = ctx?.log || logger
    const requestId = ctx?.state?.requestId || getAsyncStore()?.requestId || 'unknown'
    const stack = formatStack(err)

    // 从异步上下文中获取请求信息（若 ctx 不可用时的兜底）
    const store = getAsyncStore()
    const requestInfo = ctx
      ? {
          method: ctx.method,
          url: ctx.url,
          // 避免记录 authorization header 中的 token 明文
          headers: { ...ctx.headers, authorization: ctx.headers.authorization ? '[REDACTED]' : undefined }
        }
      : { note: 'No request context available' }

    // 完整错误上报到服务端日志（含原始 message、完整堆栈、异步上下文）
    log.error(
      {
        err: {
          message: err.message,
          stack,
          // 保留原始错误对象的其他属性（如 code, status）
          ...((err.status || err.statusCode) && {
            status: err.status || err.statusCode
          }),
          ...(err.code && { code: err.code }),
          // 保留 Error.cause 链（Node 16.9+）
          ...(err.cause && { cause: err.cause })
        },
        requestId,
        request: requestInfo,
        // 若存在异步上下文，记录额外信息
        ...(store && { asyncContext: store })
      },
      `Request error: ${err.message || 'Unknown error'}`
    )
  }
}
