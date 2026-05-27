# 操作日志和登录日志功能说明

## 📋 功能概述

本次更新为系统添加了完整的操作日志和登录日志管理功能，包括：
- ✅ 自动记录用户操作行为
- ✅ 自动记录登录行为（成功/失败）
- ✅ 日志查询、筛选、删除
- ✅ 前端可视化管理界面

---

## 🗄️ 数据库表结构

### 1. 操作日志表 (OperationLog)
记录用户在系统中的所有写操作（POST/PUT/DELETE/PATCH）

**字段说明：**
- `id` - 日志ID
- `userId` - 操作用户ID
- `username` - 操作用户名
- `module` - 操作模块
- `action` - 操作类型（新增/编辑/删除等）
- `method` - 请求方法
- `requestUrl` - 请求URL
- `requestParams` - 请求参数（JSON）
- `responseStatus` - 响应状态码
- `responseMsg` - 响应消息
- `ipAddress` - IP地址
- `userAgent` - 浏览器标识
- `executeTime` - 执行时间（毫秒）
- `status` - 操作状态（1=成功 0=失败）
- `createTime` - 操作时间

### 2. 登录日志表 (LoginLog)
记录用户登录行为，包括成功和失败的登录尝试

**字段说明：**
- `id` - 日志ID
- `userId` - 用户ID
- `username` - 用户名
- `loginType` - 登录类型（password/code/sms）
- `ipAddress` - IP地址
- `location` - 登录地点
- `browser` - 浏览器
- `os` - 操作系统
- `userAgent` - 完整UA
- `status` - 登录状态（1=成功 0=失败）
- `message` - 登录消息
- `sessionId` - 会话ID
- `createTime` - 登录时间

---

## 🚀 部署步骤

### 1. 执行数据库脚本

按顺序执行以下SQL文件：

```bash
# 1. 创建日志表
mysql -u root -p your_database < server/src/db/logs-table.sql

# 2. 添加日志菜单（需要先执行上面的脚本）
mysql -u root -p your_database < server/src/db/log-menu.sql
```

### 2. 重启后端服务

```bash
cd server
npm run dev
```

### 3. 前端已自动集成

前端页面和API已经创建完成，重启前端服务即可看到效果：

```bash
cd client
npm run dev
```

---

## 📡 API 接口

### 操作日志接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取列表 | GET | `/api/log/getOperationLogList` | 分页查询操作日志 |
| 批量删除 | POST | `/api/log/batchDeleteOperationLog` | 批量删除日志 |
| 清空日志 | POST | `/api/log/clearOperationLogs` | 清空所有操作日志 |

**查询参数：**
- `current` / `page` - 页码
- `size` / `pageSize` - 每页数量
- `username` - 操作用户（模糊查询）
- `module` - 操作模块
- `action` - 操作类型
- `status` - 操作状态（0/1）
- `startTime` - 开始时间
- `endTime` - 结束时间

### 登录日志接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取列表 | GET | `/api/log/getLoginLogList` | 分页查询登录日志 |
| 批量删除 | POST | `/api/log/batchDeleteLoginLog` | 批量删除日志 |
| 清空日志 | POST | `/api/log/clearLoginLogs` | 清空所有登录日志 |

**查询参数：**
- `current` / `page` - 页码
- `size` / `pageSize` - 每页数量
- `username` - 用户名（模糊查询）
- `ipAddress` - IP地址
- `status` - 登录状态（0/1）
- `startTime` - 开始时间
- `endTime` - 结束时间

---

## 💻 前端页面

### 操作日志页面
- **路径**: `/manage/log/operation`
- **文件**: `client/src/views/manage/log/operation-log.vue`
- **功能**:
  - 日志列表展示
  - 按用户名、模块、状态、时间筛选
  - 批量删除选中日志
  - 清空所有日志
  - 显示请求方法颜色标签
  - 显示执行时间

### 登录日志页面
- **路径**: `/manage/log/login`
- **文件**: `client/src/views/manage/log/login-log.vue`
- **功能**:
  - 登录记录列表
  - 按用户名、IP、状态、时间筛选
  - 显示登录方式（密码/验证码/短信）
  - 显示浏览器和操作系统
  - 批量删除选中日志
  - 清空所有日志

---

## 🔧 自动记录机制

### 操作日志自动记录

系统会自动记录所有 POST/PUT/DELETE/PATCH 请求，无需手动调用。

**记录内容：**
- 用户信息（从 JWT Token 中获取）
- 请求信息（URL、方法、参数）
- 响应信息（状态码、消息）
- 执行时间
- IP 地址和浏览器信息

**密码脱敏：**
- 请求参数中的 `password` 字段会自动脱敏为 `***`

### 登录日志自动记录

登录接口已集成日志记录，自动记录：
- ✅ 登录成功
- ❌ 用户不存在
- ❌ 密码错误
- ❌ 账号被禁用

**自动识别：**
- 浏览器类型（Chrome/Firefox/Safari/Edge/IE）
- 操作系统（Windows/macOS/Linux/Android/iOS）

---

## 🎯 使用示例

### 1. 查看操作日志

1. 登录后台管理系统
2. 进入"日志管理" > "操作日志"
3. 可以筛选：
   - 输入用户名搜索特定用户的操作
   - 选择操作模块
   - 筛选成功/失败的操作
   - 选择时间范围
4. 点击"搜索"查看结果

### 2. 清理日志

**批量删除：**
1. 勾选需要删除的日志
2. 点击"批量删除"按钮
3. 确认删除

**清空所有：**
1. 点击"清空日志"按钮
2. 确认操作（不可恢复）

### 3. 查看登录日志

1. 进入"日志管理" > "登录日志"
2. 可以查看：
   - 登录成功的记录
   - 登录失败的记录（包括失败原因）
   - 登录IP和地理位置
   - 使用的浏览器和操作系统

---

## 🔐 权限控制

日志管理菜单已分配给以下角色：
- ✅ 超级管理员 (super)
- ✅ 管理员 (admin)

普通用户 (user) 默认无权限访问日志管理。

---

## 📝 注意事项

1. **性能影响**
   - 日志记录采用异步方式，不会阻塞主流程
   - 建议定期清理历史日志

2. **隐私保护**
   - 密码字段自动脱敏
   - 可根据需要扩展其他敏感字段脱敏

3. **日志存储**
   - 日志存储在 MySQL 数据库中
   - 对于高并发场景，建议后续迁移到 Elasticsearch 等专业日志系统

4. **地理位置**
   - 当前登录地点字段为空
   - 可以后续接入 IP 地理位置服务（如高德地图、百度地图 API）

---

## 🛠️ 文件清单

### 后端文件
```
server/
├── src/
│   ├── db/
│   │   ├── logs-table.sql              # 日志表创建脚本
│   │   └── log-menu.sql                # 日志菜单配置脚本
│   ├── services/
│   │   ├── operationLogDao.js          # 操作日志 DAO
│   │   └── loginLogDao.js              # 登录日志 DAO
│   ├── controllers/
│   │   ├── operationLogController.js   # 操作日志控制器
│   │   └── loginLogController.js       # 登录日志控制器
│   ├── routers/router/
│   │   ├── operationLogRouter.js       # 操作日志路由
│   │   └── loginLogRouter.js           # 登录日志路由
│   ├── schemas/models/
│   │   └── logSchema.js                # 日志验证 Schema
│   └── middleware/
│       └── logMiddleware.js            # 日志记录中间件
```

### 前端文件
```
client/
├── src/
│   ├── views/manage/log/
│   │   ├── operation-log.vue           # 操作日志页面
│   │   └── login-log.vue               # 登录日志页面
│   └── service/api/
│       └── system-manage.js            # API 接口（已更新）
```

---

## 🎉 完成功能

- ✅ 数据库表设计
- ✅ DAO 层完整实现
- ✅ Controller 层完整实现
- ✅ 路由和权限配置
- ✅ Schema 参数验证
- ✅ 自动日志记录中间件
- ✅ 登录日志集成
- ✅ 前端 API 接口
- ✅ 前端管理页面
- ✅ 菜单路由配置
- ✅ 批量操作支持
- ✅ 时间范围筛选
- ✅ 密码脱敏处理

所有功能已完成，可以直接使用！
