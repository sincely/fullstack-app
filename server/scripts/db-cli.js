#!/usr/bin/env node

/**
 * 数据库迁移与备份 CLI 工具
 *
 * 使用方式：
 *   node scripts/db-cli.js migrate           # 执行迁移
 *   node scripts/db-cli.js rollback          # 回滚最近一批
 *   node scripts/db-cli.js status            # 查看迁移状态
 *   node scripts/db-cli.js backup            # 创建备份
 *   node scripts/db-cli.js restore <file>    # 恢复备份
 *   node scripts/db-cli.js list              # 列出备份
 *   node scripts/db-cli.js verify <file>     # 验证备份
 */

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import '../src/config/env.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(__dirname, '..')
const MIGRATIONS_DIR = resolve(ROOT_DIR, 'src/db/migrations')
const BACKUPS_DIR = resolve(ROOT_DIR, 'src/db/backups')

async function main() {
  const [, , command, ...args] = process.argv

  switch (command) {
    case 'migrate':
      await runMigrate()
      break
    case 'rollback':
      await runRollback()
      break
    case 'status':
      await runStatus()
      break
    case 'backup':
      await runBackup()
      break
    case 'restore':
      await runRestore(args[0])
      break
    case 'list':
      await runList()
      break
    case 'verify':
      await runVerify(args[0])
      break
    default:
      printUsage()
  }
}

function printUsage() {
  console.log(`
数据库迁移与备份工具

迁移命令:
  migrate     执行所有待执行的迁移
  rollback    回滚最近一批迁移
  status      查看迁移状态

备份命令:
  backup      创建数据库备份
  restore     恢复备份（需指定文件名）
  list        列出所有备份
  verify      验证备份完整性（需指定文件名）

示例:
  node scripts/db-cli.js migrate
  node scripts/db-cli.js backup
  node scripts/db-cli.js restore backup-2026-07-22T02-00-00.sql.enc
`)
}

async function runMigrate() {
  const { migrate } = await import('../src/db/migrations/index.js')
  const result = await migrate(MIGRATIONS_DIR)
  console.log(`\n✅ 迁移完成: ${result.executed} 个文件`)
  if (result.migrations.length > 0) {
    result.migrations.forEach(m => console.log(`  - ${m}`))
  }
}

async function runRollback() {
  const { rollback } = await import('../src/db/migrations/index.js')
  const result = await rollback(MIGRATIONS_DIR)
  console.log(`\n✅ 回滚完成: ${result.rolledBack} 个文件`)
  if (result.migrations.length > 0) {
    result.migrations.forEach(m => console.log(`  - ${m}`))
  }
}

async function runStatus() {
  const { status } = await import('../src/db/migrations/index.js')
  const result = await status(MIGRATIONS_DIR)
  console.log('\n📋 迁移状态:')
  console.log('\n已执行:')
  result.executed.forEach(m => console.log(`  ✓ ${m}`))
  console.log('\n待执行:')
  if (result.pending.length === 0) {
    console.log('  (无)')
  } else {
    result.pending.forEach(m => console.log(`  ○ ${m}`))
  }
}

async function runBackup() {
  const { createBackup } = await import('../src/db/backups/index.js')
  const result = await createBackup({
    backupDir: BACKUPS_DIR,
    password: process.env.BACKUP_PASSWORD || 'default-backup-key'
  })
  console.log(`\n✅ 备份完成: ${result.name}`)
  console.log(`   大小: ${(result.size / 1024 / 1024).toFixed(2)} MB`)
}

async function runRestore(filename) {
  if (!filename) {
    console.error('❌ 请指定备份文件名')
    console.log('使用: node scripts/db-cli.js restore <filename>')
    process.exit(1)
  }

  const { restoreBackup } = await import('../src/db/backups/index.js')
  const filePath = resolve(BACKUPS_DIR, filename)

  console.log(`\n⚠️  警告: 此操作将覆盖当前数据库!`)
  console.log(`   备份文件: ${filename}`)
  console.log(`   输入 'yes' 继续...`)

  const { createInterface } = await import('readline')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise(resolve => rl.question('', resolve))
  rl.close()

  if (answer !== 'yes') {
    console.log('已取消')
    process.exit(0)
  }

  await restoreBackup({
    filePath,
    password: process.env.BACKUP_PASSWORD || 'default-backup-key'
  })
  console.log(`\n✅ 恢复完成: ${filename}`)
}

async function runList() {
  const { listBackups } = await import('../src/db/backups/index.js')
  const backups = listBackups(BACKUPS_DIR)

  console.log('\n📦 备份列表:')
  if (backups.length === 0) {
    console.log('  (无备份)')
    return
  }

  backups.forEach(b => {
    const size = (b.size / 1024 / 1024).toFixed(2)
    const date = b.created.toISOString().slice(0, 19).replace('T', ' ')
    console.log(`  ${b.name}`)
    console.log(`    大小: ${size} MB | 时间: ${date}`)
  })
}

async function runVerify(filename) {
  if (!filename) {
    console.error('❌ 请指定备份文件名')
    process.exit(1)
  }

  const { verifyBackup } = await import('../src/db/backups/index.js')
  const filePath = resolve(BACKUPS_DIR, filename)

  const result = await verifyBackup({
    filePath,
    password: process.env.BACKUP_PASSWORD || 'default-backup-key'
  })

  if (result.valid) {
    console.log(`\n✅ 备份有效: ${filename}`)
  } else {
    console.log(`\n❌ 备份无效: ${filename}`)
    console.log(`   错误: ${result.error}`)
  }
}

main().catch(err => {
  console.error('\n❌ 执行失败:', err.message)
  process.exit(1)
})