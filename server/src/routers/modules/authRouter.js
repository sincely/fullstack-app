import Router from '@koa/router'
import { randomUUID } from 'crypto'
import authDao from '../../services/authDao.js'
import permissionDao from '../../services/permissionDao.js'
import loginLogDao from '../../services/loginLogDao.js'
import authenticate from '../../middleware/authenticate.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { loginBodySchema } from '../../schemas/models/authSchema.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { comparePassword } from '../../utils/password.js'
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { query } from '../../utils/db.js'

const authRouter = new Router()

const parseRoleIds = (value, fallbackRoleId) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => Number(item))
      .filter(Boolean)
  }

  return fallbackRoleId ? [Number(fallbackRoleId)] : []
}

const parseRoleNames = (value, fallbackRoleName) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return fallbackRoleName ? [fallbackRoleName] : []
}

const parseRoleCodes = (value, fallbackRoleCode) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return fallbackRoleCode ? [fallbackRoleCode] : []
}

// 前端兼容接口 - 登录
const frontendLogin = async (ctx) => {
  // 前端发送 userName 参数，后端使用 username
  const { userName, password } = ctx.request.body
  const username = userName
  const loginType = 'password'
  // 注意： 如果应用部署在Nginx后面，需要确保Nginx正确配置了转发请求头：
//   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//  proxy_set_header X-Real-IP $remote_addr;

  const loginIp =
      ctx.headers['x-forwarded-for'] ||
      ctx.headers['x-real-ip'] ||
      ctx.ip ||
      ctx.request.ip ||
      'unknown'
  const userAgent = ctx.headers['user-agent'] || ''

  const user = await authDao.findAdminUserByUsername(username)
  if (!user) {
    // 记录登录失败日志
    await loginLogDao.createLoginLog({
      userId: null,
      username,
      loginType,
      ipAddress: loginIp,
      location: '',
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      userAgent,
      status: 0,
      message: businessMsg[businessCode.userLoginFail],
      sessionId: null
    })

    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  if (Number(user.status) !== 1) {
    // 记录账号禁用登录失败日志
    await loginLogDao.createLoginLog({
      userId: user.id,
      username,
      loginType,
      ipAddress: loginIp,
      location: '',
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      userAgent,
      status: 0,
      message: businessMsg[businessCode.adminUserDisabled],
      sessionId: null
    })

    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.adminUserDisabled,
      msg: businessMsg[businessCode.adminUserDisabled]
    }
    return
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    // 记录密码错误日志
    await loginLogDao.createLoginLog({
      userId: user.id,
      username,
      loginType,
      ipAddress: loginIp,
      location: '',
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      userAgent,
      status: 0,
      message: businessMsg[businessCode.userLoginFail],
      sessionId: null
    })

    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  // 生成会话 ID 和记录登录信息
  const sessionId = randomUUID()

  // 计算会话过期时间（默认 7 天）
  const sessionExpire = new Date()
  sessionExpire.setDate(sessionExpire.getDate() + 7)

  const payload = {
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleIds: parseRoleIds(user.roleIds, user.roleId),
    roleCode: user.roleCode,
    roleCodes: parseRoleCodes(user.roleCodes, user.roleCode),
    roleName: user.roleName,
    roleNames: parseRoleNames(user.roleNames, user.roleName),
    sessionId // 添加 sessionId 到 JWT payload，用于单设备登录控制
  }

  const token = generateToken(payload)
  const refreshToken = generateRefreshToken(payload)

  // 将 sessionId、登录信息等写入用户表，实现单设备登录控制
  const sql = `
    UPDATE Users SET
      sessionId = ?,
      currentRefreshToken = ?,
      loginIp = ?,
      loginTime = NOW(),
      sessionExpire = ?
    WHERE id = ?
  `
  await query(sql, [
    sessionId,
    refreshToken,
    loginIp,
    sessionExpire,
    user.id
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '登录成功',
    data: {
      userId: user.id,
      token,
      refreshToken,
      sessionId
    }
  }

  // 记录登录成功日志
  await loginLogDao.createLoginLog({
    userId: user.id,
    username,
    loginType,
    ipAddress: loginIp,
    location: '',
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    userAgent,
    status: 1,
    message: '登录成功',
    sessionId
  })
}

// 解析 User-Agent 的辅助函数
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

authRouter.post('/user/auth/login', validateBody(loginBodySchema), errorControllerWrapper(frontendLogin))

// 前端兼容接口 - 获取用户信息
const frontendGetUserInfo = async (ctx) => {
  const currentUser = await authDao.findAdminUserById(ctx.state.user.userId)
  if (!currentUser) {
    ctx.status = httpCode.unauthorized
    ctx.body = {
      code: businessCode.userNotFound,
      msg: businessMsg[businessCode.userNotFound]
    }
    return
  }

  // 获取用户按钮权限
  const roleIds = parseRoleIds(currentUser.roleIds, currentUser.roleId)
  const roleCodes = parseRoleCodes(currentUser.roleCodes, currentUser.roleCode)
  const buttons = await permissionDao.findButtonsByRoleId(roleIds)
  const buttonCodes = buttons.map((b) => b.buttonName)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户信息成功',
    data: {
      userId: currentUser.id,
      userName: currentUser.username,
      roles: roleCodes,
      buttons: buttonCodes
    }
  }
}

authRouter.get('/user/getUserInfo', authenticate, errorControllerWrapper(frontendGetUserInfo))

// 前端兼容接口 - 刷新 token
authRouter.post(
  '/user/auth/refreshToken',
  errorControllerWrapper(async (ctx) => {
    const { refreshToken } = ctx.request.body

    // 检查是否提供了refreshToken
    if (!refreshToken) {
      ctx.status = httpCode.ok
      ctx.body = {
        code: businessCode.paramError,
        msg: '缺少refreshToken参数'
      }
      return
    }

    try {
      // 验证refreshToken是否有效
      const decoded = verifyRefreshToken(refreshToken)

      // 单设备登录控制：校验用户表中的 currentRefreshToken 是否匹配
      const currentRefreshToken = await authDao.getUserRefreshToken(decoded.userId)
      if (currentRefreshToken !== refreshToken) {
        ctx.status = httpCode.ok
        ctx.body = {
          code: businessCode.accountKicked,
          msg: businessMsg[businessCode.accountKicked]
        }
        return
      }

      const payload = {
        userId: decoded.userId,
        username: decoded.username,
        roleId: decoded.roleId,
        roleIds: decoded.roleIds,
        roleCode: decoded.roleCode,
        roleCodes: decoded.roleCodes,
        roleName: decoded.roleName,
        roleNames: decoded.roleNames
      }

      // 生成新的token和refreshToken（轮换 Refresh Token）
      const newToken = generateToken(payload)
      const newRefreshToken = generateRefreshToken(payload)

      // 更新用户表中的 currentRefreshToken
      await authDao.updateUserRefreshToken(decoded.userId, newRefreshToken)

      ctx.status = httpCode.ok
      ctx.body = {
        code: businessCode.success,
        msg: '刷新成功',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      }
    } catch (err) {
      // 如果refreshToken过期或无效，返回登出类错误码，避免前端无限重试
      ctx.status = httpCode.ok
      ctx.body = {
        code: businessCode.accountKicked, // 统一返回 1002，确保旧设备被踢出
        msg: businessMsg[businessCode.accountKicked] || 'Token 已过期，请重新登录'
      }
    }
  })
)

// 登出（清除用户 sessionId 和 currentRefreshToken）
authRouter.post(
  '/user/auth/logout',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const userId = ctx.state.user?.userId
    if (userId) {
      // 清除 sessionId、refreshToken 和会话信息
      const sql = `
        UPDATE Users SET
          sessionId = NULL,
          currentRefreshToken = NULL,
          loginIp = NULL,
          loginTime = NULL,
          sessionExpire = NULL
        WHERE id = ?
      `
      await query(sql, [userId])
    }
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      msg: '退出成功'
    }
  })
)

// 前端兼容接口 - 自定义后端错误
authRouter.get(
  '/user/auth/error',
  errorControllerWrapper((ctx) => {
    const { code, msg } = ctx.query
    ctx.status = httpCode.ok
    ctx.body = {
      code: Number(code) || businessCode.error,
      msg: msg || '自定义后端错误',
      data: null
    }
  })
)

export default authRouter
