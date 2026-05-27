// 生产环境允许的域名白名单
const PROD_WHITELIST = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(',')
  : [
      'http://localhost:9528',
      'http://localhost:3000',
      'http://127.0.0.1:9528'
    ]

export default {
  origin: function (ctx) {
    const origin = ctx.get('Origin')

    // 开发环境：允许所有源
    if (process.env.NODE_ENV === 'development') {
      return origin || '*'
    }

    // 生产环境：只允许白名单中的域名
    if (PROD_WHITELIST.includes(origin)) {
      return origin
    }

    return '' // 不在白名单内的拒绝跨域
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'X-Request-Id'],
  maxAge: 86400, // 预检请求有效期（秒）：24小时
  credentials: true, // 允许发送 cookies
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 允许的请求方法
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'x-access-token',
    'x-request-id'
  ] // 允许的请求头
}
