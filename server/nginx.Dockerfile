# ============================================================================
# Nginx Gateway Dockerfile — 反向代理网关
#
# 基于官方 nginx:alpine，挂载自定义 nginx.conf
# 在 docker-compose.yml 中通过 volume 挂载配置，此 Dockerfile 供独立构建使用
# ============================================================================

FROM nginx:alpine

# 复制网关配置（覆盖默认 nginx.conf）
COPY nginx.conf /etc/nginx/nginx.conf

# 验证配置语法
RUN nginx -t

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
