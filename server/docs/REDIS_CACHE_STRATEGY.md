# Redis 缓存三大问题解决方案

> 本文档针对项目中 Auth 缓存、Permission 缓存、Session 存储的实际使用场景，分析缓存雪崩、击穿、穿透三大风险，并给出具体解决方案与代码示例。

---

## 目录

- [一、当前缓存架构概览](#一当前缓存架构概览)
- [二、缓存雪崩（Cache Avalanche）](#二缓存雪崩cache-avalanche)
- [三、缓存击穿（Cache Breakdown）](#三缓存击穿cache-breakdown)
- [四、缓存穿透（Cache Penetration）](#四缓存穿透cache-penetration)
- [五、方案汇总与实施优先级](#五方案汇总与实施优先级)
- [六、监控与告警建议](#六监控与告警建议)

---

## 一、当前缓存架构概览

### 1.1 缓存域一览

| 缓存类型 | Key 格式 | TTL | 读写模式 | 核心文件 |
|---|---|---|---|---|
| Auth 缓存 | `auth:user:{userId}` | 3600s (固定) | Cache-Aside | `utils/redisCache.js` |
| 权限缓存 | `perm:role:{roleIds}` | 300s (固定) | Cache-Aside | `utils/redisCache.js` |
| Session | `sess:{key}` | 86400s | 写入即设置 | `session/redisStore.js` |
| 限流计数 | `ratelimit:{ip}:{path}` | 窗口时长 | 滑动窗口 | `middleware/rateLimiterRedis.js` |

### 1.2 数据流

```
请求 → 中间件 → 查 Redis 缓存
                  ├─ 命中 → 直接返回
                  └─ 未命中 → 查 MySQL → 回填缓存 → 返回
```

### 1.3 当前存在的风险点

- **所有 TTL 为固定值**：同类型缓存同时过期，易引发雪崩
- **Cache-Aside 无互斥**：热点 key 过期瞬间，并发请求同时回源 DB，易引发击穿
- **未命中不写缓存**：查询不存在的 userId/roleIds 时，每次穿透到 DB

---

## 二、缓存雪崩（Cache Avalanche）

### 2.1 问题描述

大量缓存 key 在同一时间集中过期，或 Redis 整体宕机，导致请求瞬间全部打到 MySQL，数据库压力骤增甚至崩溃。

### 2.2 项目中的风险场景

| 场景 | 触发条件 | 影响 |
|---|---|---|
| 批量登录 | 大量用户在同一时间段登录，Auth 缓存 TTL 均为 3600s | 1 小时后缓存集中过期 |
| 菜单批量变更 | 调用 `delAllPermCache()` 清空所有权限缓存 | 所有角色权限缓存同时失效 |
| Redis 重启 | Redis 服务异常重启 | 全量缓存丢失 |

### 2.3 方案 A：TTL 随机抖动（必做）

**原理**：在基础 TTL 上加随机偏移量，使过期时间分散在一个区间内。

**改动文件**：`server/src/utils/redisCache.js`

```js
// ===== 配置常量 =====
const BASE_AUTH_TTL = 3600    // Auth 基础 TTL：1 小时
const BASE_PERM_TTL = 300     // 权限基础 TTL：5 分钟
const JITTER_RANGE = 300      // 抖动范围：±150 秒

/**
 * 生成带随机抖动的 TTL，避免同类型缓存集中过期
 * @param {number} base - 基础 TTL（秒）
 * @returns {number} 抖动后的 TTL
 */
function jitterTTL(base) {
  const jitter = Math.floor(Math.random() * JITTER_RANGE) - Math.floor(JITTER_RANGE / 2)
  return base + jitter
}

// ===== Auth 缓存 =====
export function setAuthCache(userId, data) {
  const redis = getRedisClient()
  if (!redis) return
  const ttl = jitterTTL(BASE_AUTH_TTL)  // 实际范围：3450 ~ 3750 秒
  return redis.setex(`auth:user:${userId}`, ttl, JSON.stringify(data))
}

// ===== 权限缓存 =====
export function setPermCache(roleIds, paths) {
  const redis = getRedisClient()
  if (!redis) return
  const sorted = [...roleIds].sort((a, b) => a - b).join(',')
  const ttl = jitterTTL(BASE_PERM_TTL)  // 实际范围：150 ~ 450 秒
  return redis.setex(`perm:role:${sorted}`, ttl, JSON.stringify(paths))
}
```

**效果**：

```
无抖动：  ████████████████████│ 全部在 3600s 过期
有抖动：  ████░░░██░░██░░░████  分散在 3450~3750s 过期
```

### 2.4 方案 B：多级缓存（L1 进程内缓存）

**原理**：在 Redis（L2）之前增加一层进程内 LRU 缓存（L1），即使 Redis 缓存过期或 Redis 不可用，L1 仍能兜底。

**新增文件**：`server/src/utils/memoryCache.js`

```js
import { LRUCache } from 'lru-cache'

const l1Cache = new LRUCache({
  max: 500,       // 最多缓存 500 个 key
  ttl: 60_000,    // L1 只缓存 60 秒（远低于 Redis TTL）
})

export function getL1(key) {
  return l1Cache.get(key) ?? null
}

export function setL1(key, value) {
  l1Cache.set(key, value)
}

export function delL1(key) {
  l1Cache.delete(key)
}

export function clearL1() {
  l1Cache.clear()
}
```

**改造消费端**（以 `authenticate.js` 为例）：

```js
import { getL1, setL1 } from '../utils/memoryCache.js'

async function getSessionInfo(userId) {
  const l1Key = `auth:${userId}`

  // 第 1 层：进程内缓存
  const l1 = getL1(l1Key)
  if (l1) return l1

  // 第 2 层：Redis 缓存
  const cached = await getAuthCache(userId)
  if (cached) {
    setL1(l1Key, cached)
    return cached
  }

  // 第 3 层：MySQL 回源
  const row = await Users.findOne({
    where: { id: userId },
    attributes: ['sessionId', 'sessionExpire']
  })
  if (row) {
    const data = { sessionId: row.sessionId, sessionExpire: row.sessionExpire }
    await setAuthCache(userId, data)
    setL1(l1Key, data)
    return data
  }
  return null
}
```

**多级缓存架构图**：

```
请求 → L1 (LRU, 60s)
         ├─ 命中 → 返回（< 1ms）
         └─ 未命中 → L2 Redis (3600s)
                        ├─ 命中 → 回填 L1 → 返回（~2ms）
                        └─ 未命中 → MySQL
                                       └→ 回填 L2 + L1 → 返回（~20ms）
```

### 2.5 方案 C：服务降级兜底

在 Redis 完全不可用时，使用限流 + 连接池保护 MySQL：

```js
// 在 getSessionInfo / getMenuPathsByRoleId 中
async function getSessionInfo(userId) {
  try {
    // 正常缓存流程
    return await getSessionInfoNormal(userId)
  } catch (err) {
    // Redis 异常：直接查 DB，但加限流保护
    logger.warn(`Redis 异常，降级直查 DB: ${err.message}`)
    return await querySessionFromDB(userId)
  }
}
```

---

## 三、缓存击穿（Cache Breakdown）

### 3.1 问题描述

某个被高频访问的热点 key 在过期瞬间，大量并发请求同时穿透缓存，全部去查 MySQL 的同一条记录，造成数据库瞬时压力激增。

### 3.2 项目中的风险场景

| 场景 | 热点 Key | 并发影响 |
|---|---|---|
| 管理员登录态 | `auth:user:1`（超级管理员） | 缓存过期后所有管理请求同时查 Users 表 |
| 通用角色权限 | `perm:role:1,2`（普通用户角色） | 缓存过期后所有普通用户请求同时查权限表 |

### 3.3 方案 A：分布式互斥锁（推荐）

**原理**：缓存未命中时，用 Redis `SETNX` 获取分布式锁，只允许一个请求回源 DB，其余请求等待并重试读缓存。

**新增文件**：`server/src/utils/cacheLock.js`

```js
import { getRedisClient } from '../db/redis.js'
import logger from './logger.js'

const LOCK_TTL = 5        // 锁过期时间（秒）
const LOCK_RETRY = 3      // 未获锁时最多重试次数
const RETRY_DELAY = 100   // 重试间隔（ms）

/**
 * 带互斥锁的缓存读取，防止缓存击穿
 *
 * @param {string} cacheKey - 缓存标识（用于生成锁 key）
 * @param {Function} cacheGet - 缓存读取: () => Promise<data|null>
 * @param {Function} dbQuery - 数据库查询: () => Promise<data|null>
 * @param {Function} cacheSet - 缓存回填: (data) => Promise<void>
 * @returns {Promise<data|null>}
 */
export async function getWithLock(cacheKey, cacheGet, dbQuery, cacheSet) {
  // Step 1: 先读缓存（快速路径）
  const cached = await cacheGet()
  if (cached !== null) return cached

  const redis = getRedisClient()
  const lockKey = `lock:${cacheKey}`

  // Step 2: 尝试获取分布式锁
  for (let i = 0; i < LOCK_RETRY; i++) {
    const acquired = redis
      ? await redis.set(lockKey, '1', 'EX', LOCK_TTL, 'NX')
      : null

    if (acquired) {
      // ---- 获得锁 ----
      try {
        // Double-check：可能等待期间其他请求已回填
        const recheck = await cacheGet()
        if (recheck !== null) return recheck

        // 回源查 DB
        const result = await dbQuery()

        // 回填缓存
        if (result !== null) {
          await cacheSet(result)
        }
        return result
      } catch (err) {
        logger.error(`[cacheLock] DB 查询失败: ${err.message}`)
        throw err
      } finally {
        // 释放锁
        if (redis) await redis.del(lockKey).catch(() => {})
      }
    }

    // ---- 未获得锁：等待后重试读缓存 ----
    await new Promise(r => setTimeout(r, RETRY_DELAY))
    const retry = await cacheGet()
    if (retry !== null) return retry
  }

  // Step 3: 兜底 — 直接查 DB（不阻塞当前请求）
  logger.warn(`[cacheLock] 重试 ${LOCK_RETRY} 次仍未命中缓存，直接查 DB: ${cacheKey}`)
  return await dbQuery()
}
```

**改造消费端**：

```js
// authenticate.js
import { getWithLock } from '../utils/cacheLock.js'

async function getSessionInfo(userId) {
  return getWithLock(
    `auth:user:${userId}`,
    () => getAuthCache(userId),
    async () => {
      const row = await Users.findOne({
        where: { id: userId },
        attributes: ['sessionId', 'sessionExpire']
      })
      return row
        ? { sessionId: row.sessionId, sessionExpire: row.sessionExpire }
        : null
    },
    (data) => setAuthCache(userId, data)
  )
}
```

```js
// authorize.js
import { getWithLock } from '../utils/cacheLock.js'

async function getMenuPathsByRoleId(roleIds) {
  const sorted = [...roleIds].sort((a, b) => a - b).join(',')
  return getWithLock(
    `perm:role:${sorted}`,
    () => getPermCache(roleIds),
    () => adminPermissionDao.findMenusByRoleId(roleIds),
    (paths) => setPermCache(roleIds, paths)
  )
}
```

**并发请求时序图**：

```
时间线 ──────────────────────────────────────────→

请求 A（获得锁）: cacheGet(miss) → SETNX ✓ → DB 查询 → cacheSet → 返回
请求 B（等待）  : cacheGet(miss) → SETNX ✗ → sleep(100ms) → cacheGet(hit) → 返回
请求 C（等待）  : cacheGet(miss) → SETNX ✗ → sleep(100ms) → cacheGet(hit) → 返回
请求 D（等待）  : cacheGet(miss) → SETNX ✗ → sleep(100ms) → cacheGet(hit) → 返回

结果：只有 1 个请求查 DB，其余 3 个从缓存读取
```

### 3.4 方案 B：逻辑过期 + 异步刷新

**原理**：缓存物理上永不过期（或设置很长的 TTL），在缓存值中嵌入逻辑过期时间。读取时判断是否逻辑过期，若过期则返回旧值并异步刷新。

**适用场景**：对响应延迟极度敏感，允许返回短暂过期数据。

```js
const BASE_AUTH_TTL_MS = 3600_000  // 逻辑过期：1 小时

// ===== 写入：附带逻辑过期时间 =====
export function setAuthCache(userId, data) {
  const redis = getRedisClient()
  if (!redis) return

  const wrapper = {
    data,
    _expireAt: Date.now() + BASE_AUTH_TTL_MS
  }

  // 物理 TTL 设为逻辑 TTL 的 2 倍，仅作兜底防内存泄漏
  const physicalTTL = Math.ceil((BASE_AUTH_TTL_MS * 2) / 1000)
  return redis.setex(`auth:user:${userId}`, physicalTTL, JSON.stringify(wrapper))
}

// ===== 读取：判断逻辑过期，异步刷新 =====
export async function getAuthCache(userId) {
  const redis = getRedisClient()
  if (!redis) return null

  try {
    const raw = await redis.get(`auth:user:${userId}`)
    if (!raw) return null

    const { data, _expireAt } = JSON.parse(raw)

    if (_expireAt > Date.now()) {
      return data  // 未逻辑过期，正常返回
    }

    // 已逻辑过期：返回旧值，后台异步刷新（不阻塞当前请求）
    refreshAuthCacheInBackground(userId)
    return data
  } catch {
    return null
  }
}

// ===== 后台刷新（带互斥，防止多 worker 重复刷新）=====
async function refreshAuthCacheInBackground(userId) {
  const redis = getRedisClient()
  if (!redis) return

  const lockKey = `refresh:auth:user:${userId}`
  const acquired = await redis.set(lockKey, '1', 'EX', 10, 'NX')
  if (!acquired) return  // 已有 worker 在刷新

  try {
    const row = await Users.findOne({
      where: { id: userId },
      attributes: ['sessionId', 'sessionExpire']
    })
    if (row) {
      await setAuthCache(userId, {
        sessionId: row.sessionId,
        sessionExpire: row.sessionExpire
      })
    }
  } catch (err) {
    logger.error(`[refreshAuth] 后台刷新失败: ${err.message}`)
  } finally {
    await redis.del(lockKey).catch(() => {})
  }
}
```

**方案 A vs B 对比**：

| 维度 | 方案 A：互斥锁 | 方案 B：逻辑过期 |
|---|---|---|
| 数据一致性 | ✅ 强一致（等待回源） | ⚠️ 短暂不一致（返回旧值） |
| 响应延迟 | ⚠️ 未命中时有等待延迟 | ✅ 无延迟（始终快速返回） |
| 实现复杂度 | ⭐⭐ 中等 | ⭐⭐⭐ 较高 |
| 线程安全 | ✅ 锁保证单线程回源 | ✅ 锁保证单线程刷新 |
| 适用场景 | 通用，推荐默认使用 | 对延迟极度敏感的场景 |

---

## 四、缓存穿透（Cache Penetration）

### 4.1 问题描述

客户端频繁请求不存在的数据（如 `userId = -1`、`roleIds = [9999]`），缓存永远未命中，每次请求都穿透到 MySQL，造成无效的数据库查询。

### 4.2 项目中的风险场景

| 场景 | 触发方式 | 影响 |
|---|---|---|
| 伪造 userId | 攻击者循环请求不存在的用户 | Users 表被无效查询打满 |
| 伪造 roleIds | 请求不存在的角色组合 | 权限查询表被无效查询打满 |

### 4.3 方案 A：缓存空值（必做）

**原理**：当 DB 查询结果为空时，将一个特殊占位符写入缓存，后续请求直接命中缓存返回 null，不再查 DB。

**改动文件**：`server/src/utils/redisCache.js`

```js
// ===== 空值占位符 =====
const NULL_PLACEHOLDER = '__NULL__'
const NULL_TTL = 60  // 空值缓存 60 秒（短 TTL，防止长期占用内存）

// ===== Auth 缓存读取（增加空值识别）=====
export async function getAuthCache(userId) {
  const redis = getRedisClient()
  if (!redis) return null
  try {
    const raw = await redis.get(`auth:user:${userId}`)
    if (raw === null) return null                    // 缓存未命中
    if (raw === NULL_PLACEHOLDER) return NULL_PLACEHOLDER  // 命中空值缓存
    return JSON.parse(raw)                            // 正常数据
  } catch {
    return null
  }
}

// ===== Auth 缓存写入（支持空值）=====
export function setAuthCache(userId, data) {
  const redis = getRedisClient()
  if (!redis) return

  if (data === null || data === undefined) {
    // 缓存空值，短 TTL 防止穿透
    return redis.setex(`auth:user:${userId}`, NULL_TTL, NULL_PLACEHOLDER)
  }

  const ttl = jitterTTL(BASE_AUTH_TTL)
  return redis.setex(`auth:user:${userId}`, ttl, JSON.stringify(data))
}

// ===== 权限缓存同理 =====
export async function getPermCache(roleIds) {
  const redis = getRedisClient()
  if (!redis) return null
  try {
    const sorted = [...roleIds].sort((a, b) => a - b).join(',')
    const raw = await redis.get(`perm:role:${sorted}`)
    if (raw === null) return null
    if (raw === NULL_PLACEHOLDER) return NULL_PLACEHOLDER
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setPermCache(roleIds, paths) {
  const redis = getRedisClient()
  if (!redis) return

  if (paths === null || paths === undefined) {
    const sorted = [...roleIds].sort((a, b) => a - b).join(',')
    return redis.setex(`perm:role:${sorted}`, NULL_TTL, NULL_PLACEHOLDER)
  }

  const sorted = [...roleIds].sort((a, b) => a - b).join(',')
  const ttl = jitterTTL(BASE_PERM_TTL)
  return redis.setex(`perm:role:${sorted}`, ttl, JSON.stringify(paths))
}
```

**改造消费端**：

```js
async function getSessionInfo(userId) {
  const cached = await getAuthCache(userId)

  // 命中空值缓存 → 已知不存在，直接返回
  if (cached === NULL_PLACEHOLDER) {
    return null
  }

  // 命中正常缓存
  if (cached !== null) {
    return cached
  }

  // 缓存未命中 → 查 DB
  const row = await Users.findOne({
    where: { id: userId },
    attributes: ['sessionId', 'sessionExpire']
  })

  if (row) {
    const data = { sessionId: row.sessionId, sessionExpire: row.sessionExpire }
    await setAuthCache(userId, data)
    return data
  }

  // DB 也没有 → 缓存空值，阻止后续穿透
  await setAuthCache(userId, null)
  return null
}
```

**穿透防护流程**：

```
请求 userId=-1
  → Redis 未命中
  → MySQL 查询：无结果
  → 写入 Redis: auth:user:-1 = "__NULL__" (TTL 60s)

后续请求 userId=-1（60 秒内）
  → Redis 命中 "__NULL__"
  → 直接返回 null（不查 MySQL）
```

### 4.4 方案 B：布隆过滤器（大流量场景）

**原理**：在缓存之前增加布隆过滤器，将所有合法 userId 写入过滤器。查询时先判断是否可能存在——布隆过滤器判定不存在的，一定不存在，直接拒绝。

**新增文件**：`server/src/utils/bloomFilter.js`

```js
import { getRedisClient } from '../db/redis.js'
import logger from './logger.js'

// ===== 布隆过滤器参数 =====
const BIT_SIZE = 1 << 24       // 16M bits ≈ 2MB 内存
const HASH_COUNT = 3           // 哈希函数个数
const FILTER_KEY = 'bloom:userId'

/**
 * 生成多个哈希值
 * @param {string|number} value
 * @returns {number[]} 哈希位索引数组
 */
function hashFunctions(value) {
  const str = String(value)
  const hashes = []
  for (let i = 0; i < HASH_COUNT; i++) {
    let hash = 0
    for (let j = 0; j < str.length; j++) {
      hash = (hash * 31 + str.charCodeAt(j) + i * 17) % BIT_SIZE
    }
    hashes.push(Math.abs(hash))
  }
  return hashes
}

/**
 * 将值加入布隆过滤器
 */
export async function addToFilter(value) {
  const redis = getRedisClient()
  if (!redis) return
  const bits = hashFunctions(value)
  const pipeline = redis.pipeline()
  for (const bit of bits) {
    pipeline.setbit(FILTER_KEY, bit, 1)
  }
  await pipeline.exec()
}

/**
 * 判断值是否可能存在
 * @returns {boolean} false = 一定不存在，true = 可能存在
 */
export async function mightExist(value) {
  const redis = getRedisClient()
  if (!redis) return true  // Redis 不可用时放行，降级到缓存/DB
  const bits = hashFunctions(value)
  const pipeline = redis.pipeline()
  for (const bit of bits) {
    pipeline.getbit(FILTER_KEY, bit)
  }
  const results = await pipeline.exec()
  return results.every(([err, bit]) => bit === 1)
}
```

**写入时机**：用户注册或首次登录时，将 userId 加入过滤器。

```js
// authService.js — 登录成功后
await addToFilter(user.id)
```

**读取时机**：查询前先过滤。

```js
async function getSessionInfo(userId) {
  // 布隆过滤器：一定不存在则直接拒绝
  if (!(await mightExist(userId))) {
    return null
  }

  // 可能存在，走正常缓存流程
  const cached = await getAuthCache(userId)
  if (cached === NULL_PLACEHOLDER) return null
  if (cached !== null) return cached
  // ... DB 回源
}
```

> **注意**：布隆过滤器不支持删除操作。如果需要删除，需重建整个过滤器。建议在用户量达到一定规模后再引入，对于当前项目规模，**缓存空值已足够**。

---

## 五、方案汇总与实施优先级

### 5.1 方案对比总览

| 问题 | 方案 | 改动文件 | 复杂度 | 效果 |
|---|---|---|---|---|
| **雪崩** | TTL 随机抖动 | `redisCache.js` | ⭐ 低 | 分散过期时间，消除集中失效 |
| **雪崩** | L1 进程内缓存 | 新增 `memoryCache.js` + 改消费端 | ⭐⭐ 中 | Redis 不可用时仍可服务 |
| **雪崩** | 服务降级兜底 | 改消费端 | ⭐ 低 | Redis 宕机时保护 MySQL |
| **击穿** | 分布式互斥锁 | 新增 `cacheLock.js` + 改消费端 | ⭐⭐ 中 | 热点 key 只允许 1 个请求回源 |
| **击穿** | 逻辑过期 + 异步刷新 | 改缓存结构和读取逻辑 | ⭐⭐⭐ 高 | 零延迟返回，后台刷新 |
| **穿透** | 缓存空值 | `redisCache.js` + 消费端 | ⭐ 低 | 不存在的数据只查 1 次 DB |
| **穿透** | 布隆过滤器 | 新增 `bloomFilter.js` + 改写入/读取 | ⭐⭐⭐ 高 | 恶意请求在入口即被拦截 |

### 5.2 推荐实施顺序

```
第 1 批（立即实施）
├── TTL 随机抖动       ← 改动最小，消除雪崩基础风险
└── 缓存空值           ← 最简单有效的穿透防护

第 2 批（短期跟进）
└── 分布式互斥锁       ← 解决热点 key 击穿，改造 getSessionInfo / getMenuPathsByRoleId

第 3 批（按需引入）
├── L1 进程内缓存      ← 应对流量增长，增加多级缓存
└── 布隆过滤器         ← 恶意请求量大时引入
```

### 5.3 新增文件清单

| 文件路径 | 用途 |
|---|---|
| `server/src/utils/cacheLock.js` | 分布式互斥锁工具 |
| `server/src/utils/memoryCache.js` | L1 进程内 LRU 缓存 |
| `server/src/utils/bloomFilter.js` | 布隆过滤器（可选） |

### 5.4 需改造的现有文件

| 文件路径 | 改造内容 |
|---|---|
| `server/src/utils/redisCache.js` | TTL 抖动、空值缓存、逻辑过期 |
| `server/src/middleware/authenticate.js` | 接入互斥锁 / L1 缓存 / 空值判断 |
| `server/src/middleware/authorize.js` | 接入互斥锁 / L1 缓存 / 空值判断 |

---

## 六、监控与告警建议

### 6.1 关键指标

| 指标 | 采集方式 | 告警阈值 |
|---|---|---|
| 缓存命中率 | `INFO keyspace` + 业务埋点 | 命中率 < 80% |
| DB 回源 QPS | 在 cacheGet miss 时打点 | 突增 > 3 倍基线 |
| 互斥锁等待次数 | `cacheLock.js` 中 retry 计数 | 单 key 等待 > 5 次/分钟 |
| 空值缓存占比 | SCAN 统计 `__NULL__` 占比 | 占比 > 20%（可能遭受攻击） |
| Redis 内存使用 | `INFO memory` | 使用率 > 80% |
| Redis 连接延迟 | `checkRedis()` health endpoint | 延迟 > 50ms |

### 6.2 在现有 health endpoint 中扩展

项目已有 `GET /api/health?deep` 端点，可扩展缓存统计：

```js
// routers/index.js
import { getCacheStats } from '../utils/redisCache.js'

router.get('/api/health', async (ctx) => {
  // ... 现有逻辑

  if (deep) {
    const [mysqlResult, redisResult] = await Promise.allSettled([
      checkMySQL(),
      checkRedis()
    ])

    // 新增：缓存统计
    const cacheStats = redisEnabled ? await getCacheStats() : null

    ctx.body = {
      status: 'ok',
      services: {
        mysql: mysqlResult.value,
        redis: redisResult.value,
        cache: cacheStats  // { authKeys, permKeys, nullKeys, l1Size }
      }
    }
  }
})
```

### 6.3 日志关键事件

```js
// 在 cacheLock.js 中
logger.warn(`[cacheLock] 热点 key 并发回源: ${cacheKey}, 等待次数: ${i}`)

// 在 redisCache.js 中（空值写入时）
logger.info(`[cache] 缓存空值: ${key}, TTL: ${NULL_TTL}s`)

// 在 authenticate.js 中（穿透时）
logger.warn(`[auth] 用户不存在且已缓存空值: userId=${userId}`)
```

---

> **总结**：对于当前项目规模，第 1 批方案（TTL 抖动 + 缓存空值）即可覆盖最常见的风险场景。第 2 批（互斥锁）建议在流量增长或出现击穿事件后尽快实施。第 3 批方案根据实际业务增长按需引入。
