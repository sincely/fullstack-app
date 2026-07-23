import Router from '@koa/router'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { loginBodySchema } from '../../schemas/auth/authSchema.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'
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

  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '登录成功')
}

authRouter.post('/user/auth/login', validateBody(loginBodySchema), errorControllerWrapper(frontendLogin))

// 前端兼容接口 - 获取用户信息
const frontendGetUserInfo = async (ctx) => {
  const result = await authService.frontendGetUserInfo(ctx.state.user.userId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '获取用户信息成功')
}

authRouter.get('/user/getUserInfo', authenticate, errorControllerWrapper(frontendGetUserInfo))

// 前端兼容接口 - 刷新 token
authRouter.post(
  '/user/auth/refreshToken',
  errorControllerWrapper(async (ctx) => {
    const { refreshToken } = ctx.request.body
    const result = await authService.frontendRefreshToken(refreshToken)
    if (!result.success) {
      return setBody(ctx, result.code, undefined, null, result.msg || businessMsg[result.code])
    }
    success(ctx, result.data, '刷新成功')
  })
)

// 登出（清除用户 sessionId 和 currentRefreshToken）
authRouter.post(
  '/user/auth/logout',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const userId = ctx.state.user?.userId
    await authService.frontendLogout(userId)
    success(ctx, null, '退出成功')
  })
)

// 前端兼容接口 - 自定义后端错误（调试用）
authRouter.get(
  '/user/auth/error',
  errorControllerWrapper((ctx) => {
    const code = Number(ctx.query.code) || businessCode.error
    const msg = ctx.query.msg || '自定义后端错误'
    setBody(ctx, code, 200, null, msg)
  })
)

export default authRouter
