/**
 * 菜单管理模块
 *
 * 职责：菜单 CRUD、树形结构、按钮权限
 */

// 导出控制器
export { default as menuManageController } from './menuManageController.js'

// 导出 Service
export * as menuService from './menuService.js'

// 导出 DAO
export { default as menuDao } from './menuDao.js'

// 导出路由
export { default as menuManageRouter } from './menuManageRouter.js'
