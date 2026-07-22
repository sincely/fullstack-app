import operationLogDao from '../modules/log/operationLogDao.js'
import loginLogDao from '../modules/log/loginLogDao.js'
import { randomUUID } from 'crypto'

/**
 * 解析 User-Agent 获取浏览器和操作系统信息
 */
const parseUserAgent = (userAgent) => {
  const browser = detectBrowser(userAgent)
  const os = detectOS(userAgent)
  return { browser, os }
}

const detectBrowser = (ua) => {
  if (!ua) return 'Unknown'

  if (ua.includes('Edg/')) return 'Microsoft Edge'
  if (ua.includes('Chrome/')) return 'Google Chrome'
  if (ua.includes('Firefox/')) return 'Mozilla Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari'
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer'

  return 'Unknown'
}

const detectOS = (ua) => {
  if (!ua) return 'Unknown'

  if (ua.includes('Windows NT')) {
    const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1]
    const versionMap = {
      '10.0': 'Windows 10/11',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7'
    }
    return versionMap[version] || 'Windows'
  }
  if (ua.includes('Macintosh') || ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'

  return 'Unknown'
}

/**
 * 获取客户端 IP 地址
 */
const getClientIp = (ctx) => {
  return (
    ctx.headers['x-forwarded-for'] ||
    ctx.headers['x-real-ip'] ||
    ctx.ip ||
    ctx.request.ip ||
    'Unknown'
  )
}

/**
 * 操作日志记录中间件
 * 记录需要认证的操作请求
 */
export const operationLogMiddleware = async (ctx, next) => {
  const startTime = Date.now()

  // 先执行请求
  await next()

  // 异步记录日志，不阻塞响应
  const executeTime = Date.now() - startTime

  // 只记录 POST/PUT/DELETE 等写操作
  const method = ctx.method.toUpperCase()
  const writeMethods = ['POST', 'PUT', 'DELETE', 'PATCH']

  if (!writeMethods.includes(method)) {
    return
  }

  // 忽略健康检查、静态资源和操作日志相关接口（避免循环记录）
  const path = ctx.path
  const whitelist = ['/api/health', '/api/log/']
  if (path.includes('/static/') || whitelist.some((p) => path.startsWith(p))) {
    return
  }

  try {
    const userId = ctx.state.user?.userId || null
    const username = ctx.state.user?.username || ''

    // 提取操作类型
    const action = extractAction(path, method)

    // 获取请求参数（脱敏处理）
    let requestParams = null
    if (ctx.request.body && Object.keys(ctx.request.body).length > 0) {
      const sanitizedBody = { ...ctx.request.body }
      // 脱敏密码字段
      if (sanitizedBody.password) {
        sanitizedBody.password = '***'
      }
      requestParams = sanitizedBody
    }

    // 判断操作状态
    const responseBody = ctx.body
    const status = responseBody?.code === 200 ? 1 : 0

    await operationLogDao.createOperationLog({
      userId,
      username,
      action,
      method,
      requestUrl: path,
      requestParams,
      responseStatus: String(responseBody?.code || ctx.status),
      responseMsg: responseBody?.msg || '',
      ipAddress: getClientIp(ctx),
      userAgent: ctx.headers['user-agent'] || '',
      executeTime,
      status
    })
  } catch (error) {
    // 日志记录失败不影响主流程
    console.error('记录操作日志失败:', error)
  }
}

/**
 * 登录日志记录中间件（用于登录接口）
 */
export const loginLogMiddleware = async (ctx, next) => {
  await next()

  try {
    const { username, loginType = 'password' } = ctx.request.body || {}
    const responseBody = ctx.body

    // 判断登录是否成功
    const isSuccess = responseBody?.code === 200

    // 获取用户 ID（如果登录成功）
    let userId = null
    let sessionId = null
    if (isSuccess && responseBody?.data?.userId) {
      userId = responseBody.data.userId
      sessionId = responseBody.data.sessionId || null
    }

    const userAgent = ctx.headers['user-agent'] || ''
    const { browser, os } = parseUserAgent(userAgent)

    await loginLogDao.createLoginLog({
      userId,
      username: username || '',
      loginType,
      ipAddress: getClientIp(ctx),
      location: '', // 可以后续接入 IP 地理位置服务
      browser,
      os,
      userAgent,
      status: isSuccess ? 1 : 0,
      message: responseBody?.msg || '',
      sessionId
    })
  } catch (error) {
    console.error('记录登录日志失败:', error)
  }
}

/**
 * 从 URL 中提取操作类型
 */
const extractAction = (path, method) => {
  const pathParts = path.split('/').filter(Boolean)
  const lastPart = pathParts[pathParts.length - 1] || ''

  // 根据路径关键词判断
  if (lastPart.includes('save') || lastPart.includes('create')) return '新增'
  if (lastPart.includes('update') || lastPart.includes('edit')) return '编辑'
  if (lastPart.includes('delete') || lastPart.includes('remove')) return '删除'
  if (lastPart.includes('reset') || lastPart.includes('refresh')) return '重置'
  if (lastPart.includes('login')) return '登录'
  if (lastPart.includes('logout')) return '登出'
  if (lastPart.includes('status')) return '状态变更'
  if (lastPart.includes('batch')) return '批量操作'
  if (lastPart.includes('clear')) return '清空'

  // 根据请求方法判断
  const methodMap = {
    POST: '新增',
    PUT: '编辑',
    DELETE: '删除',
    PATCH: '更新'
  }

  return methodMap[method] || method
}

export default {
  operationLogMiddleware,
  loginLogMiddleware
}
