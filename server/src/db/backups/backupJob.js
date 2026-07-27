/**
 * 数据库定时备份任务
 *
 * 核心思想：
 * - 模块自声明定时任务 — 新功能加一行 register，零侵入
 * - 定时执行：每日凌晨自动备份
 * - 自动清理：超过数量或时间的备份自动删除
 */

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createBackup, cleanupOldBackups, verifyBackup } from './BackupManager.js'
import logger from '../../config/logger.js'

// 获取当前模块目录
const __dirname = dirname(fileURLToPath(import.meta.url))
const BACKUP_DIR = resolve(__dirname, './')

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  backupDir: BACKUP_DIR,
  // 备份密码（建议通过环境变量配置）
  password: process.env.BACKUP_PASSWORD || 'default-backup-key',
  // 是否压缩
  compress: true,
  // 最大保留数量
  maxCount: parseInt(process.env.BACKUP_MAX_COUNT || '10', 10),
  // 最大保留天数
  maxAge: parseInt(process.env.BACKUP_MAX_AGE_DAYS || '30', 10) * 24 * 60 * 60 * 1000
}

/**
 * 执行备份任务
 */
export async function runBackupJob() {
  logger.info('开始执行定时备份任务')

  try {
    // 1. 创建备份
    const result = await createBackup({
      backupDir: BACKUP_CONFIG.backupDir,
      password: BACKUP_CONFIG.password,
      compress: BACKUP_CONFIG.compress
    })

    // 2. 验证备份
    const verify = await verifyBackup({
      filePath: result.path,
      password: BACKUP_CONFIG.password
    })

    if (!verify.valid) {
      logger.error(`备份验证失败: ${result.name}`, verify.error)
      return { success: false, error: verify.error }
    }

    // 3. 清理旧备份
    const cleanup = await cleanupOldBackups({
      backupDir: BACKUP_CONFIG.backupDir,
      maxAge: BACKUP_CONFIG.maxAge,
      maxCount: BACKUP_CONFIG.maxCount
    })

    logger.info(`备份任务完成: ${result.name}, 清理 ${cleanup.deleted} 个旧备份`)
    return { success: true, ...result, cleanup }
  } catch (err) {
    logger.error('备份任务失败', err)
    return { success: false, error: err.message }
  }
}

/**
 * 注册到任务调度器
 * @param {Object} scheduler - 任务调度器实例
 */
export function register(scheduler) {
  // 每日凌晨 2 点执行备份
  scheduler.addJob('db-backup', '0 2 * * *', runBackupJob)
  logger.info('已注册数据库定时备份任务: 每日 02:00 执行')
}

export default {
  runBackupJob,
  register
}