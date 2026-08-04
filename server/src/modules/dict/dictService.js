/**
 * @module 字典管理 Service
 * @description 封装字典 CRUD 业务逻辑
 */

import dictDao from './dictDao.js'
import { businessCode } from '../../config/businessCode.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) {
    return 0
  }
  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const formatDictRow = (dict) => ({
  id: dict.id,
  dictId: dict.id,
  dictName: dict.dict_name,
  dictCode: dict.dict_code,
  status: toFrontendStatus(dict.status),
  remark: dict.remark ?? '',
  createBy: dict.create_by ?? '',
  createTime: dict.create_time,
  updateBy: dict.update_by ?? '',
  updateTime: dict.update_time
})

/**
 * 获取字典列表
 */
export const listDicts = async (query) => {
  const { current, size, page, pageSize, dictName, dictCode, status } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })
  const normalizedStatus = status === '2' ? '0' : status

  const filterParams = {
    dict_name: dictName || '',
    dict_code: dictCode || '',
    status: normalizedStatus
  }

  const [dicts, total] = await Promise.all([
    dictDao.listDicts({ page: actualPage, pageSize: actualPageSize, ...filterParams }),
    dictDao.countDicts(filterParams)
  ])

  return {
    records: dicts.map(formatDictRow),
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 创建字典
 */
export const createDict = async (body) => {
  const { dictName, dictCode, remark, status } = body

  const existedDict = await dictDao.findDictByName(dictName, dictCode)
  if (existedDict) {
    return { success: false, code: businessCode.dictNameExist }
  }

  const result = await dictDao.createDict({
    dict_name: dictName,
    dict_code: dictCode,
    status: toDbStatus(status),
    remark
  })

  return { success: true, data: { id: result.id } }
}

/**
 * 更新字典
 */
export const updateDict = async (body) => {
  const { id, dictId: rawDictId, dictName, dictCode, remark, status } = body
  const dictId = Number(rawDictId || id)

  const currentDict = await dictDao.findDictById(dictId)
  if (!currentDict) {
    return { success: false, code: businessCode.dictNotFound }
  }

  const existedDict = await dictDao.findDictByName(dictName, dictCode)
  if (existedDict && Number(existedDict.id) !== dictId) {
    return { success: false, code: businessCode.dictNameExist }
  }

  await dictDao.updateDict(dictId, {
    dict_name: dictName,
    dict_code: dictCode,
    status: toDbStatus(status),
    remark
  })

  return { success: true }
}

/**
 * 删除字典
 */
export const deleteDict = async (idOrDictId) => {
  const dictId = Number(idOrDictId)

  const currentDict = await dictDao.findDictById(dictId)
  if (!currentDict) {
    return { success: false, code: businessCode.dictNotFound }
  }

  await dictDao.deleteDict(dictId)
  return { success: true }
}
