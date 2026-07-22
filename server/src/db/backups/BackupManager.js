/**
 * 数据库备份管理器
 *
 * 核心思想：
 * - 备份是体系不是复制：加密、验证、清理、恢复，缺一不可
 * - AES-256-GCM 加密：敏感数据必须加密存储
 * - 定时任务：自动备份，无需人工干预
 * - 验证恢复：备份后验证完整性，确保可恢复
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { createWriteStream, createReadStream, readdirSync, statSync, unlinkSync } from 'fs'
import { join, basename } from 'path'
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'
import { pipeline } from 'stream/promises'
import { gzip, gunzip } from 'zlib'
import { promisify as promisifyStream } from 'util'
import logger from '../../config/logger.js'
import { dbConfig } from '../../config/database.js'

const execAsync = promisify(exec)
const gzipAsync = promisifyStream(gzip)
const gunzipAsync = promisifyStream(gunzip)

// 算法配置
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32

/**
 * 从密码派生加密密钥
 * @param {string} password - 密码
 * @param {Buffer} salt - 盐值
 * @returns {Buffer}
 */
function deriveKey(password, salt) {
  return scryptSync(password, salt, 32)
}

/**
 * 加密数据
 * @param {Buffer} data - 原始数据
 * @param {string} password - 加密密码
 * @returns {Buffer}
 */
export function encrypt(data, password) {
  const salt = randomBytes(SALT_LENGTH)
  const key = deriveKey(password, salt)
  const iv = randomBytes(IV_LENGTH)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const authTag = cipher.getAuthTag()

  // 格式: salt + iv + authTag + encrypted
  return Buffer.concat([salt, iv, authTag, encrypted])
}

/**
 * 解密数据
 * @param {Buffer} data - 加密数据
 * @param {string} password - 解密密码
 * @returns {Buffer}
 */
export function decrypt(data, password) {
  let offset = 0

  const salt = data.subarray(offset, offset + SALT_LENGTH)
  offset += SALT_LENGTH

  const iv = data.subarray(offset, offset + IV_LENGTH)
  offset += IV_LENGTH

  const authTag = data.subarray(offset, offset + AUTH_TAG_LENGTH)
  offset += AUTH_TAG_LENGTH

  const encrypted = data.subarray(offset)

  const key = deriveKey(password, salt)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}

/**
 * 执行 mysqldump 备份
 * @param {Object} options - 备份选项
 * @returns {Promise<Buffer>}
 */
async function mysqldump(options = {}) {
  const { database = dbConfig.database, tables = [] } = options

  // 构建 mysqldump 命令
  const args = [
    `-h${dbConfig.host}`,
    `-P${dbConfig.port}`,
    `-u${dbConfig.user}`,
    `-p${dbConfig.password}`,
    '--single-transaction',
    '--routines',
    '--triggers',
    '--events',
    '--quick',
    '--lock-tables=false',
    database
  ]

  if (tables.length > 0) {
    args.push(...tables)
  }

  // 执行备份
  const { stdout } = await execAsync(`mysqldump ${args.join(' ')}`, {
    maxBuffer: 100 * 1024 * 1024 // 100MB buffer
  })

  return Buffer.from(stdout, 'utf-8')
}

/**
 * 执行 mysql 恢复
 * @param {Buffer} sql - SQL 数据
 * @param {Object} options - 恢复选项
 */
async function mysqlRestore(sql, options = {}) {
  const { database = dbConfig.database } = options

  const args = [
    `-h${dbConfig.host}`,
    `-P${dbConfig.port}`,
    `-u${dbConfig.user}`,
    `-p${dbConfig.password}`,
    database
  ]

  await execAsync(`echo '${sql.toString()}' | mysql ${args.join(' ')}`, {
    maxBuffer: 100 * 1024 * 1024
  })
}

/**
 * 创建备份
 * @param {Object} options - 备份选项
 * @returns {Promise<{path: string, size: number}>}
 */
export async function createBackup(options = {}) {
  const {
    backupDir,
    password = process.env.BACKUP_PASSWORD || 'default-backup-key',
    tables = [],
    compress = true
  } = options

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const baseName = `backup-${timestamp}.sql`
  const fileName = compress ? `${baseName}.enc` : `${baseName}.enc`

  logger.info(`开始备份数据库: ${dbConfig.database}`)

  // 1. 执行 mysqldump
  const sqlData = await mysqldump({ tables })

  // 2. 压缩
  const compressed = compress ? await gzipAsync(sqlData) : sqlData

  // 3. 加密
  const encrypted = encrypt(compressed, password)

  // 4. 保存文件
  const filePath = join(backupDir, fileName)
  await new Promise((resolve, reject) => {
    const ws = createWriteStream(filePath)
    ws.write(encrypted)
    ws.end()
    ws.on('finish', resolve)
    ws.on('error', reject)
  })

  const size = statSync(filePath).size
  logger.info(`备份完成: ${fileName} (${(size / 1024 / 1024).toFixed(2)} MB)`)

  return { path: filePath, size, name: fileName }
}

/**
 * 恢复备份
 * @param {Object} options - 恢复选项
 */
export async function restoreBackup(options) {
  const {
    filePath,
    password = process.env.BACKUP_PASSWORD || 'default-backup-key',
    compress = true
  } = options

  logger.info(`开始恢复备份: ${basename(filePath)}`)

  // 1. 读取加密文件
  const encrypted = await new Promise((resolve, reject) => {
    const chunks = []
    const rs = createReadStream(filePath)
    rs.on('data', chunk => chunks.push(chunk))
    rs.on('end', () => resolve(Buffer.concat(chunks)))
    rs.on('error', reject)
  })

  // 2. 解密
  const decrypted = decrypt(encrypted, password)

  // 3. 解压
  const sqlData = compress ? await gunzipAsync(decrypted) : decrypted

  // 4. 执行恢复
  await mysqlRestore(sqlData)

  logger.info(`恢复完成: ${basename(filePath)}`)
}

/**
 * 验证备份完整性
 * @param {Object} options - 验证选项
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function verifyBackup(options) {
  const {
    filePath,
    password = process.env.BACKUP_PASSWORD || 'default-backup-key'
  } = options

  try {
    // 读取并解密
    const encrypted = await new Promise((resolve, reject) => {
      const chunks = []
      const rs = createReadStream(filePath)
      rs.on('data', chunk => chunks.push(chunk))
      rs.on('end', () => resolve(Buffer.concat(chunks)))
      rs.on('error', reject)
    })

    // 尝试解密（会验证 authTag）
    decrypt(encrypted, password)

    return { valid: true }
  } catch (err) {
    return { valid: false, error: err.message }
  }
}

/**
 * 清理旧备份
 * @param {Object} options - 清理选项
 */
export async function cleanupOldBackups(options) {
  const { backupDir, maxAge = 30 * 24 * 60 * 60 * 1000, maxCount = 10 } = options

  const files = readdirSync(backupDir)
    .filter(f => f.startsWith('backup-') && f.endsWith('.enc'))
    .map(f => ({
      name: f,
      path: join(backupDir, f),
      ...statSync(join(backupDir, f))
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)

  const now = Date.now()
  let deleted = 0

  // 按数量清理
  for (let i = maxCount; i < files.length; i++) {
    try {
      unlinkSync(files[i].path)
      deleted++
      logger.info(`已删除旧备份: ${files[i].name}`)
    } catch (err) {
      logger.error(`删除失败: ${files[i].name}`, err)
    }
  }

  // 按时间清理
  for (const file of files.slice(0, maxCount)) {
    if (now - file.mtimeMs > maxAge) {
      try {
        unlinkSync(file.path)
        deleted++
        logger.info(`已删除过期备份: ${file.name}`)
      } catch (err) {
        logger.error(`删除失败: ${file.name}`, err)
      }
    }
  }

  return { deleted }
}

/**
 * 列出所有备份
 * @param {string} backupDir - 备份目录
 * @returns {Array<{name: string, size: number, created: Date}>}
 */
export function listBackups(backupDir) {
  try {
    return readdirSync(backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.enc'))
      .map(f => {
        const stats = statSync(join(backupDir, f))
        return {
          name: f,
          size: stats.size,
          created: stats.mtime
        }
      })
      .sort((a, b) => b.created - a.created)
  } catch {
    return []
  }
}

export default {
  createBackup,
  restoreBackup,
  verifyBackup,
  cleanupOldBackups,
  listBackups,
  encrypt,
  decrypt
}