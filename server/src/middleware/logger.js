import pinoHttp from 'pino-http'
import logger from '../config/logger.js'

const httpLogger = pinoHttp({
  logger,
  // 直接传给 pino-http 的序列化器，覆盖 pino-std-serializers 的默认行为（避免输出完整 headers）
  serializers: {
    req(req) {
      return { method: req.method, url: req.url, remoteAddress: req.remoteAddress, remotePort: req.remotePort }
    },
    res(res) {
      return { statusCode: res.statusCode, body: res._body }
    }
  },
  customLogLevel: function (req, res, err) {
    // 不记录 /docs（Swagger UI）相关的访问日志
    if (req.url && req.url.startsWith('/docs')) {
      return 'silent'
    }
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent'
    }
    return 'info'
  },
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return 'resource not found'
    }
    return `${req.method} ${req.url}`
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} - ${err.message}`
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'duration'
  }
})

export default async (ctx, next) => {
  httpLogger(ctx.req, ctx.res)
  ctx.log = ctx.req.log

  // 拦截 res.end()，确保 _body 在响应真正结束时已挂载（koa-compress 会包裹 transform 流，
  // 导致 middleware 内的 after-next 赋值时序不可靠）
  const origEnd = ctx.res.end.bind(ctx.res)
  ctx.res.end = function (...args) {
    ctx.res._body = ctx.body
    return origEnd(...args)
  }

  await next()

  // 将 Koa 解析的 query 和 body 挂载到原生 req 对象上
  ctx.req.query = ctx.request.query
  ctx.req.body = ctx.request.body
}
