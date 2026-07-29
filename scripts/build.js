#!/usr/bin/env node
/**
 * 统一构建脚本 — 从根目录一键构建前后端
 *
 * 用法：
 *   node scripts/build.js              # 构建前端(test) + 后端(prod)
 *   node scripts/build.js --client     # 仅构建前端
 *   node scripts/build.js --server    # 仅构建后端
 *   node scripts/build.js --mode test  # 指定环境模式（默认 test）
 *
 * 前端：pnpm --filter client run build:<mode>
 * 后端：pnpm --filter server run build:prod（后端构建不分环境，由 .env.production 控制）
 */

import { execSync } from 'child_process'
import process from 'process'

const args = process.argv.slice(2)
const onlyClient = args.includes('--client')
const onlyServer = args.includes('--server')
const modeIndex = args.indexOf('--mode')
const mode = modeIndex !== -1 ? args[modeIndex + 1] : 'test'

const validModes = ['test', 'production']
if (!validModes.includes(mode)) {
  console.error(`✗ 无效的构建模式: ${mode}，可选值: ${validModes.join(', ')}`)
  process.exit(1)
}

const clientBuildCmd = `pnpm --filter client run build:${mode === 'production' ? 'prod' : 'test'}`
// server 不在根 pnpm workspace 中，需进入目录执行
const serverBuildCmd = `pnpm run build:prod`

function run(cmd, label, cwd) {
  console.log(`\n━━━ 构建 ${label} ━━━`)
  console.log(`$ ${cmd}`)
  try {
    execSync(cmd, { stdio: 'inherit', cwd: cwd || process.cwd() })
    console.log(`✓ ${label} 构建完成`)
  } catch (err) {
    console.error(`✗ ${label} 构建失败`)
    process.exit(1)
  }
}

console.log(`\n═══════════════════════════════════════`)
console.log(`  全栈构建  模式: ${mode}`)
console.log(`═══════════════════════════════════════`)

if (!onlyServer) {
  run(clientBuildCmd, '前端 (client)')
}

if (!onlyClient) {
  run(serverBuildCmd, '后端 (server)', './server')
}

console.log(`\n═══════════════════════════════════════`)
console.log(`  ✓ 全栈构建完成`)
console.log(`  前端产物: client/dist/`)
console.log(`  后端产物: server/dist/`)
console.log(`═══════════════════════════════════════\n`)
