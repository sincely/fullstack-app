#!/usr/bin/env bash
# ============================================================================
# Docker Compose 全栈管理脚本
#
# 用法：
#   ./scripts/docker-up.sh              # 启动全栈（后台）
#   ./scripts/docker-up.sh --build       # 重新构建并启动
#   ./scripts/docker-up.sh --gateway     # 启动全栈 + 网关
#   ./scripts/docker-up.sh --dev         # 仅启动 MySQL + Redis（开发用）
#   ./scripts/docker-up.sh --logs        # 启动并查看日志（前台）
#   ./scripts/docker-up.sh down          # 停止并清理
#   ./scripts/docker-up.sh down -v       # 停止并清理数据卷
# ============================================================================

set -euo pipefail

# 切换到项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

ACTION="${1:-up}"
shift || true

case "$ACTION" in
  up)
    EXTRA_ARGS=""
    # 解析后续参数
    for arg in "$@"; do
      case "$arg" in
        --build)
          EXTRA_ARGS="$EXTRA_ARGS --build"
          ;;
        --gateway)
          EXTRA_ARGS="$EXTRA_ARGS --profile gateway"
          ;;
        --dev)
          # 仅启动基础设施（MySQL + Redis），用于本地开发
          echo "启动开发基础设施（MySQL + Redis）..."
          docker compose up -d mysql redis
          echo "等待服务就绪..."
          sleep 5
          docker compose ps mysql redis
          echo ""
          echo "✓ 基础设施已启动"
          echo "  MySQL: mysql:3306（容器内）"
          echo "  Redis: redis:6379（容器内）"
          echo "  本地开发时在 .env.development 中使用 localhost 连接"
          exit 0
          ;;
        --logs)
          EXTRA_ARGS="$EXTRA_ARGS"  # 不加 -d，前台运行
          ;;
        *)
          EXTRA_ARGS="$EXTRA_ARGS $arg"
          ;;
      esac
    done

    # 判断是否前台模式
    if echo "$EXTRA_ARGS" | grep -q -- "--logs"; then
      EXTRA_ARGS="${EXTRA_ARGS//--logs/}"
      echo "启动全栈（前台模式，Ctrl+C 停止）..."
      docker compose up $EXTRA_ARGS
    else
      echo "启动全栈（后台模式）..."
      docker compose up -d $EXTRA_ARGS
      echo ""
      echo "等待服务就绪..."
      sleep 8
      docker compose ps
      echo ""
      echo "✓ 全栈已启动"
      echo "  前端: http://localhost:9528"
      echo "  后端: http://localhost:8090/api/health"
      echo ""
      echo "  查看日志: docker compose logs -f"
      echo "  停止:     ./scripts/docker-up.sh down"
    fi
    ;;

  down)
    CLEAN_VOLUMES=""
    for arg in "$@"; do
      case "$arg" in
        -v) CLEAN_VOLUMES="-v" ;;
      esac
    done

    echo "停止并清理容器..."
    docker compose down $CLEAN_VOLUMES
    if [ -n "$CLEAN_VOLUMES" ]; then
      echo "✓ 已清理数据卷（MySQL/Redis 数据已删除）"
    else
      echo "✓ 容器已停止（数据卷保留）"
    fi
    ;;

  status|ps)
    docker compose ps
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -n "$SERVICE" ]; then
      docker compose logs -f "$SERVICE"
    else
      docker compose logs -f
    fi
    ;;

  restart)
    SERVICE="${2:-}"
    if [ -n "$SERVICE" ]; then
      echo "重启 $SERVICE..."
      docker compose restart "$SERVICE"
    else
      echo "重启全部服务..."
      docker compose restart
    fi
    echo "✓ 重启完成"
    ;;

  *)
    echo "用法: $0 {up [--build|--gateway|--dev|--logs]|down [-v]|status|logs [service]|restart [service]}"
    exit 1
    ;;
esac
