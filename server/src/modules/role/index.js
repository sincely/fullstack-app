/**
 * 角色管理模块
 *
 * 职责：角色 CRUD、权限分配
 */

// 导出控制器
export { default as roleManageController } from './roleManageController.js'

// 导出 DAO
export { default as roleDao } from './roleDao.js'

// 导出路由
export { default as roleManageRouter } from './roleManageRouter.js'