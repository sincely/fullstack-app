#!/usr/bin/env node
/**
 * Docker 镜像构建脚本 — 从根目录一键构建前后端 Docker 镜像
 *
 * 用法：
 *   node scripts/docker-build.js              # 构建前后端镜像
 *   node scripts/docker-build.js --client     # 仅构建前端镜像
 *   node scripts/docker-build.js --server     # 仅构建后端镜像
 *   node scripts/docker-build.js --gateway    # 仅构建网关镜像
 *   node scripts/docker-build.js --tag v1.0.0 # 指定镜像 tag（默认 latest）
 *
 * 镜像命名：
 *   cms-server:<tag>   — 后端 API
 *   cms-client:<tag>   — 前端静态资源
 *   cms-gateway:<tag>   — Nginx 反向代理网关
 */

import { execSync } from 'child_process'
import process from 'process'

const args = process.argv.slice(2)
const onlyClient = args.includes('--client')
const onlyServer = args.includes('--server')
const onlyGateway = args.includes('--gateway')
const tagIndex = args.indexOf('--tag')
const tag = tagIndex !== -1 ? args[tagIndex + 1] : 'latest'

function buildImage(name, context, dockerfile) {
  const imageName = `${name}:${tag}`
  const cmd = `docker build -t ${imageName} -f ${dockerfile} ${context}`
  console.log(`\n━━━ 构建 ${imageName} ━━━`)
  console.log(`$ ${cmd}`)
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() })
    console.log(`✓ ${imageName} 构建完成`)
  } catch (err) {
    console.error(`✗ ${imageName} 构建失败`)
    process.exit(1)
  }
}

console.log(`\n═══════════════════════════════════════`)
console.log(`  Docker 镜像构建  tag: ${tag}`)
console.log(`═══════════════════════════════════════`)

if (!onlyClient && !onlyGateway) {
  buildImage('cms-server', './server', './server/Dockerfile')
}

if (!onlyServer && !onlyGateway) {
  buildImage('cms-client', './client', './client/Dockerfile')
}

if (onlyGateway) {
  buildImage('cms-gateway', './server', './server/nginx.Dockerfile')
}

console.log(`\n═══════════════════════════════════════`)
console.log(`  ✓ Docker 镜像构建完成`)
console.log(`  镜像列表:`)
console.log(`  - cms-server:${tag}`)
if (!onlyServer && !onlyGateway) console.log(`  - cms-client:${tag}`)
if (onlyGateway) console.log(`  - cms-gateway:${tag}`)
console.log(`═══════════════════════════════════════\n`)
