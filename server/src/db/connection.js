import mysql from 'mysql2/promise'
import { format } from 'mysql2'
import { dbConfig } from '../config/database.js'
import logger from '../config/logger.js'

// 创建数据库连接池
const pool = mysql.createPool(dbConfig)

/**
 * 执行 SQL 查询
 * @param {string} sql - SQL 语句
 * @param {Array} params - 查询参数
 * @returns {Promise} - 返回查询结果
 */
const query = async (sql, params = []) => {
  logger.info(format(sql.trim(), params), 'SQL')
  const [result] = await pool.query(sql, params)
  return result
}

/**
 * 获取数据库连接（用于事务操作）
 * @returns {Promise} - 返回一个数据库连接
 */
const getConnection = async () => {
  return pool.getConnection()
}

// ──────────────────────────────────────────────
//  启动时验证 MySQL 连通性
// ──────────────────────────────────────────────

/**
 * 验证 MySQL 连接池可用
 * 执行 SELECT 1 检测连通性，超时 5s
 * @throws 连接失败时抛出错误
 */
export async function verifyMySQLConnection() {
  const start = Date.now()
  try {
    const connection = await pool.getConnection()
    try {
      await connection.query('SELECT 1')
    } finally {
      connection.release()
    }
    const latency = Date.now() - start
    logger.info(
      `MySQL 连接验证通过 ✓ → ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}（${latency}ms）`
    )
  } catch (err) {
    const latency = Date.now() - start
    logger.error(
      {
        err: { message: err.message, code: err.code },
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        latency
      },
      'MySQL 连接验证失败'
    )
    throw new Error(`MySQL 连接失败: ${err.message}`)
  }
}

// ──────────────────────────────────────────────
//  健康检查（供 /api/health 探针使用）
// ──────────────────────────────────────────────

/**
 * MySQL 健康检查
 * @returns {Promise<{ status: string, latency: number | null, pool?: object, error?: string }>}
 */
export async function checkMySQL() {
  const start = Date.now()
  try {
    const connection = await pool.getConnection()
    try {
      await connection.query('SELECT 1')
    } finally {
      connection.release()
    }
    const latency = Date.now() - start
    return {
      status: 'up',
      latency,
      host: `${dbConfig.host}:${dbConfig.port}`,
      database: dbConfig.database,
      pool: {
        total: pool.pool?._allConnections?.length ?? null,
        free: pool.pool?._freeConnections?.length ?? null
      }
    }
  } catch (err) {
    return {
      status: 'down',
      latency: Date.now() - start,
      error: err.message
    }
  }
}

// ──────────────────────────────────────────────
//  优雅关闭
// ──────────────────────────────────────────────

/**
 * 优雅关闭 MySQL 连接池
 */
export async function closeMySQL() {
  try {
    await pool.end()
    logger.info('MySQL 连接池已优雅关闭')
  } catch (err) {
    logger.error({ err: { message: err.message } }, 'MySQL 连接池关闭失败')
  }
}

export { query, getConnection }

export default { query, getConnection, verifyMySQLConnection, checkMySQL, closeMySQL }
