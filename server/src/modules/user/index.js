/**
 * 用户管理模块
 *
 * 职责：用户 CRUD、批量操作、状态管理、密码重置
 */

// 导出控制器
export { default as userManageController } from './userManageController.js'

// 导出 Service
export * as userService from './userService.js'

// 导出 DAO
export { default as userDao } from './userDao.js'

// 导出路由
export { default as userManageRouter } from './userManageRouter.js'
