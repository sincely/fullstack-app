import operationLogDao from '../modules/log/operationLogDao.js'
import loginLogDao from '../modules/log/loginLogDao.js'
import { randomUUID } from 'crypto'
import logger from '../config/logger.js'
import { getIpLocation } from '../utils/ipLocation.js'

/**
 * 解析 User-Agent 获取浏览器和操作系统信息
 */
const parseUserAgent = (user_agent) => {
  const browser = detectBrowser(user_agent)
  const os = detectOS(user_agent)
  return { browser, os }
}

const detectBrowser = (ua) => {
  if (!ua) {
    return 'Unknown'
  }

  if (ua.includes('Edg/')) {
    return 'Microsoft Edge'
  }
  if (ua.includes('Chrome/')) {
    return 'Google Chrome'
  }
  if (ua.includes('Firefox/')) {
    return 'Mozilla Firefox'
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    return 'Safari'
  }
  if (ua.includes('MSIE') || ua.includes('Trident/')) {
    return 'Internet Explorer'
  }

  return 'Unknown'
}

const detectOS = (ua) => {
  if (!ua) {
    return 'Unknown'
  }

  if (ua.includes('Windows NT')) {
    const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1]
    const versionMap = {
      '10.0': 'Windows 10/11',
      6.3: 'Windows 8.1',
      6.2: 'Windows 8',
      6.1: 'Windows 7'
    }
    return versionMap[version] || 'Windows'
  }
  if (ua.includes('Macintosh') || ua.includes('Mac OS X')) {
    return 'macOS'
  }
  if (ua.includes('Linux')) {
    return 'Linux'
  }
  if (ua.includes('Android')) {
    return 'Android'
  }
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    return 'iOS'
  }

  return 'Unknown'
}

/**
 * 获取客户端 IP 地址
 * 优先读取代理头（X-Forwarded-For / X-Real-IP），取第一个非内网 IP
 */
const getClientIp = (ctx) => {
  const forwardedFor = ctx.headers['x-forwarded-for']
  if (forwardedFor) {
    // X-Forwarded-For 可能是 "client, proxy1, proxy2"，取第一个
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) {
      return firstIp
    }
  }

  const realIp = ctx.headers['x-real-ip']
  if (realIp) {
    return realIp.trim()
  }

  return ctx.ip || ctx.request.ip || 'Unknown'
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
  const execute_time = Date.now() - startTime

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

    // 提取系统模块
    const module = extractModule(path)

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
      user_id: userId,
      username,
      action,
      module,
      method,
      request_params: requestParams,
      responseStatus: String(responseBody?.code || ctx.status),
      response_msg: responseBody?.msg || '',
      response_body: responseBody ? JSON.stringify(responseBody) : null,
      ipAddress: getClientIp(ctx),
      user_agent: ctx.headers['user-agent'] || '',
      executeTime: execute_time,
      status
    })
  } catch (error) {
    // 日志记录失败不影响主流程
    logger.error({ err: { message: error.message } }, '记录操作日志失败')
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
    const loginIp = getClientIp(ctx)
    const location = await getIpLocation(loginIp)

    await loginLogDao.createLoginLog({
      user_id: userId,
      username: username || '',
      login_type: loginType,
      ip_address: loginIp,
      location,
      browser,
      os,
      user_agent: userAgent,
      status: isSuccess ? 1 : 0,
      message: responseBody?.msg || '',
      session_id: sessionId
    })
  } catch (error) {
    logger.error({ err: { message: error.message } }, '记录登录日志失败')
  }
}

/**
 * 从 URL 中提取系统模块
 */
const extractModule = (path) => {
  const parts = path.split('/').filter(Boolean)
  // /api/systemManage/xxx 根据子路径关键词区分
  if (parts[1] === 'systemManage') {
    const last = parts[parts.length - 1] || ''
    if (last.toLowerCase().includes('user')) {
      return '用户管理'
    }
    if (last.toLowerCase().includes('role')) {
      return '角色管理'
    }
    if (last.toLowerCase().includes('menu')) {
      return '菜单管理'
    }
    return '系统管理'
  }
  const moduleMap = {
    user: '用户认证',
    route: '路由管理',
    log: '日志管理'
  }
  return moduleMap[parts[1]] || '其他'
}

/**
 * 从 URL 中提取操作类型
 */
const extractAction = (path, method) => {
  const pathParts = path.split('/').filter(Boolean)
  const lastPart = pathParts[pathParts.length - 1] || ''

  // 根据路径关键词判断
  if (lastPart.includes('save') || lastPart.includes('create')) {
    return '新增'
  }
  if (lastPart.includes('update') || lastPart.includes('edit')) {
    return '编辑'
  }
  if (lastPart.includes('delete') || lastPart.includes('remove')) {
    return '删除'
  }
  if (lastPart.includes('reset') || lastPart.includes('refresh')) {
    return '重置'
  }
  if (lastPart.includes('login')) {
    return '登录'
  }
  if (lastPart.includes('logout')) {
    return '登出'
  }
  if (lastPart.includes('status')) {
    return '状态变更'
  }
  if (lastPart.includes('batch')) {
    return '批量操作'
  }
  if (lastPart.includes('clear')) {
    return '清空'
  }

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
