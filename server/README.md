# CMS 后台管理系统 - Node.js 服务端

基于 Koa 3 + MySQL 8 + Redis 构建的企业级 RBAC 后台管理系统服务端，提供完整的用户认证、权限管理、日志审计等企业级功能。

## 特性

- ✅ **完整的 RBAC 权限体系**：用户-角色-菜单-按钮四级权限控制
- ✅ **JWT 双 Token 认证**：Access Token + Refresh Token，支持无感刷新与单设备登录控制
- ✅ **三层架构分层**：Controller → Service → DAO，职责清晰，易于维护和扩展
- ✅ **Zod 参数校验**：类型安全的请求参数校验，自动生成错误信息
- ✅ **完善的日志系统**：操作日志 + 登录日志持久化，Pino 高性能请求日志
- ✅ **数据库迁移与备份**：自研 MigrationRunner 支持迁移/回滚，AES-256-GCM 加密备份
- ✅ **安全加固**：安全响应头、CORS 白名单、速率限制、请求体大小限制
- ✅ **多环境支持**：development / test / production 三套环境配置
- ✅ **多种部署方案**：PM2 集群、Docker、Nginx 反向代理、Vercel Serverless
- ✅ **代码规范**：ESLint + Prettier + husky + lint-staged，提交前自动检查

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | Node.js | ≥ 20.0 | ES Modules，使用 `.nvmrc` 锁定版本 |
| **Web 框架** | Koa | 3.2.0 | 轻量级、洋葱模型中间件架构 |
| **路由** | @koa/router | 15.4.0 | RESTful 路由定义 |
| **数据库** | MySQL | 8.0+ | 关系型数据库，utf8mb4 字符集 |
| **数据库驱动** | mysql2 | 3.16.3 | Promise API，连接池，参数化查询 |
| **缓存** | Redis | 7.0+ | 可选依赖，用于 Bull 任务队列 |
| **缓存驱动** | ioredis | 5.10.1 | Redis 客户端 |
| **任务队列** | Bull | 4.16.5 | 基于 Redis 的分布式任务队列 |
| **认证** | jsonwebtoken | 9.0.3 | JWT 签发与验证 |
| **密码加密** | bcrypt | 6.0.0 | 加盐哈希，防彩虹表攻击 |
| **参数校验** | Zod | 4.3.6 | TypeScript-first 的 schema 校验库 |
| **日志** | Pino | 10.3.1 | 超高性能 JSON 日志库 |
| **日志美化** | pino-pretty | 13.1.3 | 开发环境日志格式化输出 |
| **API 文档** | swagger-jsdoc | 6.2.8 | OpenAPI 3.0 规范生成 |
| **进程管理** | PM2 | - | 生产环境进程守护与集群部署 |
| **代码规范** | ESLint + Prettier | 9.x / 3.x | 代码风格统一与自动修复 |
| **版本发布** | release-it | 19.2.4 | 自动化版本管理与 CHANGELOG 生成 |

## 目录结构

```
server/
├── docs/                       # 文档目录
│   ├── ARCHITECTURE.md         # 架构设计文档
│   ├── DEPLOY_GUIDE.md         # 部署指南
│   ├── SECURITY.md             # 安全说明
│   └── RBAC_MODEL_DESIGN.md    # RBAC 权限模型设计
│
├── scripts/                    # 脚本目录
│   ├── build.js                # 构建脚本（复制 src → dist）
│   ├── db-cli.js               # 数据库迁移/备份 CLI
│   ├── generateApiDoc.js       # 生成 OpenAPI JSON
│   └── release.js              # 版本发布脚本
│
├── src/
│   ├── app.js                  # 应用入口（中间件注册、服务器启动）
│   ├── worker.js               # 后台任务 Worker（Bull 队列）
│   │
│   ├── config/                 # 配置文件
│   │   ├── env.js              # 环境变量加载（dotenv）
│   │   ├── database.js         # MySQL/Redis 连接配置
│   │   ├── jwt.js              # JWT 密钥与过期时间
│   │   ├── cors.js             # CORS 跨域配置
│   │   ├── server.js           # 服务器端口与静态资源目录
│   │   ├── logger.js           # Pino 日志配置
│   │   ├── businessCode.js     # 业务错误码定义
│   │   └── httpError.js        # HTTP 状态码定义
│   │
│   ├── db/                     # 数据库模块
│   │   ├── connection.js       # MySQL 连接池封装
│   │   ├── redis.js            # Redis 客户端单例
│   │   ├── migrations/         # 数据库迁移脚本
│   │   │   ├── MigrationRunner.js  # 迁移执行器
│   │   │   └── index.js        # 迁移入口
│   │   └── backups/            # 数据库备份模块
│   │       ├── BackupManager.js    # 备份管理器
│   │       ├── backupJob.js        # 定时备份任务
│   │       └── index.js
│   │
│   ├── jobs/                   # 后台任务
│   │   ├── queue.js            # Bull 队列实例
│   │   ├── scheduler.js        # 定时任务注册
│   │   └── processors/         # 任务处理器
│   │       └── exampleTask.js
│   │
│   ├── middleware/             # 中间件
│   │   ├── errorCatch.js       # 全局错误捕获（洋葱模型最外层）
│   │   ├── requestId.js        # 请求 ID 生成与传递
│   │   ├── logger.js           # HTTP 请求日志（pino-http）
│   │   ├── securityHeaders.js  # 安全响应头
│   │   ├── rateLimiter.js      # 速率限制
│   │   ├── compress.js         # Gzip 压缩
│   │   ├── rewriteUrl.js       # URL 重写
│   │   ├── logMiddleware.js    # 操作日志记录
│   │   ├── authenticate.js     # JWT 认证中间件
│   │   ├── authorize.js        # RBAC 权限校验中间件
│   │   └── validationMiddleware.js # Zod 参数校验中间件
│   │
│   ├── modules/                # 业务模块（按功能划分）
│   │   ├── auth/               # 认证模块
│   │   │   ├── authRouter.js       # 路由定义
│   │   │   ├── authController.js   # 控制器（请求处理）
│   │   │   ├── authService.js      # 服务层（业务逻辑）
│   │   │   ├── authDao.js          # 数据访问层（SQL 查询）
│   │   │   └── index.js            # 模块导出
│   │   ├── user/               # 用户管理模块
│   │   ├── role/               # 角色管理模块
│   │   ├── menu/               # 菜单管理模块
│   │   ├── log/                # 日志模块（操作日志 + 登录日志）
│   │   ├── permission/         # 权限模块（仅 DAO，供其他模块调用）
│   │   └── route/              # 前端路由模块
│   │
│   ├── routers/                # 路由注册
│   │   ├── index.js            # 主路由（聚合所有模块路由）
│   │   └── modules/
│   │       └── systemManageRouter.js  # 系统管理路由聚合
│   │
│   ├── schemas/                # Zod 参数校验 Schema
│   │   ├── common/
│   │   │   ├── paginationSchema.js   # 通用分页 Schema
│   │   │   └── paramsSchema.js       # 通用参数 Schema
│   │   ├── auth/authSchema.js        # 认证相关 Schema
│   │   ├── user/userSchema.js        # 用户相关 Schema
│   │   ├── role/roleSchema.js        # 角色相关 Schema
│   │   ├── menu/menuSchema.js        # 菜单相关 Schema
│   │   └── log/logSchema.js          # 日志相关 Schema
│   │
│   └── utils/                  # 工具函数
│       ├── jwt.js              # JWT 签发/验证/刷新
│       ├── password.js         # 密码加密/验证
│       ├── response.js         # 统一响应构造
│       ├── errorHandler.js     # 控制器错误包装器
│       ├── adminPermission.js  # 权限树构建
│       └── captcha.js          # 验证码（可选）
│
├── public/                     # 静态资源目录
├── logs/                       # 日志文件目录（按日期分文件）
│
├── .env.development            # 开发环境变量
├── .env.test                   # 测试环境变量
├── .env.production             # 生产环境变量
├── ecosystem.config.cjs        # PM2 进程管理配置
├── nginx.conf                  # Nginx 反向代理配置
├── vercel.json                 # Vercel 部署配置
├── deploy.sh                   # 部署脚本（tar + scp + ssh）
└── package.json                # 依赖与脚本定义
```

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端请求                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx 反向代理                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  /api/*      │  │  /admin/*    │  │  /*          │          │
│  │  → Node.js   │  │  → 前端管理   │  │  → 前端展示   │          │
│  │  :8080       │  │  :3000       │  │  :3001       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Koa 应用（洋葱模型中间件）                      │
│                                                                  │
│  ┌─ 基础设施层 ─────────────────────────────────────────────┐   │
│  │  errorCatch → requestId → logger                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─ 安全层 ────────────────────────────────────────────────┐   │
│  │  securityHeaders → cors → rateLimiter                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─ 请求处理层 ────────────────────────────────────────────┐   │
│  │  bodyParser → session → rewriteUrl → compress → static   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─ 业务层 ────────────────────────────────────────────────┐   │
│  │  Router → authenticate → authorize → validate → Ctrl     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        业务模块架构                               │
│                                                                  │
│   Controller          Service              DAO                   │
│   (请求适配)    →    (业务逻辑)    →    (数据访问)                │
│   ctx 操作          纯函数               SQL 查询                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MySQL 8 + Redis                             │
└─────────────────────────────────────────────────────────────────┘
```

### 中间件执行流程（洋葱模型）

```
请求进入 →
┌─────────────────────────────────────────────────────────────────┐
│ 1. errorCatch        全局异常捕获（AsyncLocalStorage 上下文）      │
│ 2. requestId         生成/传递 X-Request-Id                      │
│ 3. logger            pino-http 请求日志                           │
│ 4. securityHeaders   安全响应头（HSTS, CSP, X-Frame-Options）     │
│ 5. cors              跨域处理（开发全开/生产白名单）                │
│ 6. rateLimiter       速率限制（100次/15分钟，登录20次/分钟）       │
│ 7. bodyParser        请求体解析（JSON/Form/Text/XML，10MB 限制）  │
│ 8. session           Cookie Session（24h 有效期）                 │
│ 9. rewriteUrl        静态资源 URL 重写                            │
│ 10. compress         Gzip/Deflate 压缩（>2KB）                    │
│ 11. static           静态资源服务                                 │
│ 12. Router           路由分发                                     │
│     ├─ /api/health   健康检查（无需认证）                          │
│     ├─ /api/auth/*   认证路由（登录/注册/登出）                    │
│     │   └─ operationLogMiddleware  操作日志记录                    │
│     ├─ /api/user/*   用户管理（需认证 + 授权）                     │
│     ├─ /api/role/*   角色管理（需认证 + 授权）                     │
│     ├─ /api/menu/*   菜单管理（需认证 + 授权）                     │
│     └─ /api/log/*    日志管理（需认证 + 授权）                     │
└─────────────────────────────────────────────────────────────────┘
→ 响应返回
```

### 认证授权流程

```
客户端请求
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    authenticate 中间件                           │
│                                                                  │
│  1. 检查 Authorization 头是否存在                                 │
│     ├─ 不存在 → 401 未授权                                       │
│     └─ 存在 → 继续                                               │
│                                                                  │
│  2. 解析 Bearer Token                                           │
│     ├─ 格式错误 → 401 Token 格式错误                             │
│     └─ 格式正确 → 继续                                           │
│                                                                  │
│  3. JWT 验证                                                    │
│     ├─ 过期 → 401 Token 过期（code: 1001）                       │
│     ├─ 无效 → 401 Token 无效（code: 1001）                       │
│     └─ 有效 → 继续                                               │
│                                                                  │
│  4. 查询数据库，获取 sessionExpire 和 sessionId                  │
│     ├─ sessionExpire 已过期 → 401 会话已过期（code: 1002）       │
│     └─ 未过期 → 继续                                             │
│                                                                  │
│  5. 比对 JWT sessionId 与数据库 sessionId                       │
│     ├─ 不匹配 → 401 账号在其他设备登录（code: 1002）             │
│     └─ 匹配 → 继续                                               │
│                                                                  │
│  6. 设置 ctx.state.user = decoded（用户信息）                    │
│     设置 ctx.state.token = token                                │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    authorize 中间件                              │
│                                                                  │
│  1. 从 ctx.state.user.roleIds 获取用户角色                       │
│     ├─ 无角色 → 403 未授权                                       │
│     └─ 有角色 → 继续                                             │
│                                                                  │
│  2. 查询 permissionDao 获取角色关联的菜单权限                     │
│                                                                  │
│  3. 检查当前请求路径是否在权限列表中                               │
│     ├─ 不在 → 403 权限不足（code: 40012）                        │
│     └─ 在 → 继续                                                 │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    validate 中间件                               │
│                                                                  │
│  1. 从 Zod Schema 校验 ctx.request.body 或 ctx.query            │
│     ├─ 校验失败 → 400 参数错误（返回具体字段错误信息）            │
│     └─ 校验成功 → 继续                                           │
│                                                                  │
│  2. 将校验后的数据写回 ctx.request.body / ctx.query             │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Controller 控制器                             │
│                                                                  │
│  1. 调用 Service 执行业务逻辑                                    │
│  2. 使用 setBody() 构造统一响应                                  │
│  3. 返回 { code, msg, data }                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 业务模块三层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Controller 层                             │
│  职责：HTTP 请求适配、响应构造                                    │
│  - 从 ctx 读取参数                                               │
│  - 调用 Service                                                  │
│  - 使用 setBody() 构造响应                                       │
│  - 不直接操作 ctx 以外的对象                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service 层                                │
│  职责：业务逻辑编排                                               │
│  - 纯函数，不依赖 Koa ctx                                        │
│  - 调用 DAO 查询/写入数据                                        │
│  - 返回 { success, data?, error? }                               │
│  - 可跨模块调用其他 Service                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DAO 层                                    │
│  职责：数据访问                                                   │
│  - 封装 SQL 查询                                                 │
│  - 使用参数化查询防注入                                          │
│  - 管理数据库事务                                                │
│  - 返回原始数据行                                                │
└─────────────────────────────────────────────────────────────────┘
```

**示例：用户创建流程**

```javascript
// 1. Router 定义路由
router.post('/systemManage/saveUser',
  authenticate,                    // JWT 认证
  authorizeRoute('/manage/user'),  // RBAC 授权
  validateBody(UserCreateBodySchema), // Zod 校验
  errorControllerWrapper(userManageController.createUser) // 错误包装
)

// 2. Controller 处理请求
const createUser = async (ctx) => {
  const result = await userService.createUser(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code, result.msg)
  setBody(ctx, 200, '创建成功', result.data)
}

// 3. Service 执行业务逻辑
const createUser = async (body) => {
  const { username, email, roleId } = body

  // 检查用户名是否已存在
  const existing = await userDao.findByUsername(username)
  if (existing) return { success: false, code: 40005, msg: '用户名已存在' }

  // 检查邮箱是否已存在
  const existingEmail = await userDao.findByEmail(email)
  if (existingEmail) return { success: false, code: 40013, msg: '邮箱已存在' }

  // 检查角色是否存在
  const role = await roleDao.findById(roleId)
  if (!role) return { success: false, code: 40011, msg: '角色不存在' }

  // 加密密码
  const passwordHash = await hashPassword(body.password || '123456')

  // 创建用户（事务）
  const userId = await userDao.createUser({ ...body, passwordHash })

  return { success: true, data: { id: userId } }
}

// 4. DAO 执行 SQL
const createUser = async (user) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()

    // 插入用户表
    const [result] = await connection.query(
      'INSERT INTO Users (username, email, password, ...) VALUES (?, ?, ?, ...)',
      [user.username, user.email, user.passwordHash, ...]
    )
    const userId = result.insertId

    // 插入用户-角色关联表
    await connection.query(
      'INSERT INTO UserRole (userId, roleId) VALUES (?, ?)',
      [userId, user.roleId]
    )

    await connection.commit()
    return userId
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
}
```

## 数据库设计

### ER 图

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users     │         │   UserRole   │         │    Roles     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ userId (FK)  │         │ roleId (PK)  │
│ username     │         │ roleId (FK)  │────────►│ roleName     │
│ email        │         └──────────────┘         │ roleCode     │
│ password     │                                   │ description  │
│ status       │                                   │ status       │
│ sessionId    │                                   └──────────────┘
│ sessionExpire│
│ currentToken │         ┌──────────────┐         ┌──────────────┐
└──────────────┘         │  RoleRoute   │         │  RouteAuth   │
                         ├──────────────┤         ├──────────────┤
                         │ roleId (FK)  │         │ routeId (PK) │
                         │ routeId (FK) │────────►│ routeName    │
                         └──────────────┘         │ routePath    │
                                                  │ component    │
                         ┌──────────────┐         │ parentId     │
                         │  RoleButton  │         │ orderNum     │
                         ├──────────────┤         └──────────────┘
                         │ roleId (FK)  │
                         │ buttonId (FK)│────────►┌──────────────┐
                         └──────────────┘         │ ButtonAuth   │
                                                  ├──────────────┤
┌──────────────┐         ┌──────────────┐         │ buttonId (PK)│
│  LoginLog    │         │OperationLog  │         │ routeId (FK) │
├──────────────┤         ├──────────────┤         │ buttonName   │
│ logId (PK)   │         │ logId (PK)   │         │ buttonLabel  │
│ userId       │         │ userId       │         └──────────────┘
│ username     │         │ username     │
│ loginType    │         │ action       │
│ ipAddress    │         │ method       │
│ browser      │         │ requestUrl   │
│ os           │         │ requestParams│
│ userAgent    │         │ responseStatus│
│ status       │         │ executeTime  │
│ message      │         │ ipAddress    │
│ sessionId    │         │ userAgent    │
│ createTime   │         │ status       │
└──────────────┘         │ createTime   │
                         └──────────────┘
```

### 核心表说明

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `Users` | 用户表 | id, username, email, password, status, sessionId, sessionExpire, currentRefreshToken |
| `Roles` | 角色表 | roleId, roleName, roleCode, description, status |
| `UserRole` | 用户-角色关联表 | userId, roleId |
| `RouteAuth` | 菜单/路由权限表 | routeId, routeName, routePath, component, parentId, orderNum |
| `RoleRoute` | 角色-菜单关联表 | roleId, routeId |
| `ButtonAuth` | 按钮权限表 | buttonId, routeId, buttonName, buttonLabel |
| `RoleButton` | 角色-按钮关联表 | roleId, buttonId |
| `LoginLog` | 登录日志表 | logId, userId, username, loginType, ipAddress, status, message |
| `OperationLog` | 操作日志表 | logId, userId, username, action, method, requestUrl, responseStatus |

## API 接口

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 管理员登录 | ❌ |
| POST | `/api/auth/register` | 管理员注册 | ❌ |
| POST | `/api/auth/refreshToken` | 刷新 Token | ❌ |
| POST | `/api/auth/logout` | 退出登录 | ✅ |
| GET | `/api/auth/profile` | 获取当前用户信息 | ✅ |
| GET | `/api/auth/menus` | 获取当前用户菜单 | ✅ |
| GET | `/api/auth/permissions` | 获取当前用户权限 | ✅ |

### 用户管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/systemManage/getUserList` | 获取用户列表 | `/manage/user` |
| POST | `/api/systemManage/saveUser` | 创建用户 | `/manage/user` |
| POST | `/api/systemManage/updateUser` | 更新用户 | `/manage/user` |
| POST | `/api/systemManage/deleteUser` | 删除用户 | `/manage/user` |
| POST | `/api/systemManage/batchDeleteUser` | 批量删除用户 | `/manage/user` |
| POST | `/api/systemManage/updateUserStatus` | 更新用户状态 | `/manage/user` |
| POST | `/api/systemManage/resetUserPassword` | 重置用户密码 | `/manage/user` |

### 角色管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/systemManage/getRoleList` | 获取角色列表 | `/manage/role` |
| GET | `/api/systemManage/getAllRoles` | 获取全部角色（下拉选项） | `/manage/user` 或 `/manage/role` |
| POST | `/api/systemManage/saveRole` | 创建角色 | `/manage/role` |
| POST | `/api/systemManage/updateRole` | 更新角色 | `/manage/role` |
| POST | `/api/systemManage/deleteRole` | 删除角色 | `/manage/role` |
| GET | `/api/systemManage/getRoleRouteIds` | 获取角色菜单权限 | `/manage/role` |
| POST | `/api/systemManage/updateRoleRouteIds` | 更新角色菜单权限 | `/manage/role` |
| GET | `/api/systemManage/getRoleButtonIds` | 获取角色按钮权限 | `/manage/role` |
| POST | `/api/systemManage/updateRoleButtonIds` | 更新角色按钮权限 | `/manage/role` |

### 菜单管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/systemManage/getMenuList` | 获取菜单列表（分页） | `/manage/menu` |
| GET | `/api/systemManage/getMenuList/v2` | 获取菜单列表（树形） | `/manage/menu` |
| GET | `/api/systemManage/getMenuTree` | 获取菜单树 | `/manage/menu` |
| POST | `/api/systemManage/saveMenu` | 创建菜单 | `/manage/menu` |
| POST | `/api/systemManage/updateMenu` | 更新菜单 | `/manage/menu` |
| POST | `/api/systemManage/deleteMenu` | 删除菜单 | `/manage/menu` |

### 日志管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/log/getOperationLogList` | 获取操作日志列表 | `/log` |
| GET | `/api/log/getOperationLogDetail` | 获取操作日志详情 | `/log` |
| POST | `/api/log/batchDeleteOperationLog` | 批量删除操作日志 | `/log` |
| POST | `/api/log/clearOperationLogs` | 清空操作日志 | `/log` |
| GET | `/api/log/getLoginLogList` | 获取登录日志列表 | `/log` |
| GET | `/api/log/getLoginLogDetail` | 获取登录日志详情 | `/log` |
| POST | `/api/log/batchDeleteLoginLog` | 批量删除登录日志 | `/log` |
| POST | `/api/log/clearLoginLogs` | 清空登录日志 | `/log` |

### 前端路由接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/route/getConstantRoutes` | 获取常量路由（登录、404 等） | ❌ |
| GET | `/api/route/getUserRoutes` | 获取用户动态路由 | ✅ |
| GET | `/api/route/isRouteExist` | 检查路由是否存在 | ✅ |

### 统一响应格式

**成功响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": { ... }
}
```

**失败响应：**
```json
{
  "code": 40005,
  "msg": "用户名已存在",
  "data": null
}
```

**分页响应：**
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "records": [...],
    "current": 1,
    "size": 10,
    "total": 100
  }
}
```

### 业务错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 1001 | Token 过期 |
| 1002 | 账号在其他设备登录 |
| 40001 | 用户名或密码为空 |
| 40002 | 用户名格式错误 |
| 40003 | 密码格式错误 |
| 40004 | 用户不存在 |
| 40005 | 用户已存在 |
| 40006 | 用户名或密码错误 |
| 40010 | 账号已被禁用 |
| 40011 | 角色不存在 |
| 40012 | 权限不足 |
| 40013 | 邮箱已存在 |
| 40014 | 角色已存在 |
| 40015 | 角色仍被使用 |
| 40016 | 菜单路径已存在 |
| 40017 | 菜单名称已存在 |
| 40018 | 菜单存在子节点 |
| 40019 | 不能删除自己 |
| 40020 | 身份证号已存在 |
| 40021 | 不能禁用自己 |

## 快速开始

### 环境要求

- Node.js ≥ 20.0（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理）
- MySQL ≥ 8.0
- Redis ≥ 7.0（可选，用于任务队列）

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install
```

### 数据库初始化

```bash
# 1. 创建数据库
mysql -u root -p -e "CREATE DATABASE new_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 执行初始化 SQL（如果提供了）
mysql -u root -p new_cms < src/db/init.sql

# 3. 运行数据库迁移
npm run db:migrate
```

### 配置环境变量

复制并修改环境变量文件：

```bash
# 开发环境
cp .env.development.example .env.development

# 生产环境
cp .env.production.example .env.production
```

**必须配置的变量：**

```ini
# JWT 密钥（生产环境务必修改为强随机字符串）
JWT_SECRET=your-secret-key-at-least-32-characters

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=new_cms

# Redis 配置（可选）
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_ENABLED=false  # 设置为 true 启用 Redis
```

### 启动服务

```bash
# 开发环境（热重载）
npm run dev

# 开发环境（Windows 中文支持）
npm run dev:win

# 启动 Worker（后台任务）
npm run worker

# 生产环境构建
npm run build:prod

# 生产环境启动（PM2）
pm2 start ecosystem.config.cjs --only koa-app-prod
```

### 访问服务

- **API 服务**：http://localhost:8080
- **健康检查**：http://localhost:8080/api/health
- **API 文档**：http://localhost:8080/docs（需启用 Swagger）

## 部署指南

### 方案一：PM2 集群部署（推荐）

**适用场景**：传统服务器部署、多核 CPU 利用

```bash
# 1. 安装 PM2
npm install -g pm2

# 2. 构建生产版本
npm run build:prod

# 3. 启动应用（集群模式，自动利用多核 CPU）
pm2 start ecosystem.config.cjs --only koa-app-prod

# 4. 启动 Worker（后台任务，单实例）
pm2 start ecosystem.config.cjs --only koa-worker-prod

# 5. 保存进程列表（开机自启）
pm2 save
pm2 startup
```

**PM2 常用命令：**

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs koa-app-prod

# 重启应用
pm2 restart koa-app-prod

# 停止应用
pm2 stop koa-app-prod

# 删除应用
pm2 delete koa-app-prod

# 监控面板
pm2 monit
```

**ecosystem.config.cjs 配置说明：**

```javascript
module.exports = {
  apps: [
    {
      name: 'koa-app-prod',        // 应用名称
      script: './dist/app.js',      // 启动脚本
      instances: 'max',             // 实例数（'max' 表示 CPU 核心数）
      exec_mode: 'cluster',         // 集群模式
      max_memory_restart: '1G',      // 内存超过 1G 自动重启
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
```

### 方案二：Docker 部署

**适用场景**：容器化部署、微服务架构

**Dockerfile：**

```dockerfile
# 使用 Node.js 20 Alpine 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build:prod

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["node", "dist/app.js"]
```

**docker-compose.yml：**

```yaml
version: '3.8'

services:
  # Node.js 应用
  app:
    build: .
    container_name: cms-server-node
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    restart: always

  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: cms-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: your-password
      MYSQL_DATABASE: new_cms
    volumes:
      - mysql-data:/var/lib/mysql
    restart: always

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: cms-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: always

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: cms-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    restart: always

volumes:
  mysql-data:
  redis-data:
```

**启动 Docker：**

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

### 方案三：Nginx 反向代理

**适用场景**：与前端应用同域部署、负载均衡

**nginx.conf 配置：**

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    # Node.js 后端服务
    upstream cms-server-node {
        server 127.0.0.1:8080;
        # 可配置多个实例实现负载均衡
        # server 127.0.0.1:8081;
        # server 127.0.0.1:8082;
    }

    # 前端管理后台
    upstream cms-frontend-manage {
        server 127.0.0.1:3000;
    }

    # 前端展示站点
    upstream cms-frontend-web {
        server 127.0.0.1:3001;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Gzip 压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript;
        gzip_min_length 1000;

        # API 接口代理
        location /api/ {
            proxy_pass http://cms-server-node;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 管理后台
        location /admin {
            proxy_pass http://cms-frontend-manage/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 前端展示站点
        location / {
            proxy_pass http://cms-frontend-web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 静态资源缓存
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://cms-frontend-web;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**启动 Nginx：**

```bash
# 测试配置
nginx -t

# 重载配置
nginx -s reload

# 重启 Nginx
systemctl restart nginx
```

### 方案四：Vercel Serverless 部署

**适用场景**：快速部署、无需运维、自动扩容

**vercel.json 配置：**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**部署步骤：**

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel

# 4. 部署到生产环境
vercel --prod
```

**在 Vercel Dashboard 配置环境变量：**

- `JWT_SECRET`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

**注意事项：**

- Vercel Serverless 不支持长连接，MySQL 连接池可能失效
- 建议配合 Vercel KV（Redis）或 PlanetScale（MySQL）等云数据库
- Worker 任务队列无法在 Serverless 环境运行

### 方案五：一键部署脚本

**deploy.sh 脚本说明：**

```bash
#!/bin/bash

# 配置部分
LOCAL_APP_PATH="/path/to/your/project"  # 本地项目路径
REMOTE_USER="root"                       # 远程服务器用户名
REMOTE_HOST="your-server-ip"             # 远程服务器地址
REMOTE_PATH="/var/www/cms/backend"       # 远程服务器路径
ARCHIVE_NAME="cms.tar.gz"                # 压缩文件名

# 1. 压缩文件（排除 node_modules）
echo "压缩文件..."
tar --exclude="node_modules" \
    --exclude="package-lock.json" \
    --exclude=".git" \
    -czvf $ARCHIVE_NAME -C $LOCAL_APP_PATH .

# 2. 上传文件
echo "上传文件..."
scp $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

# 3. 远程解压并重启
echo "解压文件并重启..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_PATH
  tar -xzvf $ARCHIVE_NAME
  rm $ARCHIVE_NAME
  npm install --production
  pm2 startOrRestart ecosystem.config.cjs --only koa-app-prod
EOF

# 4. 清理本地压缩文件
echo "清理本地压缩文件..."
rm $ARCHIVE_NAME

echo "部署完成！"
```

**执行部署：**

```bash
chmod +x deploy.sh
./deploy.sh
```

## 数据库管理

### 数据库迁移

```bash
# 执行迁移
npm run db:migrate

# 回滚最近一批迁移
npm run db:rollback

# 查看迁移状态
npm run db:status
```

### 数据库备份

```bash
# 创建备份（AES-256-GCM 加密）
npm run db:backup

# 列出所有备份
npm run db:list

# 恢复备份
npm run db:restore backup-20260723-020000.sql.gz.enc

# 验证备份完整性
npm run db:verify backup-20260723-020000.sql.gz.enc
```

**自动备份：**

Worker 进程会在每天凌晨 2:00 自动执行备份任务，保留最近 10 个备份或 30 天内的备份。

## 开发指南

### 添加新模块

**步骤 1：创建模块目录**

```
src/modules/your-module/
├── index.js              # 模块导出
├── yourRouter.js         # 路由定义
├── yourController.js     # 控制器
├── yourService.js        # 服务层
└── yourDao.js            # 数据访问层
```

**步骤 2：定义路由**

```javascript
// yourRouter.js
import Router from '@koa/router'
import { authenticate } from '../../middleware/authenticate.js'
import { authorizeRoute } from '../../middleware/authorize.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import yourController from './yourController.js'
import { YourCreateBodySchema } from '../../schemas/your-schema.js'

const router = new Router()

router.post('/your-module/create',
  authenticate,
  authorizeRoute('/your-module'),
  validateBody(YourCreateBodySchema),
  errorControllerWrapper(yourController.create)
)

export default router
```

**步骤 3：注册路由**

```javascript
// src/routers/index.js
import yourRouter from '../modules/your-module/yourRouter.js'

router.use(yourRouter.routes(), yourRouter.allowedMethods())
```

**步骤 4：定义 Schema**

```javascript
// src/schemas/your-module/yourSchema.js
import { z } from 'zod'
import { createPaginatedQuerySchema } from '../common/paginationSchema.js'

export const YourCreateBodySchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  status: z.enum(['1', '2']).default('1')
})

export const YourListQuerySchema = createPaginatedQuerySchema({
  keyword: z.string().optional(),
  status: z.enum(['1', '2']).optional()
})
```

### 代码规范

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run prettier:fix
```

**提交前自动检查：**

项目已配置 `husky` + `lint-staged`，每次 `git commit` 会自动执行：
- ESLint 检查
- Prettier 格式化

### 版本发布

```bash
# 交互式发布
npm run manual:release

# 自动发布 patch 版本
npm run release:patch

# 自动发布 minor 版本
npm run release:minor

# 自动发布 major 版本
npm run release:major

# 发布 alpha 预发布版本
npm run release:alpha

# 发布 beta 预发布版本
npm run release:beta
```

## 常见问题

### Q: 为什么使用 HTTP 200 返回所有业务响应？

**A:** 这是为了简化前端错误处理。前端只需检查 `body.code` 即可判断请求是否成功，无需处理 HTTP 状态码。但中间件层（认证、授权、校验）仍然返回正确的 HTTP 状态码（401、403、400）。

### Q: Redis 是必须的吗？

**A:** 不是。Redis 仅用于 Bull 任务队列（定时备份等）。通过 `REDIS_ENABLED=false` 可以禁用 Redis，此时 Worker 进程不会启动。

### Q: 如何禁用 Swagger API 文档？

**A:** 在 `src/app.js` 中注释掉 `registerSwagger(app)` 即可。

### Q: 如何修改默认密码？

**A:** 在 `src/modules/user/userService.js` 中修改 `createUser` 和 `resetUserPassword` 方法的默认密码 `'123456'`。

### Q: 如何添加新的业务错误码？

**A:** 在 `src/config/businessCode.js` 中添加错误码和对应的消息：

```javascript
export const businessCode = {
  // ... 现有错误码
  yourNewError: 40022  // 新错误码
}

export const businessMsg = {
  // ... 现有消息
  [businessCode.yourNewError]: '你的错误消息'
}
```

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
