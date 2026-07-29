# ============================================================================
# Client Dockerfile — 多阶段构建
#
# 阶段 1 (builder)：pnpm workspace 安装依赖，Vite 构建产出 dist
# 阶段 2 (runtime)：nginx:alpine 服务静态资源
# ============================================================================

# ── 阶段 1：构建 ──
FROM node:20-alpine AS builder

WORKDIR /app

# 启用 Corepack 管理 pnpm
RUN corepack enable && corepack prepare pnpm@8.15.7 --activate

# 先复制 workspace 配置与 lock 文件，利用层缓存
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages ./packages

# 安装 workspace 依赖（含内部包链接）
RUN pnpm install --frozen-lockfile

# 复制源码与构建配置
COPY src ./src
COPY build ./build
COPY public ./public
COPY index.html vite.config.js uno.config.js jsconfig.json ./
COPY .env.test ./.env.test

# Vite 构建（测试环境模式，对应 package.json 的 build:test）
RUN pnpm run build:test

# ── 阶段 2：运行时 ──
FROM nginx:alpine AS runtime

# 复制自定义 nginx 配置（前端静态资源服务）
COPY nginx/client.conf /etc/nginx/conf.d/default.conf

# 从 builder 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
