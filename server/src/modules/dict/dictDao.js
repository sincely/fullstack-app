import { query } from '../../db/connection.js'

const DICT_LIST_COLUMNS = `
  id,
  dict_name,
  dict_code,
  status,
  remark,
  create_by,
  create_time,
  update_by,
  update_time
`

const buildDictFilters = ({ dict_name, dict_code, status } = {}) => {
  const where = []
  const params = []

  if (dict_name) {
    where.push('dict_name like ?')
    params.push(`%${dict_name}%`)
  }

  if (dict_code) {
    where.push('dict_code like ?')
    params.push(`%${dict_code}%`)
  }

  if (status !== undefined && status !== null && status !== '') {
    where.push('status = ?')
    params.push(Number(status))
  }

  return {
    whereSql: where.length > 0 ? ` where ${where.join(' and ')}` : '',
    params
  }
}

/**
 * 分页查询字典列表
 */
const listDicts = async ({ page = 1, pageSize = 10, dict_name = '', dict_code = '', status } = {}) => {
  const { whereSql, params } = buildDictFilters({ dict_name, dict_code, status })
  const offset = (Number(page) - 1) * Number(pageSize)
  const sql = `
    select ${DICT_LIST_COLUMNS}
    from Dict
    ${whereSql}
    order by id asc
    limit ? offset ?
  `

  return query(sql, [...params, Number(pageSize), offset])
}

/**
 * 统计字典总数
 */
const countDicts = async ({ dict_name = '', dict_code = '', status } = {}) => {
  const { whereSql, params } = buildDictFilters({ dict_name, dict_code, status })
  const sql = `select count(*) as total from Dict${whereSql}`
  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 根据 ID 查询字典
 */
const findDictById = async (id) => {
  const sql = `select ${DICT_LIST_COLUMNS} from Dict where id = ? limit 1`
  const rows = await query(sql, [id])
  return rows[0] || null
}

/**
 * 根据字典名称或编码查询字典（用于唯一性校验）
 */
const findDictByName = async (dict_name, dict_code) => {
  const sql = 'select id, dict_name, dict_code from Dict where dict_name = ? or dict_code = ? limit 1'
  const rows = await query(sql, [dict_name, dict_code])
  return rows[0] || null
}

/**
 * 创建字典
 */
const createDict = async ({ dict_name, dict_code, status, remark }) => {
  const result = await query(
    'insert into Dict (dict_name, dict_code, status, remark) values (?, ?, ?, ?)',
    [dict_name, dict_code, Number(status ?? 1), remark ?? '']
  )
  return { id: result.insertId, affectedRows: result.affectedRows }
}

/**
 * 更新字典
 */
const updateDict = async (id, { dict_name, dict_code, status, remark }) => {
  const result = await query(
    'update Dict set dict_name = ?, dict_code = ?, status = ?, remark = ? where id = ?',
    [dict_name, dict_code, Number(status ?? 1), remark ?? '', id]
  )
  return { affectedRows: result.affectedRows }
}

/**
 * 删除字典
 */
const deleteDict = async (id) => {
  const result = await query('delete from Dict where id = ?', [id])
  return result
}

export default {
  listDicts,
  countDicts,
  findDictById,
  findDictByName,
  createDict,
  updateDict,
  deleteDict
}
