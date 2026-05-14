import Router from '@koa/router'
import AdminAuthController from '../../controllers/admin/authController.js'
import adminAuthDao from '../../services/adminAuthDao.js'
import adminPermissionDao from '../../services/adminPermissionDao.js'
import authenticate from '../../middleware/authenticate.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  AdminLoginBodySchema,
  AdminRegisterBodySchema,
  FrontendLoginBodySchema
} from '../../schemas/models/adminAuthSchema.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { comparePassword } from '../../utils/password.js'
import { generateToken } from '../../utils/jwt.js'

const adminRouter = new Router()

adminRouter.post('/admin/auth/login', validateBody(AdminLoginBodySchema), errorControllerWrapper(AdminAuthController.login))

// 前端兼容接口 - 登录
const frontendLogin = async (ctx) => {
  // 前端发送 userName 参数，后端使用 username
  const { userName, password } = ctx.request.body
  const username = userName

  const user = await adminAuthDao.findAdminUserByUsername(username)
  if (!user) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userLoginFail,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  if (user.status !== 'active') {
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

  const token = generateToken({
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleName: user.roleName
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '登录成功',
    data: {
      token,
      refreshToken: token
    }
  }
}

adminRouter.post('/user/auth/login', validateBody(FrontendLoginBodySchema), errorControllerWrapper(frontendLogin))

adminRouter.post('/admin/auth/register', validateBody(AdminRegisterBodySchema), errorControllerWrapper(AdminAuthController.register))
adminRouter.post('/admin/auth/logout', authenticate, errorControllerWrapper(AdminAuthController.logout))
adminRouter.get('/admin/auth/profile', authenticate, errorControllerWrapper(AdminAuthController.getProfile))
adminRouter.get('/admin/auth/menus', authenticate, errorControllerWrapper(AdminAuthController.getMenus))
adminRouter.get('/admin/auth/permissions', authenticate, errorControllerWrapper(AdminAuthController.getPermissions))

// 前端兼容接口 - 获取用户信息
const frontendGetUserInfo = async (ctx) => {
  const currentUser = await adminAuthDao.findAdminUserById(ctx.state.user.userId)
  if (!currentUser) {
    ctx.status = httpCode.unauthorized
    ctx.body = {
      code: businessCode.userNotFound,
      msg: businessMsg[businessCode.userNotFound]
    }
    return
  }

  // 获取用户按钮权限
  const buttons = await adminPermissionDao.findButtonsByRoleId(currentUser.roleId)
  const buttonCodes = buttons.map((b) => b.buttonName)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户信息成功',
    data: {
      userId: currentUser.id,
      userName: currentUser.username,
      roles: [currentUser.roleName],
      buttons: buttonCodes
    }
  }
}

adminRouter.get('/user/getUserInfo', authenticate, errorControllerWrapper(frontendGetUserInfo))

export default adminRouter
