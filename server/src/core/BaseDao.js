/**
 * createBaseDao - 数据访问层工厂函数
 *
 * 封装通用的 CRUD 操作，通过工厂函数创建 DAO 实例
 * 核心思想：让变化隔离，改一层不动其他层
 *
 * 使用示例：
 * const userDao = createBaseDao('Users')
 *
 * 使用通用方法
 * const users = await userDao.findAll()
 * const user = await userDao.findById(1)
 *
 * 扩展自定义方法
 * const userDao = {
 *   ...createBaseDao('Users'),
 *   async findByEmail(email) {
 *     return this.findOne({ email })
 *   }
 * }
 */

import { query, getConnection } from '../utils/db.js'

/**
 * 创建 DAO 实例
 * @param {string} tableName - 数据库表名
 * @returns {Object} - DAO 实例对象
 */
export function createBaseDao(tableName) {
  /**
   * 执行原生 SQL 查询
   * @param {string} sql - SQL 语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Array>} - 查询结果
   */
  async function executeQuery(sql, params = []) {
    return query(sql, params)
  }

  /**
   * 查询所有记录
   * @param {Object} options - 查询选项
   * @param {Array} options.fields - 返回字段列表，默认返回所有字段
   * @param {Object} options.where - WHERE 条件对象
   * @param {string} options.orderBy - 排序字段
   * @param {string} options.orderDir - 排序方向 ASC|DESC
   * @param {number} options.limit - 限制返回条数
   * @param {number} options.offset - 偏移量
   * @returns {Promise<Array>} - 记录列表
   */
  async function findAll(options = {}) {
    const {
      fields = ['*'],
      where = {},
      orderBy = 'id',
      orderDir = 'DESC',
      limit,
      offset
    } = options

    const fieldList = fields.map(f => (f === '*' ? '*' : `\`${f}\``)).join(', ')
    let sql = `SELECT ${fieldList} FROM \`${tableName}\``
    const params = []

    // WHERE 条件
    const whereClauses = []
    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        whereClauses.push(`\`${key}\` IS NULL`)
      } else if (Array.isArray(value)) {
        whereClauses.push(`\`${key}\` IN (${value.map(() => '?').join(', ')})`)
        params.push(...value)
      } else {
        whereClauses.push(`\`${key}\` = ?`)
        params.push(value)
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`
    }

    // 排序
    sql += ` ORDER BY \`${orderBy}\` ${orderDir}`

    分页
    if (limit !== undefined) {
      sql += ' LIMIT ?'
      params.push(Number(limit))
    }

    if (offset !== undefined) {
      sql += ' OFFSET ?'
      params.push(Number(offset))
    }

    return executeQuery(sql, params)
  }

  /**
   * 查询单条记录
   * @param {Object} where - WHERE 条件对象
   * @param {Array} fields - 返回字段列表
   * @returns {Promise<Object|null>} - 单条记录或 null
   */
  async function findOne(where, fields = ['*']) {
    const results = await findAll({ where, fields, limit: 1 })
    return results[0] || null
  }

  /**
   * 根据ID查询单条记录
   * @param {number} id - 主键ID
   * @param {Array} fields - 返回字段列表
   * @returns {Promise<Object|null>}
   */
  async function findById(id, fields = ['*']) {
    return findOne({ id }, fields)
  }

  /**
   * 统计记录数
   * @param {Object} where - WHERE 条件对象
   * @returns {Promise<number>}
   */
  async function count(where = {}) {
    let sql = `SELECT COUNT(*) as total FROM \`${tableName}\``
    const params = []

    const whereClauses = []
    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        whereClauses.push(`\`${key}\` IS NULL`)
      } else if (Array.isArray(value)) {
        whereClauses.push(`\`${key}\` IN (${value.map(() => '?').join(', ')})`)
        params.push(...value)
      } else if (typeof value === 'object' && value.op) {
        // 支持操作符：{ op: 'LIKE', value: '%keyword%' }
        whereClauses.push(`\`${key}\` ${value.op} ?`)
        params.push(value.value)
      } else {
        whereClauses.push(`\`${key}\` = ?`)
        params.push(value)
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`
    }

    const results = await executeQuery(sql, params)
    return results[0]?.total || 0
  }

  /**
   * 插入单条记录
   * @param {Object} data - 要插入的数据
   * @returns {Promise<{insertId: number, affectedRows: number}>}
   */
  async function insert(data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')
    const keyList = keys.map(k => `\`${k}\``).join(', ')

    const sql = `INSERT INTO \`${tableName}\` (${keyList}) VALUES (${placeholders})`
    const result = await executeQuery(sql, values)

    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    }
  }

  /**
   * 批量插入记录
   * @param {Array<Object>} dataList - 要插入的数据列表
   * @returns {Promise<{insertId: number, affectedRows: number}>}
   */
  async function batchInsert(dataList) {
    if (!dataList || dataList.length === 0) {
      return { insertId: 0, affectedRows: 0 }
    }

    const keys = Object.keys(dataList[0])
    const keyList = keys.map(k => `\`${k}\``).join(', ')
    const rowPlaceholders = `(${keys.map(() => '?').join(', ')})`
    const allPlaceholders = dataList.map(() => rowPlaceholders).join(', ')
    const allValues = dataList.flatMap(data => keys.map(k => data[k]))

    const sql = `INSERT INTO \`${tableName}\` (${keyList}) VALUES ${allPlaceholders}`
    const result = await executeQuery(sql, allValues)

    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    }
  }

  /**
   * 更新记录
   * @param {number|Object} where - 更新条件（ID 或 WHERE 对象）
   * @param {Object} data - 要更新的数据
   * @returns {Promise<{affectedRows: number}>}
   */
  async function update(where, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)

    const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ')
    let sql = `UPDATE \`${tableName}\` SET ${setClauses}`
    const params = [...values]

    // WHERE 条件
    if (typeof where === 'number') {
      sql += ' WHERE `id` = ?'
      params.push(where)
    } else {
      const whereClauses = []
      for (const [key, value] of Object.entries(where)) {
        if (value === null) {
          whereClauses.push(`\`${key}\` IS NULL`)
        } else {
          whereClauses.push(`\`${key}\` = ?`)
          params.push(value)
        }
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`
      }
    }

    const result = await executeQuery(sql, params)
    return { affectedRows: result.affectedRows }
  }

  /**
   * 删除记录
   * @param {number|Object} where - 删除条件（ID 或 WHERE 对象）
   * @returns {Promise<{affectedRows: number}>}
   */
  async function del(where) {
    let sql = `DELETE FROM \`${tableName}\``
    const params = []

    if (typeof where === 'number') {
      sql += ' WHERE `id` = ?'
      params.push(where)
    } else {
      const whereClauses = []
      for (const [key, value] of Object.entries(where)) {
        if (value === null) {
          whereClauses.push(`\`${key}\` IS NULL`)
        } else {
          whereClauses.push(`\`${key}\` = ?`)
          params.push(value)
        }
      }
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`
      }
    }

    const result = await executeQuery(sql, params)
    return { affectedRows: result.affectedRows }
  }

  /**
   * 软删除（将 status 字段设置为 0）
   * @param {number|Object} where - 删除条件
   * @returns {Promise<{affectedRows: number}>}
   */
  async function softDelete(where) {
    return update(where, { status: 0, deletedAt: new Date() })
  }

  /**
   * 批量删除记录
   * @param {Array<number>} ids - ID 列表
   * @returns {Promise<{affectedRows: number}>}
   */
  async function batchDelete(ids) {
    if (!ids || ids.length === 0) {
      return { affectedRows: 0 }
    }

    const placeholders = ids.map(() => '?').join(', ')
    const sql = `DELETE FROM \`${tableName}\` WHERE \`id\` IN (${placeholders})`
    const result = await executeQuery(sql, ids)

    return { affectedRows: result.affectedRows }
  }

  /**
   * 事务执行（需要在事务中执行多个操作时使用）
   * @param {Function} callback - 事务回调函数，接收 connection 参数
   * @returns {Promise<any>} - 返回回调函数的执行结果
   */
  async function transaction(callback) {
    const connection = await getConnection()
    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * 分页查询
   * @param {Object} options - 查询选项
   * @param {number} options.page - 当前页码（从 1 开始）
   * @param {number} options.pageSize - 每页数量
   * @param {Object} options.where - WHERE 条件对象
   * @param {string} options.orderBy - 排序字段
   * @param {string} options.orderDir - 排序方向 ASC|DESC
   * @returns {Promise<{records: Array, total: number, page: number, pageSize: number}>}
   */
  async function paginate(options = {}) {
    const {
      page = 1,
      pageSize = 10,
      where = {},
      orderBy = 'id',
      orderDir = 'DESC',
      fields = ['*']
    } = options

    const safePage = Math.max(1, Number(page))
    const safePageSize = Math.max(1, Math.min(100, Number(pageSize)))
    const offset = (safePage - 1) * safePageSize

    并行查询总数和记录列表
    const [records, total] = await Promise.all([
      findAll({
        where,
        fields,
        orderBy,
        orderDir,
        limit: safePageSize,
        offset
      }),
      count(where)
    ])

    return {
      records,
      total: Number(total),
      page: safePage,
      pageSize: safePageSize,
      totalPages: Math.ceil(total / safePageSize)
    }
  }

  // 返回 DAO 实例对象
  return {
    tableName,
    executeQuery,
    findAll,
    findOne,
    findById,
    count,
    insert,
    batchInsert,
    update,
    delete: del,
    softDelete,
    batchDelete,
    transaction,
    paginate
  }
}

export default createBaseDao