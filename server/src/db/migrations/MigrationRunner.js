/**
 * 数据库迁移运行器
 *
 * 核心思想：
 * - 版本化管理：每次迁移记录版本号，支持回滚
 * - 增量执行：只执行未执行的迁移
 * - 团队协作：迁移文件纳入版本控制，保证一致性
 */

import { query, getConnection } from '../../utils/db.js'
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import logger from '../../config/logger.js'

// 迁移记录表名
const MIGRATIONS_TABLE = 'migrations'

/**
 * 确保迁移表存在
 */
async function ensureMigrationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`${MIGRATIONS_TABLE}\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL UNIQUE,
      \`batch\` INT NOT NULL,
      \`executedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `
  await query(sql)
}

/**
 * 获取已执行的迁移列表
 * @returns {Promise<Set<string>>}
 */
async function getExecutedMigrations() {
  const rows = await query(`SELECT name FROM \`${MIGRATIONS_TABLE}\` ORDER BY id`)
  return new Set(rows.map(r => r.name))
}

/**
 * 获取迁移文件列表（按名称排序）
 * @param {string} dir - 迁移目录
 * @returns {Array<{name: string, path: string}>}
 */
function getMigrationFiles(dir) {
  try {
    const files = readdirSync(dir)
      .filter(f => f.endsWith('.js') || f.endsWith('.sql'))
      .sort()
    return files.map(f => ({ name: f, path: join(dir, f) }))
  } catch {
    return []
  }
}

/**
 * 执行单个迁移
 * @param {Object} migration - 迁移对象
 * @param {number} batch - 批次号
 */
async function runMigration(migration, batch) {
  const { name, path: filePath } = migration
  const ext = basename(filePath).split('.').pop()

  logger.info(`执行迁移: ${name}`)

  if (ext === 'sql') {
    // SQL 文件：直接执行
    const sql = readFileSync(filePath, 'utf-8')
    // 分割多条语句（以 ; 结尾）
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    for (const statement of statements) {
      await query(statement)
    }
  } else if (ext === 'js') {
    // JS 文件：导入并执行
    const migrationModule = await import(`file://${filePath}`)
    if (typeof migrationModule.up === 'function') {
      await migrationModule.up(query)
    } else if (typeof migrationModule.default?.up === 'function') {
      await migrationModule.default.up(query)
    } else {
      throw new Error(`迁移文件 ${name} 缺少 up 函数`)
    }
  }

  // 记录执行
  await query(`INSERT INTO \`${MIGRATIONS_TABLE}\` (name, batch) VALUES (?, ?)`, [name, batch])
}

/**
 * 执行所有待执行的迁移
 * @param {string} migrationsDir - 迁移目录路径
 * @returns {Promise<{executed: number, migrations: string[]}>}
 */
export async function migrate(migrationsDir) {
  await ensureMigrationsTable()

  const executed = await getExecutedMigrations()
  const files = getMigrationFiles(migrationsDir)

  // 过滤出未执行的迁移
  const pending = files.filter(f => !executed.has(f.name))

  if (pending.length === 0) {
    logger.info('没有待执行的迁移')
    return { executed: 0, migrations: [] }
  }

  // 获取当前批次号
  const batchResult = await query(`SELECT COALESCE(MAX(batch), 0) + 1 as batch FROM \`${MIGRATIONS_TABLE}\``)
  const batch = batchResult[0]?.batch || 1

  // 执行迁移
  const executedList = []
  for (const migration of pending) {
    await runMigration(migration, batch)
    executedList.push(migration.name)
  }

  logger.info(`迁移完成: ${executedList.length} 个文件`)
  return { executed: executedList.length, migrations: executedList }
}

/**
 * 回滚最近一批迁移
 * @param {string} migrationsDir - 迁移目录路径
 * @returns {Promise<{rolledBack: number, migrations: string[]}>}
 */
export async function rollback(migrationsDir) {
  await ensureMigrationsTable()

  // 获取最近批次
  const batchResult = await query(
    `SELECT batch FROM \`${MIGRATIONS_TABLE}\` ORDER BY batch DESC LIMIT 1`
  )

  if (batchResult.length === 0) {
    logger.info('没有可回滚的迁移')
    return { rolledBack: 0, migrations: [] }
  }

  const batch = batchResult[0].batch

  // 获取该批次的所有迁移
  const migrations = await query(
    `SELECT name FROM \`${MIGRATIONS_TABLE}\` WHERE batch = ? ORDER BY id DESC`,
    [batch]
  )

  const rolledBackList = []

  for (const { name } of migrations) {
    const filePath = join(migrationsDir, name)

    try {
      const ext = basename(filePath).split('.').pop()

      if (ext === 'js') {
        const migrationModule = await import(`file://${filePath}`)
        if (typeof migrationModule.down === 'function') {
          await migrationModule.down(query)
        } else if (typeof migrationModule.default?.down === 'function') {
          await migrationModule.default.down(query)
        }
      }
      // SQL 文件的回滚需要手动处理（通常在 JS 迁移中实现）

      // 删除记录
      await query(`DELETE FROM \`${MIGRATIONS_TABLE}\` WHERE name = ?`, [name])
      rolledBackList.push(name)
      logger.info(`已回滚: ${name}`)
    } catch (err) {
      logger.error(`回滚失败: ${name}`, err)
    }
  }

  return { rolledBack: rolledBackList.length, migrations: rolledBackList }
}

/**
 * 获取迁移状态
 * @param {string} migrationsDir - 迁移目录路径
 * @returns {Promise<{executed: string[], pending: string[]}>}
 */
export async function status(migrationsDir) {
  await ensureMigrationsTable()

  const executed = await getExecutedMigrations()
  const files = getMigrationFiles(migrationsDir)

  return {
    executed: files.filter(f => executed.has(f.name)).map(f => f.name),
    pending: files.filter(f => !executed.has(f.name)).map(f => f.name)
  }
}

export default {
  migrate,
  rollback,
  status
}