/**
 * 认证模块
 *
 * 职责：登录、注册、登出、刷新 Token
 */

// 导出控制器
export { default as authController } from './authController.js'

// 导出 Service
export * as authService from './authService.js'

// 导出 DAO
export { default as authDao } from './authDao.js'

// 导出路由
export { default as authRouter } from './authRouter.js'
