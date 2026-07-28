import Router from '@koa/router'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { loginBodySchema } from '../../schemas/auth/authSchema.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'
import authenticate from '../../middleware/authenticate.js'
import * as authService from './authService.js'

const authRouter = new Router()

// 前端兼容接口 - 登录
const frontendLogin = async (ctx) => {
  const loginIp =
    ctx.headers['x-forwarded-for'] ||
    ctx.headers['x-real-ip'] ||
    ctx.ip ||
    ctx.request.ip ||
    'unknown'
  const userAgent = ctx.headers['user-agent'] || ''

  const result = await authService.frontendLogin({
    ...ctx.request.body,
    loginIp,
    userAgent
  })

  if (!result.success) return (ctx.body = createFailResponse(result.code, businessMsg[result.code], result.data))

  // 写入 Session（Redis Store 会在响应结束时自动持久化）
  ctx.session.user = {
    userId: result.data.userId,
    token: result.data.token,
    refreshToken: result.data.refreshToken,
    sessionId: result.data.sessionId
  }

  ctx.body = createSuccessResponse(businessCode.success, '登录成功', result.data)
}

authRouter.post('/user/auth/login', validateBody(loginBodySchema), errorControllerWrapper(frontendLogin))

// 前端兼容接口 - 获取用户信息
const frontendGetUserInfo = async (ctx) => {
  const result = await authService.frontendGetUserInfo(ctx.state.user.userId)
  if (!result.success) return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  ctx.body = createSuccessResponse(businessCode.success, '获取用户信息成功', result.data)
}

authRouter.get('/user/getUserInfo', authenticate, errorControllerWrapper(frontendGetUserInfo))

// 前端兼容接口 - 刷新 token
authRouter.post(
  '/user/auth/refreshToken',
  errorControllerWrapper(async (ctx) => {
    const { refreshToken } = ctx.request.body
    const result = await authService.frontendRefreshToken(refreshToken)
    if (!result.success) {
      return (ctx.body = createFailResponse(result.code, result.msg || businessMsg[result.code]))
    }
    ctx.body = createSuccessResponse(businessCode.success, '刷新成功', result.data)
  })
)

// 登出（清除用户 sessionId 和 currentRefreshToken）
authRouter.post(
  '/user/auth/logout',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const userId = ctx.state.user?.userId
    await authService.frontendLogout(userId)

    // 清除 Session（Redis Store 会在响应结束时删除对应 key）
    ctx.session = null

    ctx.body = createSuccessResponse(businessCode.success, '退出成功')
  })
)

// 前端兼容接口 - 自定义后端错误（调试用）
authRouter.get(
  '/user/auth/error',
  errorControllerWrapper((ctx) => {
    const code = Number(ctx.query.code) || businessCode.error
    const msg = ctx.query.msg || '自定义后端错误'
    ctx.body = createFailResponse(code, msg)
  })
)

export default authRouter
