/**
 * 登录模块路由 - 用户登录、注册、查询用户名
 */

import Router from '@koa/router'
import loginController from './loginController.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import authMiddleware from '../../middleware/authenticate.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { LoginBodySchema, FindUserNameBodySchema, RegisterBodySchema } from '../../schemas/models/userSchema.js'

// 根路由已在 src/routers/index.js 统一挂载 ApiPrefix，这里不要重复添加 prefix
const loginRouter = new Router()

loginRouter.post('/user/login', validateBody(LoginBodySchema), errorControllerWrapper(loginController.login))
loginRouter.post('/user/findUserName', validateBody(FindUserNameBodySchema), errorControllerWrapper(loginController.findUserName))
loginRouter.post('/user/register', validateBody(RegisterBodySchema), errorControllerWrapper(loginController.register))

// 示例：需要登录态或 token 的路由
loginRouter.get(
  '/user/test',
  authMiddleware,
  validateQuery(LoginBodySchema),
  errorControllerWrapper((ctx) => {
    ctx.body = { ok: true, data: ctx.state.data }
  })
)

export default loginRouter