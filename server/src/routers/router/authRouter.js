import Router from '@koa/router'
import authDao from '../../services/authDao.js'
import permissionDao from '../../services/permissionDao.js'
import authenticate from '../../middleware/authenticate.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { loginBodySchema } from '../../schemas/models/authSchema.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { comparePassword } from '../../utils/password.js'
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { query } from '../../utils/db.js'

const adminRouter = new Router()

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

  const user = await authDao.findAdminUserByUsername(username)
  if (!user) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  if (Number(user.status) !== 1) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.adminUserDisabled,
      msg: businessMsg[businessCode.adminUserDisabled]
    }
    return
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  const loginTime = Date.now().toString() // 生成登录时间戳作为会话标识

  const payload = {
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleIds: parseRoleIds(user.roleIds, user.roleId),
    roleCode: user.roleCode,
    roleCodes: parseRoleCodes(user.roleCodes, user.roleCode),
    roleName: user.roleName,
    roleNames: parseRoleNames(user.roleNames, user.roleName),
    loginTime // 添加 loginTime 到 JWT payload，用于单设备登录控制
  }

  const token = generateToken(payload)
  const refreshToken = generateRefreshToken(payload)

  // 将 loginTime 和 refreshToken 写入用户表，实现单设备登录控制
  const sql = 'UPDATE Users SET loginTime = ?, currentRefreshToken = ? WHERE id = ?'
  await query(sql, [loginTime, refreshToken, user.id])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '登录成功',
    data: {
      token,
      refreshToken
    }
  }
}

adminRouter.post('/user/auth/login', validateBody(loginBodySchema), errorControllerWrapper(frontendLogin))

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

adminRouter.get('/user/getUserInfo', authenticate, errorControllerWrapper(frontendGetUserInfo))

// 前端兼容接口 - 刷新 token
adminRouter.post(
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

// 登出（清除用户 currentRefreshToken）
adminRouter.post(
  '/user/auth/logout',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const userId = ctx.state.user?.userId
    if (userId) {
      await authDao.updateUserRefreshToken(userId, null)
    }
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      msg: '退出成功'
    }
  })
)

// 前端兼容接口 - 自定义后端错误
adminRouter.get(
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

export default adminRouter
