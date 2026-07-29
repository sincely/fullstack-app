# ============================================================================
# Server Dockerfile — 多阶段构建
#
# 阶段 1 (builder)：安装全部依赖，执行 build.js 产出 dist
# 阶段 2 (runtime)：仅复制 dist + 生产依赖，PM2 cluster 模式运行
# ============================================================================

# ── 阶段 1：构建 ──
FROM node:20-alpine AS builder

# bcrypt 等原生模块编译需要 python3/make/g++
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 设置国内 npm 镜像源（容器内无法直连 registry.npmjs.org）
RUN npm config set registry https://registry.npmmirror.com \
  && npm install -g pnpm@9.15.9

# 先复制 lock 文件和 package.json，利用 Docker 层缓存
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用国内镜像源）
RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm install --frozen-lockfile

# 复制源码与构建脚本
COPY src ./src
COPY scripts ./scripts
COPY ecosystem.config.cjs ./
COPY .env.production ./.env.production

# 执行构建：src → dist（含 ecosystem 路径重写）
RUN pnpm run build:prod

# 裁剪为生产依赖（去除 devDependencies）
RUN pnpm prune --prod

# ── 阶段 2：运行时 ──
FROM node:20-alpine AS runtime

# PM2 进程管理
RUN npm install -g pm2@6

WORKDIR /app

# 从 builder 复制构建产物与生产依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 静态资源目录（server.js 中 staticDir 解析为 __dirname/../../public → /app/public）
COPY public ./public

# ecosystem.config.cjs 中 koa-app-prod 监听 PORT=3000
EXPOSE 3000

# 健康检查（快速探针，不探测 DB/Redis）
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# PM2 cluster 模式启动
# ecosystem.config.cjs 在 dist/ 内（build.js 已重写 script 路径为 ./app.js）
# 先 cd dist 再启动，使 ./app.js 正确解析为 dist/app.js
CMD ["sh", "-c", "cd dist && pm2-runtime ecosystem.config.cjs --only koa-app-prod"]
