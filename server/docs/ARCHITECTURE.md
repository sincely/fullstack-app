# 项目架构与技术栈说明

## 1. 技术栈概览

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **核心框架** | Koa | 3.2.x | 轻量级 Node.js Web 框架 |
| **运行时** | Node.js | 22.x | ES Modules 原生支持 |
| **数据库** | MySQL | 8.x | 关系型数据库 |
| **查询构建器** | Knex.js | 3.x | SQL 查询构建器 |
| **参数校验** | Zod | 4.x | Schema 验证库 |
| **日志系统** | Pino | 10.x | 高性能 JSON 日志 |
| **密码加密** | bcryptjs | 2.x | 密码哈希 |
| **认证** | JWT | 9.x | JSON Web Token (双 Token: Access + Refresh) |
| **权限控制** | RBAC | - | 基于角色的访问控制 |
| **缓存** | Redis | - | 会话缓存 / 限流 / 任务队列 |
| **进程管理** | PM2 | - | 生产环境进程管理 |
| **任务队列** | Bull | 4.x | Redis 任务队列 |

---

## 2. 目录结构

```
src/
├── app.js                 # 应用入口
├── worker.js              # 后台任务 Worker
├── config/                # 配置文件
│   ├── admin.js           # 管理员配置
│   ├── businessCode.js    # 业务状态码
│   ├── cors.js            # 跨域配置
│   ├── database.js        # 数据库连接 (Knex)
│   ├── env.js             # 环境变量加载
│   ├── httpError.js       # HTTP 状态码
│   ├── jwt.js             # JWT 配置 (Token / RefreshToken)
│   ├── koaBodyConfig.js   # 请求体解析配置
│   ├── logger.js          # 日志配置 (Pino)
│   └── server.js          # 服务器配置
├── controllers/           # 控制器层
│   ├── authController.js
│   ├── menuManageController.js
│   ├── roleManageController.js
│   ├── routerController.js
│   ├── userController.js
│   └── userManageController.js
├── db/                    # 数据库脚本
│   └── new-cms.sql        # 数据库初始化 SQL
├── jobs/                  # 后台任务 (Bull Queue)
│   ├── queue.js           # 队列定义
│   ├── scheduler.js       # 定时任务调度
│   └── processors/
│       └── exampleTask.js # 任务处理器示例
├── middleware/            # Koa 中间件
│   ├── authenticate.js    # JWT 认证 (AccessToken)
│   ├── authorize.js       # RBAC 权限校验
│   ├── checkUserInfo.js   # 用户信息检查
│   ├── compress.js        # 响应压缩
│   ├── error.js           # 全局错误处理
│   ├── logger.js          # 请求日志
│   ├── rateLimiter.js     # 限流中间件
│   ├── requestId.js       # 请求 ID 追踪
│   ├── rewriteUrl.js      # 静态资源 URL 重写
│   └── validationMiddleware.js  # Zod 参数校验
├── plugins/               # 插件扩展
│   ├── openapi/
│   │   └── parser.js      # OpenAPI 解析
│   └── swagger.js         # Swagger 文档
├── routers/               # 路由定义
│   ├── index.js           # 路由入口 / 路由注册
│   └── router/
│       ├── authRouter.js      # 认证路由 (登录 / 刷新 Token)
│       ├── menuManageRouter.js
│       ├── roleManageRouter.js
│       ├── routeRouter.js
│       ├── systemManageRouter.js
│       ├── userManageRouter.js
│       └── userRouter.js
├── schemas/               # Zod Schema 定义
│   ├── common/
│   │   └── paramsSchema.js
│   ├── models/
│   │   ├── authSchema.js
│   │   ├── systemManageSchema.js
│   │   └── userSchema.js
│   └── authSchemas.js
├── services/              # 数据访问层 (DAO / Service)
│   ├── authDao.js
│   ├── collectDao.js
│   ├── menuDao.js
│   ├── orderDao.js
│   ├── permissionDao.js
│   ├── productDao.js
│   ├── roleDao.js
│   ├── shoppingCartDao.js
│   ├── userDao.js
│   └── usersDao.js
└── utils/                 # 工具函数
    ├── adminPermission.js # 管理员权限工具
    ├── captcha.js         # 验证码工具
    ├── createResponse.js  # 响应格式化
    ├── db.js              # 数据库工具 (兼容旧代码)
    ├── encrypt.js         # 加密工具
    ├── errorHandler.js    # 错误处理包装器
    ├── jwt.js             # JWT 工具 (生成 / 验证 / 刷新)
    ├── password.js        # 密码加密 (bcryptjs)
    ├── redis.js           # Redis 客户端
    └── validateParams.js  # 参数校验工具
```

---

## 3. 系统架构

```mermaid
graph TD
    Client[客户端 SoybeanAdmin] --> Nginx[Nginx 负载均衡]
    Nginx --> App[Koa 应用]

    subgraph "Koa 应用层"
        MW[中间件层] --> Router[路由层]
        Router --> Valid[Zod 验证]
        Valid --> Ctrl[控制器层]
        Ctrl --> Service[Service / DAO 层]
    end

    Service --> DB[(MySQL)]
    App --> Redis[(Redis)]
    Worker[Worker 进程] --> Redis

    style App fill:#e1f5fe
    style DB fill:#fff3e0
    style Redis fill:#fce4ec
```

---

## 4. 请求处理流程

```mermaid
flowchart TD
    A[客户端发起请求] --> B[Nginx 负载均衡]
    B --> C[Koa 应用接收]

    subgraph middleware["中间件层（按注册顺序执行）"]
        C --> D[requestId 请求追踪]
        D --> E[logger 请求日志]
        E --> F[error 全局异常捕获]
        F --> G[cors 跨域处理]
        G --> H[session 会话管理]
        H --> I[rewriteUrl 静态资源重写]
        I --> J[compress 响应压缩]
        J --> K[koa-static 静态资源服务]
        K --> L[注入 ctx.state.user]
        L --> M[koaBodyParser 请求体解析]
    end

    M --> N[路由匹配 /api/*]
    N --> O{路由是否匹配?}

    O -->|否| P[返回 404 Not Found]
    O -->|是| Q[进入具体 Router]

    subgraph router["路由层"]
        Q --> R{是否需要认证?}
        R -->|是| S[authenticate JWT 认证]
        R -->|否| T[跳过认证]
        S --> U{是否需要权限?}
        U -->|是| V[authorize RBAC 权限校验]
        U -->|否| W[跳过权限]
        V --> X[Zod Schema 验证]
        W --> X
        T --> X
    end

    X --> Y{验证通过?}
    Y -->|否| Z[返回 400 Bad Request]
    Y -->|是| AA[调用控制器 Controller]

    subgraph controller["控制器层"]
        AA --> AB[提取请求参数]
        AB --> AC[调用 Service / DAO]
    end

    subgraph service["Service / DAO 层"]
        AC --> AD[Knex 构建查询]
        AD --> AE[(MySQL 数据库)]
        AE --> AF[返回查询结果]
    end

    AF --> AG{业务逻辑判断}
    AG -->|成功| AH[返回成功响应 HTTP 200 + code:200]
    AG -->|失败| AI[返回业务错误 HTTP 200 + code:4xx/5xx]

    AH --> AJ[输出响应]
    AI --> AJ
    Z --> AJ
    P --> AJ
    AJ --> AK[客户端接收响应]

    style A fill:#e3f2fd
    style AK fill:#e8f5e9
    style AE fill:#fff3e0
    style Z fill:#ffebee
    style AI fill:#fff8e1
    style AH fill:#e8f5e9
```

---

## 5. 技术栈使用指南

### 5.1 Zod 参数验证

**Schema 定义**: `src/schemas/models/userEntitySchema.js`

```javascript
import { z } from 'zod'

// 定义 Schema
export const LoginBodySchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少6位')
})

// 可选字段
export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  age: z.number().int().positive().optional()
})

// 自定义验证
export const PasswordSchema = z.string()
  .regex(/^[a-zA-Z]\w{5,17}$/, '密码格式不正确')
```

**路由中使用**:

```javascript
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'

// POST 请求验证 body
router.post('/login', validateBody(LoginBodySchema), controller.login)

// GET 请求验证 query
router.get('/users', validateQuery(QuerySchema), controller.list)
```

---

### 5.2 密码加密

**工具文件**: `src/utils/password.js`

```javascript
import { hashPassword, comparePassword } from '../utils/password.js'

// 注册时加密
const hashedPassword = await hashPassword('plaintext123')
// 结果: $2a$10$...

// 登录时验证
const isMatch = await comparePassword('plaintext123', hashedPassword)
// 结果: true 或 false
```

---

### 5.3 JWT 双 Token 认证 (AccessToken + RefreshToken)

**工具文件**: `src/utils/jwt.js`

```javascript
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
} from '../utils/jwt.js'

// 生成 Access Token（短期有效，默认 15m）
const token = generateToken({ userId: 1, role: 'user' })

// 生成 Refresh Token（长期有效，默认 7d）
const refreshToken = generateRefreshToken({ userId: 1, role: 'user' })

// 验证 Access Token
const decoded = verifyToken(token)

// 验证 Refresh Token（用于无感刷新）
const decodedRefresh = verifyRefreshToken(refreshToken)
```

**认证中间件**:

```javascript
import authenticate from '../../middleware/authenticate.js'
import authorize from '../../middleware/authorize.js'

// 需要认证的路由
router.get('/profile', authenticate, controller.getProfile)

// 需要特定权限的路由
router.delete('/users/:id', authenticate, authorize('user:delete'), controller.deleteUser)
```

**无感刷新流程**:

```mermaid
sequenceDiagram
    autonumber
    actor U as 用户
    participant C as 客户端
    participant LS as 本地存储
    participant S as 后端服务

    U->>C: 操作触发 API 请求
    C->>LS: 读取 Access Token
    C->>S: 请求 API（携带 Access Token）

    alt Access Token 有效
        S-->>C: 返回业务数据 {code: 200, data: ...}
        C-->>U: 展示结果
    else Access Token 已过期
        S-->>C: 返回 {code: 1001, msg: "Token 过期..."}

        C->>C: 拦截器命中 expiredTokenCodes(1001)
        C->>C: 设置 isRefreshingToken = true
        C->>LS: 读取 Refresh Token
        C->>S: POST /user/auth/refreshToken（携带 Refresh Token）

        alt Refresh Token 有效
            S-->>C: 返回 {code: 200, data: {token, refreshToken}}
            C->>LS: 写入新的 Access Token
            C->>LS: 写入新的 Refresh Token
            C->>C: 更新原请求 Authorization 头
            C->>S: 重放原请求（携带新 Access Token）
            S-->>C: 返回业务数据
            C->>C: isRefreshingToken = false
            C-->>U: 展示结果（用户无感知）
        else Refresh Token 已过期/无效
            S-->>C: 返回 {code: 401, msg: "未授权"}
            C->>C: isRefreshingToken = false
            C->>LS: 清除 token / refreshToken
            C->>C: 重置 authStore
            C-->>U: 跳转登录页
        end
    end
```

---

### 5.4 响应格式化

**工具文件**: `src/utils/createResponse.js`

```javascript
import {
  createSuccessResponse,
  createFailResponse,
  createErrorResponse,
  createPaginatedResponse
} from '../utils/createResponse.js'

// 成功响应
ctx.body = createSuccessResponse('操作成功', 200, { user })
// { success: true, message: '操作成功', status: 200, data: { user } }

// 失败响应
ctx.body = createFailResponse('用户不存在', 404)
// { success: false, message: '用户不存在', status: 404 }

// 分页响应
ctx.body = createPaginatedResponse(list, total, page, pageSize)
// { success: true, data: { list, pagination: { total, page, pageSize, totalPages } } }
```

---

### 5.5 日志系统

**配置文件**: `src/config/logger.js`

```javascript
import logger from '../config/logger.js'

// 不同级别
logger.info('用户登录成功')
logger.warn('请求频率过高')
logger.error({ err: error, userId: 1 }, '数据库查询失败')

// 在中间件中使用 ctx.log
ctx.log.info('处理请求中...')
```

---

### 5.6 RBAC 权限校验流程

**参与文件**:
- `src/middleware/authenticate.js` — JWT 认证
- `src/middleware/authorize.js` — 路由权限校验
- `src/services/permissionDao.js` — 权限数据查询
- `src/utils/adminPermission.js` — 菜单树构建

**权限模型**:

```mermaid
graph TD
    User[用户 admin_user] -->|roleId / roleIds| R[角色 admin_role]
    R -->|routeId| RR[角色菜单关系 RoleRoute]
    R -->|buttonId| RB[角色按钮关系 RoleButton]
    RR --> RA[菜单资源 RouteAuth]
    RB --> BA[按钮资源 ButtonAuth]
```

**接口鉴权流程**:

```mermaid
sequenceDiagram
    autonumber
    participant C as 客户端
    participant A as authenticate
    participant Z as authorize
    participant P as permissionDao
    participant DB as MySQL

    C->>A: 请求接口（携带 Token）
    A->>A: verifyToken 验证
    A->>A: ctx.state.user = decoded
    A->>Z: 进入 authorize 中间件

    Z->>Z: 从 ctx.state.user 取 roleIds
    Z->>P: findMenusByRoleId(roleIds)
    P->>DB: 联表查询 RoleRoute + RouteAuth
    DB-->>P: 返回菜单列表
    P-->>Z: 返回允许访问的 routePaths

    Z->>Z: 判断目标 routePath 是否在允许列表

    alt 有权限
        Z-->>C: await next() 进入 Controller
    else 无权限
        Z-->>C: 返回 HTTP 403 + code:40012
    end
```

**登录后权限加载流程**:

```mermaid
flowchart TD
    A[用户登录成功] --> B[生成 JWT Token]
    B --> C[查询用户角色 roleIds]
    C --> D[findMenusByRoleId 查菜单]
    C --> E[findButtonsByRoleId 查按钮]
    D --> F[buildMenuTree 构建菜单树]
    E --> G[提取 buttonCodes]
    F --> H[返回用户信息 + 菜单树 + 按钮权限]
    G --> H
    H --> I[前端缓存并渲染动态路由]
    H --> J[按钮按权限码显隐]
```

**路由层使用示例**:

```javascript
import authenticate from '../../middleware/authenticate.js'
import authorize from '../../middleware/authorize.js'

// 仅需登录
router.get('/user/getUserInfo', authenticate, controller.getUserInfo)

// 登录 + 菜单权限校验
router.get(
  '/system/users',
  authenticate,
  authorize('/system/users'),
  controller.listUsers
)
```

---

### 5.7 后台任务 (Bull Queue)

**队列定义**: `src/jobs/queue.js`

```javascript
import { cronQueue } from './jobs/queue.js'

// 添加任务
await cronQueue.add('taskName', { data: 'value' }, {
  delay: 5000,           // 延迟 5 秒
  attempts: 3,           // 重试 3 次
  removeOnComplete: true // 完成后删除
})

// 定时任务
await cronQueue.add('dailyReport', {}, {
  repeat: { cron: '0 9 * * *' }  // 每天 9 点
})
```

**任务处理器**: `src/jobs/processors/exampleTask.js`

```javascript
export default async function (job) {
  console.log('处理任务:', job.data)
  // 业务逻辑
  return { success: true }
}
```

---

## 6. 业务状态码

**文件**: `src/config/businessCode.js`

| 状态码 | 常量 | 说明 |
|--------|------|------|
| 200 | businessCode.success | 操作成功 |
| 500 | businessCode.error | 操作失败 |
| 400 | businessCode.paramError | 参数错误 |
| 401 | businessCode.unAuthorized | 未授权 / Refresh Token 过期 |
| 1001 | businessCode.tokenExpired | Access Token 过期（触发前端无感刷新） |
| 40001 | businessCode.userParamMissing | 用户名或密码为空 |
| 40002 | businessCode.userNameInvalid | 用户名格式错误 |
| 40003 | businessCode.passwordInvalid | 密码格式错误 |
| 40004 | businessCode.userNotFound | 用户不存在 |
| 40005 | businessCode.userExist | 用户已存在 |
| 40006 | businessCode.userLoginFail | 登录失败 |
| 40010 | businessCode.adminUserDisabled | 账号已被禁用 |
| 40011 | businessCode.roleNotFound | 角色不存在 |
| 40012 | businessCode.permissionDenied | 权限不足 |

**消息映射对象**: `businessMsg`（key 为状态码）

### 6.1 HTTP 状态码

**文件**: `src/config/httpError.js`

| HTTP 状态码 | 常量 | 说明 |
|--------|------|------|
| 200 | httpCode.ok | 成功 |
| 400 | httpCode.badRequest | 请求参数错误 |
| 401 | httpCode.unauthorized | 未授权 |
| 403 | httpCode.forbidden | 禁止访问 |
| 404 | httpCode.notFound | 资源不存在 |
| 500 | httpCode.internalServerError | 服务器内部错误 |

**消息映射对象**: `httpMessage`（key 为状态码）

---

## 7. 环境配置

**配置文件**: `.env.development` / `.env.production` / `.env.test`

```bash
# 服务器
PORT=8080

# 数据库
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT 双 Token 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m              # Access Token 过期时间
JWT_REFRESH_EXPIRES_IN=7d       # Refresh Token 过期时间
```

---

## 8. 开发命令

```bash
# 开发模式
npm run dev
npm run dev:win

# 后台 Worker
npm run worker:dev

# 代码检查
npm run lint
npm run lint:fix

# 构建
npm run build

# 部署
npm run deploy:test
npm run deploy:prod

# 生成 API 文档
npm run docs
npm run docs:serve
```

PM2 使用细节可参考：`docs/PM2_GUIDE.md`

---

## 9. 添加新功能指南

### 添加新的 API 端点

1. **创建 Schema** - `src/schemas/models/xxxSchema.js`
2. **创建 DAO** - `src/models/dao/xxxDao.js`
3. **创建 Controller** - `src/controllers/xxx/xxxController.js`
4. **创建 Router** - `src/routers/router/xxxRouter.js`
5. **注册路由** - 在 `src/routers/index.js` 中引入

### 示例：添加文章模块

```javascript
// 1. Schema: src/schemas/models/articleSchema.js
import { z } from 'zod'

export const CreateArticleSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1)
})

// 2. Service / DAO: src/services/articleDao.js
import { db } from '../config/database.js'

const create = async (data) => {
  const [id] = await db('articles').insert(data)
  return { id }
}

export default { create }

// 3. Controller: src/controllers/articleController.js
import articleDao from '../services/articleDao.js'
import { createSuccessResponse } from '../utils/createResponse.js'

const create = async (ctx) => {
  const data = ctx.request.body
  const result = await articleDao.create(data)
  ctx.body = createSuccessResponse('创建成功', 200, result)
}

export default { create }

// 4. Router: src/routers/router/articleRouter.js
import Router from '@koa/router'
import articleController from '../../controllers/articleController.js'
import { validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import { CreateArticleSchema } from '../../schemas/models/articleSchema.js'

const router = new Router({ prefix: '/articles' })

router.post(
  '/',
  validateBody(CreateArticleSchema),
  errorControllerWrapper(articleController.create)
)

export default router

// 5. 注册路由: src/routers/index.js
import articleRouter from './router/articleRouter.js'

export default function (app) {
  app.use(articleRouter.routes()).use(articleRouter.allowedMethods())
}
```
