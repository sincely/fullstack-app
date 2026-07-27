/**
 * 安全响应头中间件
 * 设置各种 HTTP 安全头，增强应用安全性
 */

export const securityHeaders = async (ctx, next) => {
  // 1. HSTS - HTTP 严格传输安全（强制 HTTPS）
  ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // 2. X-Frame-Options - 防止点击劫持（禁止嵌入 iframe）
  ctx.set('X-Frame-Options', 'DENY')

  // 3. X-Content-Type-Options - 防止 MIME 类型嗅探
  ctx.set('X-Content-Type-Options', 'nosniff')

  // 4. X-XSS-Protection - XSS 防护（旧版浏览器）
  ctx.set('X-XSS-Protection', '0') // 现代浏览器建议设为 0，使用 CSP

  // 5. Referrer-Policy - 控制引用来源信息
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 6. Content-Security-Policy - 内容安全策略（防止 XSS 等攻击）
  // Swagger UI 需要加载 CDN 资源，对 /docs 路径放宽策略
  const isDocsPage = ctx.path === '/docs' || ctx.path.startsWith('/docs/')
  ctx.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'" + (isDocsPage ? " https://cdnjs.cloudflare.com" : "") + "; " +
      "script-src-elem 'self' 'unsafe-inline'" + (isDocsPage ? " https://cdnjs.cloudflare.com" : "") + "; " +
      "style-src 'self' 'unsafe-inline'" + (isDocsPage ? " https://fonts.googleapis.com https://cdnjs.cloudflare.com" : "") + "; " +
      "style-src-elem 'self' 'unsafe-inline'" + (isDocsPage ? " https://fonts.googleapis.com https://cdnjs.cloudflare.com" : "") + "; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:" + (isDocsPage ? " https://fonts.gstatic.com" : "") + "; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'"
  )

  // 7. Permissions-Policy - 控制浏览器功能权限
  ctx.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )

  // 8. Cache-Control - 控制缓存策略（敏感数据不缓存）
  if (ctx.path.startsWith('/api/')) {
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', '0')
  }

  await next()
}

export default securityHeaders
