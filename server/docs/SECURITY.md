# 服务端安全策略配置

## 📋 安全策略概览

本项目已实现多层安全防护策略，确保应用的安全性。

---

## 🔐 1. HTTP 安全响应头

### 配置位置
`server/src/middleware/securityHeaders.js`

### 安全头列表

| 安全头 | 值 | 作用 |
|--------|-----|------|
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` | HSTS 强制 HTTPS，有效期 1 年 |
| **X-Frame-Options** | `DENY` | 禁止 iframe 嵌入，防止点击劫持 |
| **X-Content-Type-Options** | `nosniff` | 禁止 MIME 类型嗅探 |
| **X-XSS-Protection** | `0` | 禁用旧版 XSS 过滤（使用 CSP） |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | 控制引用来源信息 |
| **Content-Security-Policy** | 自定义策略 | 内容安全策略，防止 XSS 等攻击 |
| **Permissions-Policy** | `camera=(), microphone=(), ...` | 禁用不必要的浏览器功能 |
| **Cache-Control** | `no-store, no-cache, ...` | API 响应不缓存敏感数据 |

### CSP 策略说明

```javascript
default-src 'self'              // 默认只允许同源资源
script-src 'self' 'unsafe-inline' 'unsafe-eval'  // 脚本来源
style-src 'self' 'unsafe-inline'  // 样式来源
img-src 'self' data: https:     // 图片来源
font-src 'self' data:           // 字体来源
connect-src 'self' https:       // AJAX/WebSocket 来源
frame-ancestors 'none'          // 禁止被 iframe 嵌套
base-uri 'self'                 // 限制 <base> 标签
form-action 'self'              // 限制表单提交目标
```

### 自定义配置

根据实际需求调整 CSP 策略：

```javascript
// 允许第三方统计脚本
script-src 'self' 'unsafe-inline' https://www.google-analytics.com

// 允许图片 CDN
img-src 'self' https://cdn.yourdomain.com data:
```

---

## 🛡️ 2. 速率限制（Rate Limiting）

### 配置位置
`server/src/middleware/rateLimiter.js`

### 默认策略

| 接口类型 | 时间窗口 | 最大请求数 | 说明 |
|---------|---------|-----------|------|
| **普通接口** | 15 分钟 | 100 次 | 正常业务请求 |
| **登录接口** | 1 分钟 | 20 次 | 防止暴力破解 |
| **健康检查** | 不限制 | - | 监控服务 |

### 响应头

```
X-RateLimit-Limit: 100          // 限制总数
X-RateLimit-Remaining: 95       // 剩余次数
X-RateLimit-Reset: 1640000000   // 重置时间戳
Retry-After: 30                 // 重试等待时间（秒）
```

### 自定义配置

```javascript
import { createRateLimiter } from './middleware/rateLimiter.js'

// 更严格的限制
const strictLimiter = createRateLimiter({
  window: 5 * 60 * 1000,      // 5 分钟
  maxRequests: 50,             // 50 次
  blacklist: ['/api/password-reset'],
  blacklistMaxRequests: 5      // 密码重置：1 分钟 5 次
})

// 应用到特定路由
router.post('/password-reset', strictLimiter, handler)
```

### 注意事项

- ⚠️ 当前基于**内存**存储，适用于单机部署
- 🔄 集群环境建议使用 **Redis** 实现分布式限流
- 📊 内存会自动清理过期记录，无需手动维护

---

## 🌐 3. CORS 跨域配置

### 配置位置
`server/src/config/cors.js`

### 开发环境

```javascript
// 允许所有源（仅开发环境）
if (process.env.NODE_ENV === 'development') {
  return origin || '*'
}
```

### 生产环境

```javascript
// 域名白名单
const PROD_WHITELIST = [
  'http://localhost:9528',
  'http://localhost:3000',
  'http://127.0.0.1:9528',
  'https://yourdomain.com',           // 替换为你的域名
  'https://admin.yourdomain.com'      // 后台管理域名
]
```

### 环境变量配置

```bash
# .env 文件
CORS_WHITELIST=https://yourdomain.com,https://admin.yourdomain.com
```

### 允许的请求方法和头

```javascript
allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
allowHeaders: [
  'Content-Type',
  'Authorization',
  'Accept',
  'x-access-token',
  'x-request-id'
]
```

---

## 📦 4. 请求体限制

### 配置位置
`server/src/config/koaBodyConfig.js`

### 限制配置

| 类型 | 限制大小 | 说明 |
|------|---------|------|
| **JSON** | 10 MB | API 请求体 |
| **Form** | 10 MB | 表单数据 |
| **文件上传** | 10 MB | 单个文件大小 |

### 安全建议

根据实际业务调整限制大小：

```javascript
// 小型 API 服务
jsonLimit: '2mb',
formLimit: '2mb',
maxFileSize: 5 * 1024 * 1024  // 5MB

// 文件上传服务
jsonLimit: '5mb',
maxFileSize: 50 * 1024 * 1024  // 50MB
```

---

## 🔑 5. JWT 安全配置

### 配置位置
`server/src/config/jwt.js`

### 建议配置

```javascript
export default {
  secret: process.env.JWT_SECRET,           // 环境变量
  expiresIn: '2h',                          // Access Token 有效期
  refreshExpiresIn: '7d'                    // Refresh Token 有效期
}
```

### 环境变量

```bash
# .env
JWT_SECRET=your-super-secret-key-at-least-32-chars
SESSION_SECRET=your-session-secret-key
```

### 安全建议

- ✅ JWT_SECRET 至少 32 字符
- ✅ 生产环境必须使用环境变量
- ✅ 定期更换密钥
- ✅ Access Token 有效期不超过 2 小时

---

## 🗂️ 6. 会话安全

### 配置位置
`server/src/app.js`

### 会话配置

```javascript
session({
  key: 'koa.sess',
  maxAge: 86400000,        // 24 小时
  httpOnly: true,          // 禁止 JS 访问（防止 XSS）
  signed: true,            // 签名验证
  renew: true              // 自动续期
}, app)
```

### 安全特性

- ✅ `httpOnly: true` - 防止 XSS 窃取 Session
- ✅ `signed: true` - 防止 Session 篡改
- ✅ `renew: true` - 活跃用户自动续期

---

## 📝 7. 请求日志

### 配置位置
`server/src/middleware/logMiddleware.js`

### 记录内容

- 用户 ID 和用户名
- 操作类型（新增/编辑/删除）
- 请求方法和 URL
- 请求参数（密码脱敏）
- 响应状态
- IP 地址
- 执行时间

### 密码脱敏

```javascript
// 自动脱敏
if (sanitizedBody.password) {
  sanitizedBody.password = '***'
}
```

---

## 🔒 8. 认证和授权

### 认证中间件
`server/src/middleware/authenticate.js`

- JWT Token 验证
- Access Token 校验
- Token 过期处理

### 授权中间件
`server/src/middleware/authorize.js`

- RBAC 角色权限控制
- 动态菜单权限
- 路由级别权限校验

---

## 🚨 9. 错误处理

### 配置位置
`server/src/middleware/error.js`

### 安全特性

- ✅ 捕获所有未处理异常
- ✅ 不暴露敏感信息（堆栈、SQL 等）
- ✅ 统一错误响应格式
- ✅ 记录错误日志

### 生产环境

```javascript
// 不暴露详细错误信息
if (process.env.NODE_ENV === 'production') {
  errorDetails = 'Internal Server Error'
}
```

---

## 📊 10. 安全检查清单

### 部署前检查

- [ ] JWT_SECRET 已更换为强密钥
- [ ] CORS 白名单已配置生产域名
- [ ] 数据库密码使用环境变量
- [ ] 生产环境启用 HTTPS
- [ ] 日志文件权限已设置
- [ ] 速率限制已启用
- [ ] 错误日志正常输出

### 运行时监控

- [ ] 429 错误频率（暴力攻击）
- [ ] 401 错误频率（未授权访问）
- [ ] 403 错误频率（权限拒绝）
- [ ] API 响应时间异常
- [ ] 错误日志增长趋势

---

## 🔧 自定义安全策略

### 添加自定义安全头

```javascript
// server/src/middleware/securityHeaders.js
ctx.set('X-Custom-Header', 'value')
```

### 添加 IP 黑名单

```javascript
const BLACKLIST = ['192.168.1.100']

export const ipBlacklist = async (ctx, next) => {
  if (BLACKLIST.includes(ctx.ip)) {
    ctx.status = 403
    ctx.body = { code: 403, msg: 'IP 已被封禁' }
    return
  }
  await next()
}
```

### 添加 CSRF 防护

对于需要 CSRF 保护的表单提交：

```javascript
import csrf from 'koa-csrf'

const csrfProtection = new csrf({
  invalidSessionTokenMessage: 'CSRF token invalid',
  invalidTokenMessage: 'CSRF token invalid'
})

app.use(csrfProtection)
```

---

## 📚 参考资料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-best-practices)
- [HTTP Security Headers](https://securityheaders.com/)

---

## ⚠️ 注意事项

1. **生产环境必须使用 HTTPS**
2. **定期更新依赖包版本**
3. **监控安全日志**
4. **定期更换密钥**
5. **遵循最小权限原则**
