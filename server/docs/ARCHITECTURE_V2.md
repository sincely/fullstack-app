# Koa 后端架构设计 V2

## 一、架构设计原则

### 1.1 洋葱模型（核心思想）

```
请求 → 错误处理 → 请求ID → 日志 → 安全头 → 跨域 → 请求体解析 → 限流 → 路由 → 响应
```

**三大核心原则**：
1. **洋葱模型让横切关注点各归其位** — 每个中间件只做一件事
2. **中间件顺序就是架构优先级** — 错误处理最外层，安全在业务前
3. **安全是基础设施不是功能** — 在业务代码之前就位

### 1.2 三层分离（让变化隔离）

```
┌─────────────────────────────────────────┐
│         Controller 层（路由控制器）       │
│  - 处理 HTTP 请求/响应                    │
│  - 参数提取与校验                         │
│  - 调用 Service 层                       │
│  - 返回格式化响应                         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Service 层（业务逻辑）            │
│  - 核心业务逻辑                           │
│  - 事务管理                              │
│  - 数据转换与组装                         │
│  - 调用 DAO 层                           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         DAO 层（数据访问）                │
│  - 数据库 CRUD 操作                      │
│  - SQL 查询构建                          │
│  - 数据映射                              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         数据库（MySQL）                   │
└─────────────────────────────────────────┘
```

**核心思想**：Controller/Service/Model 各管各的，改一层不动其他

### 1.3 配置式 RBAC（权限跟着代码走）

**核心思想**：
- **配置优于数据库** — 权限跟着代码走，跨环境可移植，重启即生效
- **叶子声明 + 自动展开** — 角色只声明叶子权限，引擎自动继承父级
- **部门自动角色** — 人调部门，权限自动跟着变
- **数据权限模板引擎** — SQL 条件模板 + 变量替换，5 级预设

---

## 二、目录结构设计

```
server/
├── src/
│   ├── app.js                      # 应用入口（中间件注册顺序即架构）
│   │
│   ├── config/                     # 配置中心
│   │   ├── env.js                  # 环境变量加载（最先执行）
│   │   ├── database.js             # 数据库配置（MySQL + Redis 开关）
│   │   ├── server.js               # 服务器配置（端口、静态目录）
│   │   ├── logger.js               # 日志配置（Pino）
│   │   ├── jwt.js                  # JWT 配置
│   │   ├── cors.js                 # 跨域白名单
│   │   ├── businessCode.js         # 业务错误码
│   │   ├── httpError.js            # HTTP 状态码
│   │   └── koaBodyConfig.js        # 请求体解析配置
│   │
│   ├── core/                       # 核心基础类
│   │   ├── BaseDao.js              # DAO 基类（统一 CRUD 操作）
│   │   └── response.js             # 响应格式化（成功/失败/分页）
│   │
│   ├── middleware/                 # 中间件层（洋葱模型）
│   │   ├── errorCatch.js           # 全局异常捕获（最外层）
│   │   ├── requestId.js            # 请求 ID 追踪
│   │   ├── logger.js               # HTTP 请求日志
│   │   ├── securityHeaders.js      # 安全响应头
│   │   ├── rateLimiter.js          # 限流中间件
│   │   ├── compress.js             # 响应压缩
│   │   ├── rewriteUrl.js           # URL 重写（静态资源）
│   │   ├── authenticate.js         # JWT 认证
│   │   ├── authorize.js            # RBAC 权限校验
│   │   ├── validationMiddleware.js # Zod 参数校验
│   │   └── logMiddleware.js        # 操作日志记录
│   │
│   ├── modules/                    # 业务模块（按功能划分）
│   │   ├── auth/                   # 认证模块
│   │   │   ├── authController.js
│   │   │   ├── authService.js
│   │   │   ├── authDao.js
│   │   │   └── authRouter.js
│   │   │
│   │   ├── user/                   # 用户管理模块
│   │   │   ├── userController.js
│   │   │   ├── userService.js
│   │   │   ├── userDao.js
│   │   │   └── userRouter.js
│   │   │
│   │   ├── role/                   # 角色管理模块
│   │   │   ├── roleController.js
│   │   │   ├── roleService.js
│   │   │   ├── roleDao.js
│   │   │   └── roleRouter.js
│   │   │
│   │   ├── menu/                   # 菜单管理模块
│   │   │   ├── menuController.js
│   │   │   ├── menuService.js
│   │   │   ├── menuDao.js
│   │   │   └── menuRouter.js
│   │   │
│   │   ├── log/                    # 日志模块
│   │   │   ├── operationLogController.js
│   │   │   ├── operationLogService.js
│   │   │   ├── operationLogDao.js
│   │   │   ├── loginLogController.js
│   │   │   ├── loginLogService.js
│   │   │   ├── loginLogDao.js
│   │   │   └── logRouter.js
│   │   │
│   │   ├── permission/             # 权限模块
│   │   │   ├── permissionService.js
│   │   │   └── permissionDao.js
│   │   │
│   │   └── route/                  # 路由模块
│   │       ├── routeController.js
│   │       ├── routeService.js
│   │       └── routeRouter.js
│   │
│   ├── routers/                    # 路由注册中心
│   │   └── index.js                # 统一注册所有模块路由
│   │
│   ├── schemas/                    # Zod 参数校验
│   │   ├── common/                 # 通用校验规则
│   │   │   └── paramsSchema.js
│   │   └── models/                 # 业务模型校验
│   │       ├── authSchema.js
│   │       ├── userSchema.js
│   │       ├── roleSchema.js
│   │       ├── menuSchema.js
│   │       └── logSchema.js
│   │
│   ├── utils/                      # 工具函数
│   │   ├── db.js                   # 数据库连接池
│   │   ├── redis.js                # Redis 客户端（受开关控制）
│   │   ├── jwt.js                  # JWT 工具
│   │   ├── password.js             # 密码加密（bcrypt）
│   │   ├── adminPermission.js      # 权限工具（菜单树构建）
│   │   ├── errorHandler.js         # 错误处理包装器
│   │   ├── createResponse.js       # 响应格式化
│   │   ├── captcha.js              # 验证码工具
│   │   └── validateParams.js       # 参数校验工具
│   │
│   ├── plugins/                    # 插件扩展
│   │   ├── swagger.js              # Swagger API 文档
│   │   └── openapi/
│   │       └── parser.js           # OpenAPI 解析器
│   │
│   ├── jobs/                       # 定时任务 & 队列
│   │   ├── queue.js                # 任务队列定义
│   │   ├── scheduler.js            # 任务调度器
│   │   └── processors/             # 任务处理器
│   │       └── exampleTask.js
│   │
│   └── db/                         # 数据库工程化
│       ├── migrations/             # 数据库迁移脚本
│       └── backups/                # 数据库备份
│
├── docs/                           # 项目文档
├── logs/                           # 运行日志
├── public/                         # 静态资源
├── scripts/                        # 构建 & 部署脚本
└── package.json
```

---

## 三、中间件注册顺序（洋葱模型）

```javascript
// src/app.js

// ========== 全局错误捕获（必须在最前注册）==========
// 1. 全局异常捕获中间件 - 使用 AsyncLocalStorage 绑定请求上下文
app.use(errorCatch)

// 2. 应用级错误监听 - 统一处理所有未捕获异常日志
app.on('error', errorHandler())

// 3. 请求 ID 中间件（确保后续所有中间件都能读取到 requestId）
app.use(requestId)

// 4. HTTP 请求日志中间件
app.use(loggerMiddleware)

// 5. 安全响应头（设置各种 HTTP 安全头）
app.use(securityHeaders)

// 6. 速率限制（防止暴力攻击和频繁请求）
app.use(rateLimiter)

// 7. 跨域处理
app.use(cors(corsConfig))

// 8. Session 中间件（兼容旧代码）
app.use(session(...))

// 9. URL 重写（为静态资源请求重写 url）
app.use(rewriteUrl)

// 10. 响应压缩
app.use(compress)

// 11. 静态资源服务
app.use(KoaStatic(staticDir))

// 12. 请求体解析（必须在路由之前注册）
app.use(KoaBodyParser(bodyParserConfig))

// 13. 路由中间件（包含 authenticate、authorize、validation 等）
app.use(Routers.routes()).use(Routers.allowedMethods())

// 14. Swagger API 文档
registerSwagger(app)
```

**架构优先级**：
1. 错误处理（最外层兜底）
2. 请求追踪（日志关联）
3. 安全防护（安全头 + 限流）
4. 跨域处理
5. 业务处理（路由）

---

## 四、数据库工程化设计

### 4.1 数据库迁移（Migration）

**目标**：解决团队成员数据库结构不一致问题

**设计方案**：

```
db/migrations/
├── 20260722_001_init_schema.sql      # 初始化表结构
├── 20260723_002_add_user_fields.sql  # 新增用户字段
├── 20260724_003_create_role_table.sql
└── migration_log.js                  # 迁移日志记录
```

**迁移方式**：
1. **SQL 文件迁移**（推荐）— 手动编写 SQL，版本可控
2. **Knex 迁移** — 使用 Knex.js 的迁移系统
3. **自定义迁移脚本** — Node.js 脚本执行 SQL

**迁移流程**：
```bash
# 执行迁移
npm run db:migrate

# 回滚迁移
npm run db:rollback

# 查看迁移状态
npm run db:status
```

### 4.2 数据库备份（Backup）

**核心思想**：备份是体系不是复制 — 加密、验证、清理、恢复，缺一不可

**备份策略**：
- **AES-256-GCM 加密** — 备份文件加密存储
- **定时任务** — 每天凌晨 2 点自动备份
- **验证恢复** — 备份后自动验证可恢复性
- **自动清理** — 保留最近 30 天备份

**备份目录结构**：
```
db/backups/
├── 2026-07-22_02-00-00.sql.enc    # 加密备份文件
├── 2026-07-23_02-00-00.sql.enc
└── backup_manifest.json           # 备份清单
```

**备份脚本**：
```javascript
// scripts/backup.js
import { exec } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'

const backupDatabase = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = `db/backups/${timestamp}.sql`

  // 1. 执行 mysqldump
  exec(`mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${backupFile}`)

  // 2. AES-256-GCM 加密
  const encrypted = encryptFile(backupFile)

  // 3. 验证备份可恢复性
  await verifyBackup(encrypted)

  // 4. 清理过期备份（保留 30 天）
  cleanupOldBackups(30)
}
```

### 4.3 数据库版本管理

**版本控制策略**：
1. **迁移脚本版本化** — 文件名包含时间戳和序号
2. **迁移日志表** — 记录已执行的迁移
3. **环境隔离** — dev/test/prod 独立迁移

**迁移日志表**：
```sql
CREATE TABLE migration_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(50) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time INT,
  status ENUM('success', 'failed') NOT NULL
);
```

---

## 五、Redis 开关控制

### 5.1 环境变量控制

```bash
# .env.development
REDIS_ENABLED=false    # 开发环境默认关闭
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

```bash
# .env.production
REDIS_ENABLED=true     # 生产环境开启
REDIS_HOST=redis-prod.internal
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password
REDIS_DB=0
```

### 5.2 Redis 客户端封装（受开关控制）

```javascript
// src/utils/redis.js
import Redis from 'ioredis'
import { redisConfig, redisEnabled } from '../config/database.js'
import logger from '../config/logger.js'

class RedisClient {
  constructor() {
    this.client = null
    this.enabled = redisEnabled
  }

  async init() {
    if (!this.enabled) {
      logger.info('Redis 已禁用，跳过初始化')
      return
    }

    try {
      this.client = new Redis(redisConfig)

      this.client.on('connect', () => {
        logger.info('Redis 连接成功')
      })

      this.client.on('error', (err) => {
        logger.error({ err }, 'Redis 连接错误')
      })
    } catch (error) {
      logger.error({ error }, 'Redis 初始化失败')
    }
  }

  async get(key) {
    if (!this.enabled || !this.client) return null
    return this.client.get(key)
  }

  async set(key, value, ttl) {
    if (!this.enabled || !this.client) return null
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl)
    }
    return this.client.set(key, value)
  }

  async del(key) {
    if (!this.enabled || !this.client) return null
    return this.client.del(key)
  }

  async close() {
    if (this.client) {
      await this.client.quit()
      this.client = null
    }
  }
}

export const redisClient = new RedisClient()
```

### 5.3 使用示例

```javascript
// 在业务代码中使用
import { redisClient } from '../utils/redis.js'

// 自动降级：Redis 未启用时返回 null
const cachedData = await redisClient.get('user:123')
if (cachedData) {
  return JSON.parse(cachedData)
}

// 从数据库查询
const data = await userDao.getUserById(123)

// 写入缓存（Redis 未启用时自动跳过）
await redisClient.set('user:123', JSON.stringify(data), 3600)
```

---

## 六、配置式 RBAC 实现

### 6.1 权限配置优于数据库

**核心理念**：权限跟着代码走，跨环境可移植，重启即生效

**实现方式**：
```javascript
// src/config/permissions.js

// 权限码定义（前后端共用）
export const PERMISSIONS = {
  // 用户管理
  USER_LIST: 'user:list',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 角色管理
  ROLE_LIST: 'role:list',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // 菜单管理
  MENU_LIST: 'menu:list',
  MENU_CREATE: 'menu:create',
  MENU_UPDATE: 'menu:update',
  MENU_DELETE: 'menu:delete',

  // 日志管理
  LOG_LIST: 'log:list',
  LOG_DELETE: 'log:delete',
}

// 角色权限映射（配置式）
export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.USER_LIST,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ROLE_LIST,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.MENU_LIST,
    PERMISSIONS.MENU_CREATE,
    PERMISSIONS.MENU_UPDATE,
    PERMISSIONS.MENU_DELETE,
    PERMISSIONS.LOG_LIST,
    PERMISSIONS.LOG_DELETE,
  ],

  user_manager: [
    PERMISSIONS.USER_LIST,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
  ],

  viewer: [
    PERMISSIONS.USER_LIST,
    PERMISSIONS.ROLE_LIST,
    PERMISSIONS.MENU_LIST,
  ],
}
```

### 6.2 叶子声明 + 自动展开

**核心思想**：角色只声明叶子权限，引擎自动继承父级

```javascript
// src/utils/permissionEngine.js

/**
 * 权限继承引擎
 * 角色只需声明叶子权限，自动继承父级权限
 */
export class PermissionEngine {
  constructor() {
    // 权限层级关系
    this.hierarchy = {
      'user:delete': ['user:update', 'user:create', 'user:list'],
      'user:update': ['user:list'],
      'user:create': ['user:list'],
      'role:delete': ['role:update', 'role:create', 'role:list'],
      'role:update': ['role:list'],
      'menu:delete': ['menu:update', 'menu:create', 'menu:list'],
    }
  }

  /**
   * 展开叶子权限为完整权限列表
   */
  expandPermissions(leafPermissions) {
    const expanded = new Set(leafPermissions)

    for (const perm of leafPermissions) {
      const parents = this.hierarchy[perm] || []
      for (const parent of parents) {
        expanded.add(parent)
      }
    }

    return Array.from(expanded)
  }

  /**
   * 检查用户是否有权限
   */
  hasPermission(userPermissions, requiredPermission) {
    const expanded = this.expandPermissions(userPermissions)
    return expanded.includes(requiredPermission)
  }
}
```

### 6.3 部门自动角色

**核心思想**：人调部门，权限自动跟着变

```javascript
// 用户 - 部门 - 角色关联表
// user_departments 表结构：
// - user_id
// - department_id
// - role_id（部门默认角色）

/**
 * 当用户调部门时，自动继承新部门的角色权限
 */
const transferUserDepartment = async (userId, newDepartmentId) => {
  // 1. 查询新部门的默认角色
  const deptRole = await departmentDao.getDefaultRole(newDepartmentId)

  // 2. 更新用户部门关联
  await userDao.updateUserDepartment(userId, newDepartmentId)

  // 3. 自动绑定新角色（移除旧角色）
  await roleDao.replaceUserRoles(userId, [deptRole.roleId])

  // 4. 清除用户权限缓存
  await redisClient.del(`user:permissions:${userId}`)
}
```

---

## 七、Vue3 前端权限对接

### 7.1 前后端同用一套权限码

```javascript
// 前端路由 meta 定义
{
  path: '/user/list',
  name: 'user_list',
  meta: {
    title: '用户列表',
    permissions: ['user:list']  // 与后端 PERMISSIONS.USER_LIST 一致
  }
}
```

### 7.2 按钮权限控制

```vue
<template>
  <!-- 有权限才显示 -->
  <button v-permission="'user:create'">新增用户</button>
  <button v-permission="'user:delete'">删除用户</button>
</template>

<script setup>
// v-permission 指令实现
import { usePermission } from '@/hooks/usePermission'

const { hasPermission } = usePermission()

// 在代码中判断
if (hasPermission('user:delete')) {
  // 执行删除逻辑
}
</script>
```

---

## 八、定时任务 & 实时通知

### 8.1 模块自声明定时任务

**核心思想**：新功能加一行 register，零侵入

```javascript
// src/jobs/scheduler.js
import { CronJob } from 'cron'
import logger from '../config/logger.js'

class TaskScheduler {
  constructor() {
    this.jobs = new Map()
  }

  /**
   * 注册定时任务
   */
  register(name, cronExpression, handler) {
    const job = new CronJob(cronExpression, async () => {
      try {
        logger.info(`执行定时任务: ${name}`)
        await handler()
        logger.info(`定时任务完成: ${name}`)
      } catch (error) {
        logger.error({ error }, `定时任务失败: ${name}`)
      }
    })

    this.jobs.set(name, job)
    logger.info(`注册定时任务: ${name} (${cronExpression})`)
  }

  /**
   * 启动所有任务
   */
  startAll() {
    for (const [name, job] of this.jobs) {
      job.start()
      logger.info(`启动定时任务: ${name}`)
    }
  }

  /**
   * 停止所有任务
   */
  stopAll() {
    for (const [name, job] of this.jobs) {
      job.stop()
      logger.info(`停止定时任务: ${name}`)
    }
  }
}

export const scheduler = new TaskScheduler()

// 模块自声明示例
// 数据库备份任务（每天凌晨 2 点）
scheduler.register('db-backup', '0 2 * * *', backupDatabase)

// 日志清理任务（每天凌晨 3 点）
scheduler.register('log-cleanup', '0 3 * * *', cleanupOldLogs)
```

### 8.2 数据库自动备份任务

```javascript
// src/jobs/processors/dbBackup.js
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import logger from '../../config/logger.js'

const execAsync = promisify(exec)

export const backupDatabase = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.resolve(process.cwd(), 'db/backups')
  const backupFile = path.join(backupDir, `${timestamp}.sql`)

  try {
    // 1. 执行备份
    await execAsync(
      `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupFile}`
    )

    // 2. 压缩备份文件
    await execAsync(`gzip ${backupFile}`)

    // 3. 验证备份文件
    const stats = fs.statSync(`${backupFile}.gz`)
    if (stats.size === 0) {
      throw new Error('备份文件为空')
    }

    logger.info(`数据库备份成功: ${backupFile}.gz (${stats.size} bytes)`)

    // 4. 清理 30 天前的备份
    cleanupOldBackups(backupDir, 30)

  } catch (error) {
    logger.error({ error }, '数据库备份失败')
    throw error
  }
}

const cleanupOldBackups = (backupDir, days) => {
  const files = fs.readdirSync(backupDir)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  for (const file of files) {
    const filePath = path.join(backupDir, file)
    const stats = fs.statSync(filePath)

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath)
      logger.info(`清理过期备份: ${file}`)
    }
  }
}
```

---

## 九、现有功能保留清单

### 9.1 已实现功能（保持不变）

✅ JWT 双 Token 认证（Access Token + Refresh Token）
✅ 单设备登录控制（SessionId 方案）
✅ RBAC 权限控制（基于角色的访问控制）
✅ 用户管理（CRUD、批量操作、状态管理）
✅ 角色管理（CRUD、权限分配）
✅ 菜单管理（CRUD、树形结构、按钮权限）
✅ 操作日志（记录、查询、删除）
✅ 登录日志（记录、查询、删除）
✅ 动态路由（根据权限生成）
✅ 参数校验（Zod）
✅ 全局错误处理
✅ 请求日志（Pino）
✅ 速率限制
✅ 安全防护（安全头、CSP）
✅ Swagger API 文档
✅ 响应压缩
✅ 跨域处理
✅ 静态资源服务

### 9.2 新增功能

🆕 数据库迁移系统
🆕 数据库自动备份（AES-256-GCM 加密）
🆕 Redis 开关控制（环境变量）
🆕 配置式 RBAC（权限跟着代码走）
🆕 权限继承引擎（叶子声明 + 自动展开）
🆕 部门自动角色
🆕 模块自声明定时任务
🆕 BaseDao 基类（统一 CRUD）

---

## 十、实施计划

### Phase 1: 架构重构（保持功能不变）

1. ✅ 调整目录结构（modules 模块化）
2. ✅ 提取 BaseDao 基类
3. ✅ 统一响应格式
4. ✅ 完善中间件注释

### Phase 2: 数据库工程化

1. 🔄 实现数据库迁移脚本
2. 🔄 实现数据库备份任务
3. 🔄 添加迁移日志表

### Phase 3: Redis 开关控制

1. 🔄 封装 RedisClient 类
2. 🔄 添加 REDIS_ENABLED 环境变量
3. 🔄 业务代码自动降级

### Phase 4: 配置式 RBAC

1. 🔄 创建 permissions.js 配置文件
2. 🔄 实现权限继承引擎
3. 🔄 重构 authorize 中间件

### Phase 5: 定时任务系统

1. 🔄 实现 TaskScheduler
2. 🔄 模块自声明任务注册
3. 🔄 数据库备份任务

---

## 十一、环境变量配置

```bash
# .env.development
NODE_ENV=development
PORT=8080

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cms_db
DB_POOL_SIZE=10

# Redis（开发环境默认关闭）
REDIS_ENABLED=false
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_WHITELIST=http://localhost:9528,http://localhost:3000
```

```bash
# .env.production
NODE_ENV=production
PORT=8080

# 数据库
DB_HOST=mysql-prod.internal
DB_PORT=3306
DB_USER=prod_user
DB_PASSWORD=prod_secure_password
DB_NAME=cms_prod
DB_POOL_SIZE=20

# Redis（生产环境开启）
REDIS_ENABLED=true
REDIS_HOST=redis-prod.internal
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_password
REDIS_DB=0

# JWT
JWT_SECRET=prod_jwt_secret_key_very_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=prod_refresh_secret_key_very_long
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_WHITELIST=https://yourdomain.com
```

---

## 十二、总结

本次架构重构遵循需求文档的核心理念：

1. **洋葱模型** — 中间件各司其职，顺序即架构
2. **三层分离** — Controller/Service/DAO 各管各的
3. **配置式 RBAC** — 权限跟着代码走，重启即生效
4. **数据库工程化** — 迁移、备份、版本管理
5. **Redis 开关** — 通过环境变量控制，灵活切换

所有原有功能保持不变，新增功能通过模块化设计零侵入集成。
