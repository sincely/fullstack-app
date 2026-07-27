/**
 * 日志模块
 *
 * 职责：操作日志、登录日志的查询与删除
 */

// 导出控制器
export { default as operationLogController } from './operationLogController.js'
export { default as loginLogController } from './loginLogController.js'

// 导出 Service
export * as operationLogService from './operationLogService.js'
export * as loginLogService from './loginLogService.js'

// 导出 DAO
export { default as operationLogDao } from './operationLogDao.js'
export { default as loginLogDao } from './loginLogDao.js'

// 导出路由
export { default as operationLogRouter } from './operationLogRouter.js'
export { default as loginLogRouter } from './loginLogRouter.js'
