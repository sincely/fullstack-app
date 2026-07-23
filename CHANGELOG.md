# Changelog

All notable changes to this project will be documented in this file.


## [1.0.2](https://github.com/sincely/fullstack-app/compare/v1.0.1...v1.0.2) (2026-07-23)

### ✨ Features

* 优化认证模块及相关中间件逻辑 ([a3b92d0](https://github.com/sincely/fullstack-app/commit/a3b92d0b51b46812e738cdd490a3c6d066e10fd8))
* 增加多层服务端安全防护策略 ([9169f42](https://github.com/sincely/fullstack-app/commit/9169f4215c2f6beb97585ba70e48499f76a96f97))
* 实现单设备登录会话控制功能 ([3608508](https://github.com/sincely/fullstack-app/commit/3608508e014c66b5ab3a07fc7bdbb1c9efe65e8c))
* 实现数据库迁移与备份系统 ([8bb79b6](https://github.com/sincely/fullstack-app/commit/8bb79b67fda6ef71096a547e6d8991f1bf313a55))
* 实现用户增删改查功能 ([67d5978](https://github.com/sincely/fullstack-app/commit/67d5978fe68d28f28e29691094a98fb34d659168))
* 实现菜单和角色管理的完整CRUD功能 ([3e533e1](https://github.com/sincely/fullstack-app/commit/3e533e13fb62f7da76ff8f5a5079af5cb8a300cb))
* 将HTTP错误消息翻译为中文 ([a70d4bc](https://github.com/sincely/fullstack-app/commit/a70d4bc19eba77f0e965fbefcabb144908ea989e))
* 新增多个技能模块及相关配置文件 ([cc578d8](https://github.com/sincely/fullstack-app/commit/cc578d8faec2ad7bf23f5928739d2fd0061d05b7))
* 新增批量删除用户、状态更新及密码重置功能 ([a61b889](https://github.com/sincely/fullstack-app/commit/a61b889544fed756b9dab71d62d9122eb20c6264))
* 新增操作日志和登录日志管理功能 ([362b80b](https://github.com/sincely/fullstack-app/commit/362b80be1589e9c92ccd289e01320d729272a6d3))
* 更新技术文档(SessionId方案) ([5b9ef00](https://github.com/sincely/fullstack-app/commit/5b9ef00e38b77e221de28d6d53d9166782725658))
* 替换数据库备份文件为精简的CMS结构 ([34dad7a](https://github.com/sincely/fullstack-app/commit/34dad7af5d836e4ac67f4d028f2d04eb41157847))
* 添加全面的代码审核指南和规则文档 ([e1151bf](https://github.com/sincely/fullstack-app/commit/e1151bfd1d4db3a79a97b1fa5d548431b2510b59))
* 添加刷新令牌接口以延长用户会话 ([3c8ecec](https://github.com/sincely/fullstack-app/commit/3c8ecec4a9f8ed7d648be8987b050bb7f9062aef))
* 添加前端旧接口兼容支持并调整代理配置 ([3bbeae2](https://github.com/sincely/fullstack-app/commit/3bbeae238e9f54630975be3c09ef5318ab73d603))
* 添加权限管理相关的数据库表结构和初始数据 ([2ab0b52](https://github.com/sincely/fullstack-app/commit/2ab0b52a3032d627e0092136149bd772df4d12ee))
* 添加菜单项的 parentId 字段 ([3dd0fff](https://github.com/sincely/fullstack-app/commit/3dd0ffff594b11281d48a975faea56b23dc5d4f6))
* **系统管理:** 新增系统管理路由及用户角色列表接口 ([e50ed6f](https://github.com/sincely/fullstack-app/commit/e50ed6f0f2611420288bb2c49a08a63484a97fb1))
* 统一业务状态码为HTTP标准码并更新相关逻辑 ([170bf5e](https://github.com/sincely/fullstack-app/commit/170bf5ee15783b78013559b7edc74538ecd819fe))
* 重构单设备登录控制机制，使用 sessionId 管理会话 ([59f61c8](https://github.com/sincely/fullstack-app/commit/59f61c8ed44f4d66e3891c00dd010ce7d74d8c50))

### 🐞 Bug Fixes

* 优化Token刷新及过期处理逻辑 ([dda903b](https://github.com/sincely/fullstack-app/commit/dda903b9433ea80e26cc8de673c273979ddda5b1))
* 优化错误处理与日志系统实现 ([4158642](https://github.com/sincely/fullstack-app/commit/4158642598cf1a8cb8e788e926e5c062c61ffdf6))
* 修复admin用户状态字段为空的问题 ([78f8c5d](https://github.com/sincely/fullstack-app/commit/78f8c5d14272f4f17864815ce257095b9d6f3397))
* 修复JWT过期失效时间 ([4444e01](https://github.com/sincely/fullstack-app/commit/4444e016024c494d93ca37d262eb8175c3ca9b92))
* 修复日志中循环记录的问题 ([6b03794](https://github.com/sincely/fullstack-app/commit/6b0379403a18b3d67f746ad8f8e508a9bf399fe6))
* 修复权限路由残留，优化代码与汉化注释 ([114374b](https://github.com/sincely/fullstack-app/commit/114374b8c06536ae2b00a7c2476864b1e65a2032))
* 修复管理员权限相关代码格式与逻辑 ([be54c61](https://github.com/sincely/fullstack-app/commit/be54c6112b898b5ce9f1a86bf4bb8ff4926653aa))
* 修复组件为空时的函数异常 ([4675813](https://github.com/sincely/fullstack-app/commit/467581329c16c7e658cbfaac6aa8637af830643d))
* 修正登录IP获取逻辑以支持代理服务器 ([7bad65f](https://github.com/sincely/fullstack-app/commit/7bad65fd8749c9c9d586724b0b80bbbeaaed8197))
* 减小菜单列表默认分页大小 ([af9f120](https://github.com/sincely/fullstack-app/commit/af9f12037bd9dd47683a002692c5f6a9ea316ee9))
* 删除用户时使用基础查询 ([4b5486c](https://github.com/sincely/fullstack-app/commit/4b5486c27ace636d2e8d4bbedfb7194d77fa05e1))
* 移除请求模块中的调试断点 ([b9e9092](https://github.com/sincely/fullstack-app/commit/b9e90929bf56372ed2a40e938eedb0e540aa35a3))
* 统一接口响应消息文本为“请求成功” ([e0dbd02](https://github.com/sincely/fullstack-app/commit/e0dbd02db8dca00d63f2a5d8d9cce99090871a39))

### 📝 Documentation

* 完善 Node.js 服务端 README 文档 ([93db4cb](https://github.com/sincely/fullstack-app/commit/93db4cb37fca9839de90f119c0cf9f5379626b4d))
* 将环境配置文件中的注释翻译为中文 ([21fe6c9](https://github.com/sincely/fullstack-app/commit/21fe6c96ed693f9d8f0e26d80813dd9601aafa7b))
* 添加 Koa.js 技能文档和许可证 ([e26bcc7](https://github.com/sincely/fullstack-app/commit/e26bcc73f00786788ce290d8ecb17255840083c7))
* 补充前端路由生成全流程及架构文档 ([3b295bd](https://github.com/sincely/fullstack-app/commit/3b295bdb2cdbf55bb12db6278de2a0364f643c0c))

### 🎨 Styles

* 优化按钮组件的代码风格和格式 ([2f44370](https://github.com/sincely/fullstack-app/commit/2f44370c37f9c6653ddca28f172117f4504df7d8))

### 🔧 Chores

* 删除CHANGELOG和commitlint配置及prepare脚本 ([ab56bd8](https://github.com/sincely/fullstack-app/commit/ab56bd89eb798c8c7f26a14a53c18d6230c75de6))
* 升级依赖包版本并更新锁文件 ([face466](https://github.com/sincely/fullstack-app/commit/face466124167d02ea289a67bf72fa165e8545db))
* 更新开发环境JWT过期时间配置 ([b10bc3c](https://github.com/sincely/fullstack-app/commit/b10bc3c6930f4f850910a2aba8c301099a7d9e97))
* 更新环境变量配置并优化依赖版本 ([bba3ec8](https://github.com/sincely/fullstack-app/commit/bba3ec87dffdfdcfcc92a5dfe7df4e09df5ad4fd))
* 添加commitlint配置及调整路径映射 ([2ea3c82](https://github.com/sincely/fullstack-app/commit/2ea3c82fc3e5d412e10b865a3c2dc18af5485b46))
* 移除 husky 相关配置和依赖 ([05cc76e](https://github.com/sincely/fullstack-app/commit/05cc76e1ce6f7b10bbe1c2d47c7a990b82950945))
* 移除调试日志并增强日志中间件 ([b755b96](https://github.com/sincely/fullstack-app/commit/b755b960c0b7dcaa0439ee492a05c55d8e8c5573))
* 统一VS Code配置并更新开发数据库名 ([8aa48d8](https://github.com/sincely/fullstack-app/commit/8aa48d84c9f5f95c35f896bc88ae69de02416872))

### ♻️ Code Refactoring

* 优化数据库连接配置避免时区问题 ([cdfa3fd](https://github.com/sincely/fullstack-app/commit/cdfa3fd1de6fcabf5276c4bca6f96112dea62106))
* 优化权限路由接口路径和文档更新 ([3087d74](https://github.com/sincely/fullstack-app/commit/3087d7455bc78d585706a046d29dfdf63365cbc6))
* 优化登录请求体校验及模型引用 ([8517270](https://github.com/sincely/fullstack-app/commit/8517270cd1cbfbec6bc20c03b08a40f5a5712e31))
* 删除数据库备份SQL文件以减少冗余 ([84c5ffb](https://github.com/sincely/fullstack-app/commit/84c5ffb5dab56a3e5ee4ed816df0999803943e0d))
* 将相对导入路径替换为导入映射别名 ([5ae23c7](https://github.com/sincely/fullstack-app/commit/5ae23c776ee87849c0b56886c801245eddf013be))
* 提取路由相关逻辑至routerController模块 ([c8d52d2](https://github.com/sincely/fullstack-app/commit/c8d52d2c8f6908c4d31602a36fadd038fc894c1e))
* 更新路由角色标识符以匹配后端命名 ([6d329d0](https://github.com/sincely/fullstack-app/commit/6d329d00546ec4cad7212673966e492d81daa3fe))
* **用户管理:** 清理无用字段并改进用户状态检查 ([8a469f5](https://github.com/sincely/fullstack-app/commit/8a469f5dc47f5a986b092367873956b266b2233c))
* 移除 code-reviewer 技能及相关规则文件 ([94f88ba](https://github.com/sincely/fullstack-app/commit/94f88ba1d892ea93a5b4d941d3b1982ba6ba03f5))
* 移除菜单管理中 i18nKey 相关字段和逻辑 ([acc1846](https://github.com/sincely/fullstack-app/commit/acc18469b3075ecb34c3986a4f41185d84a2db49))
* 统一 schema 命名以匹配功能模块 ([05847db](https://github.com/sincely/fullstack-app/commit/05847db896d2cc22ddd841b2985663dad6cadaac))
* 统一后端业务错误和HTTP状态码的处理逻辑 ([6939108](https://github.com/sincely/fullstack-app/commit/69391083db9e07531c7a1d0fdb866db8f5e679c6))
* 调整路由模块导入路径 ([911bda2](https://github.com/sincely/fullstack-app/commit/911bda2e90f12a239e7e79f2a8d9679bb9b40a59))
* 重命名并重构用户认证路由模块 ([021dfa8](https://github.com/sincely/fullstack-app/commit/021dfa8269315055774637e686d1d17285f6bbdb))
* 重构后台权限管理系统并优化管理页面 ([90a742d](https://github.com/sincely/fullstack-app/commit/90a742d24543688a0179b476fe6c49fa5ca8a003))
* 重构后台管理模块，合并用户与管理员功能 ([ab27bb1](https://github.com/sincely/fullstack-app/commit/ab27bb17bf1687c166a0cd863ca1cd27c18bfef5))
* 重构后台认证控制器以调用服务层 ([017bc90](https://github.com/sincely/fullstack-app/commit/017bc90cfc6e92daa62e7800d9db9bc2b0a5959f))
* 重构混合菜单状态管理逻辑并添加详细注释 ([eefb7b9](https://github.com/sincely/fullstack-app/commit/eefb7b9431d902292cb78462ff5f7df289c886a1))
* 重构项目结构并优化权限管理模块 ([0d38525](https://github.com/sincely/fullstack-app/commit/0d38525bddccab3964d99176e14014101f5273c7))

## 1.0.1 (2026-04-29)

### 🎉 init

* 初始化项目基础结构，添加配置文件和基础组件 ([3d75ec4](https://github.com/sincely/fullstack-app/commit/3d75ec44c84bdb63cd94e4622861e67a60b5995d))

### 🐞 Bug Fixes

* 在非生产环境且缺少.git目录时跳过prepare脚本 ([997087d](https://github.com/sincely/fullstack-app/commit/997087de2ed3648d19a3fb5b1b36597097672ea0))

### 🔧 Chores

* 允许在非干净工作目录下执行发布 ([aa89c28](https://github.com/sincely/fullstack-app/commit/aa89c28561607d7defd953789d72b1617aaf4d6c))
* 在非生产环境下自动安装husky钩子 ([57928d4](https://github.com/sincely/fullstack-app/commit/57928d4c297b12a248d73ef8686848bf8a3d4f45))
* 移除服务器端的变更日志和发布配置文件 ([544db14](https://github.com/sincely/fullstack-app/commit/544db14c0de1f618409df16e5e6042881fcb1f72))

### 🤖 Continuous Integration

* 升级 Node.js 并迁移至 pnpm 进行依赖管理与构建 ([b3b098e](https://github.com/sincely/fullstack-app/commit/b3b098ec0c3287b6edf61947855e2af577ac0e39))
* 在发布工作流中允许更新锁文件 ([6a4e2ea](https://github.com/sincely/fullstack-app/commit/6a4e2ea45c484a9b8e48aeae460b57aecd0c34af))
