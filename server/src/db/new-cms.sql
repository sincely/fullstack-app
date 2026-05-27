/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80407 (8.4.7)
 Source Host           : localhost:3306
 Source Schema         : new-cms

 Target Server Type    : MySQL
 Target Server Version : 80407 (8.4.7)
 File Encoding         : 65001

 Date: 28/05/2026 00:05:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ButtonAuth
-- ----------------------------
DROP TABLE IF EXISTS `ButtonAuth`;
CREATE TABLE `ButtonAuth` (
  `buttonId` int NOT NULL AUTO_INCREMENT,
  `routeId` int NOT NULL COMMENT '所属菜单ID',
  `routeName` varchar(255) NOT NULL COMMENT '所属路由名称，冗余字段便于展示和查询',
  `buttonName` varchar(100) NOT NULL COMMENT '按钮权限编码，如 user:add',
  `buttonLabel` varchar(50) DEFAULT NULL COMMENT '按钮显示名称，如 新增/编辑/删除',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `createBy` varchar(50) DEFAULT '' COMMENT '创建人',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateBy` varchar(50) DEFAULT '' COMMENT '更新人',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`buttonId`),
  UNIQUE KEY `uk_route_button_name` (`routeId`,`buttonName`),
  KEY `idx_button_route_name` (`routeName`),
  CONSTRAINT `fk_button_route` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='按钮权限表';

-- ----------------------------
-- Records of ButtonAuth
-- ----------------------------
BEGIN;
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (1, 8, 'function_request', 'request:get', 'GET请求', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (2, 8, 'function_request', 'request:post', 'POST请求', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (3, 10, 'function_tab', 'tab:add', '新增标签', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (4, 10, 'function_tab', 'tab:update', '编辑标签', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (5, 10, 'function_tab', 'tab:remove', '删除标签', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (6, 14, 'manage_menu', 'menu:add', '新增菜单', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (7, 14, 'manage_menu', 'menu:edit', '编辑菜单', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (8, 14, 'manage_menu', 'menu:delete', '删除菜单', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (9, 15, 'manage_role', 'role:add', '新增角色', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (10, 15, 'manage_role', 'role:edit', '编辑角色', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (11, 15, 'manage_role', 'role:delete', '删除角色', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (12, 15, 'manage_role', 'role:menu', '分配菜单', 4, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (13, 15, 'manage_role', 'role:button', '分配按钮', 5, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (14, 16, 'manage_user', 'user:add', '新增用户', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (15, 16, 'manage_user', 'user:edit', '编辑用户', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`, `buttonLabel`, `orderNum`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (16, 16, 'manage_user', 'user:delete', '删除用户', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for LoginLog
-- ----------------------------
DROP TABLE IF EXISTS `LoginLog`;
CREATE TABLE `LoginLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `loginType` varchar(20) DEFAULT NULL COMMENT '登录类型：password/code/sms',
  `ipAddress` varchar(45) DEFAULT NULL COMMENT 'IP地址',
  `location` varchar(255) DEFAULT NULL COMMENT '登录地点',
  `browser` varchar(100) DEFAULT NULL COMMENT '浏览器',
  `os` varchar(100) DEFAULT NULL COMMENT '操作系统',
  `userAgent` varchar(500) DEFAULT NULL COMMENT '完整UA',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '登录状态：1=成功 0=失败',
  `message` varchar(255) DEFAULT NULL COMMENT '登录消息',
  `sessionId` varchar(36) DEFAULT NULL COMMENT '会话ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`userId`),
  KEY `idx_username` (`username`),
  KEY `idx_ip_address` (`ipAddress`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`createTime`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='登录日志表';

-- ----------------------------
-- Records of LoginLog
-- ----------------------------
BEGIN;
INSERT INTO `LoginLog` (`id`, `userId`, `username`, `loginType`, `ipAddress`, `location`, `browser`, `os`, `userAgent`, `status`, `message`, `sessionId`, `createTime`) VALUES (1, 2, 'admin', 'password', '::1', '', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '登录成功', '45dd1811-45fa-4527-9aef-e73446f43ae9', '2026-05-27 23:24:19');
INSERT INTO `LoginLog` (`id`, `userId`, `username`, `loginType`, `ipAddress`, `location`, `browser`, `os`, `userAgent`, `status`, `message`, `sessionId`, `createTime`) VALUES (2, 2, 'admin', 'password', '::1', '', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '登录成功', '577f3b89-cd89-4d2e-956d-b398c92f06f4', '2026-05-27 23:25:10');
INSERT INTO `LoginLog` (`id`, `userId`, `username`, `loginType`, `ipAddress`, `location`, `browser`, `os`, `userAgent`, `status`, `message`, `sessionId`, `createTime`) VALUES (3, 2, 'admin', 'password', '::1', '', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '登录成功', '125a4817-ceca-4465-8b5c-99333b074a7a', '2026-05-27 23:25:41');
INSERT INTO `LoginLog` (`id`, `userId`, `username`, `loginType`, `ipAddress`, `location`, `browser`, `os`, `userAgent`, `status`, `message`, `sessionId`, `createTime`) VALUES (4, 2, 'admin', 'password', '::1', '', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 1, '登录成功', 'e7ad5243-eaac-43cd-ac78-52a8d019e4ac', '2026-05-27 23:33:04');
COMMIT;

-- ----------------------------
-- Table structure for OperationLog
-- ----------------------------
DROP TABLE IF EXISTS `OperationLog`;
CREATE TABLE `OperationLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL COMMENT '操作用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '操作用户名',
  `action` varchar(100) DEFAULT NULL COMMENT '操作类型',
  `method` varchar(10) DEFAULT NULL COMMENT '请求方法 GET/POST/PUT/DELETE',
  `requestUrl` varchar(255) DEFAULT NULL COMMENT '请求URL',
  `requestParams` text COMMENT '请求参数(JSON)',
  `responseStatus` varchar(10) DEFAULT NULL COMMENT '响应状态码',
  `responseMsg` varchar(255) DEFAULT NULL COMMENT '响应消息',
  `ipAddress` varchar(45) DEFAULT NULL COMMENT 'IP地址',
  `userAgent` varchar(500) DEFAULT NULL COMMENT '浏览器标识',
  `executeTime` int DEFAULT NULL COMMENT '执行时间(毫秒)',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '操作状态：1=成功 0=失败',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`userId`),
  KEY `idx_username` (`username`),
  KEY `idx_action` (`action`),
  KEY `idx_create_time` (`createTime`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志表';

-- ----------------------------
-- Records of OperationLog
-- ----------------------------
BEGIN;
INSERT INTO `OperationLog` (`id`, `userId`, `username`, `action`, `method`, `requestUrl`, `requestParams`, `responseStatus`, `responseMsg`, `ipAddress`, `userAgent`, `executeTime`, `status`, `createTime`) VALUES (1, 2, 'admin', '新增', 'POST', '/api/systemManage/saveUser', '{\"username\":\"123\",\"password\":\"***\",\"gender\":\"1\",\"email\":\"1738248432@qq.com\",\"phone\":\"15651376322\",\"nickName\":\"123123\",\"status\":\"1\",\"roleId\":1}', '200', '创建用户成功', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 82, 1, '2026-05-28 00:05:17');
COMMIT;

-- ----------------------------
-- Table structure for RoleButton
-- ----------------------------
DROP TABLE IF EXISTS `RoleButton`;
CREATE TABLE `RoleButton` (
  `roleButtonId` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL COMMENT '角色ID',
  `buttonId` int NOT NULL COMMENT '按钮ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`roleButtonId`),
  UNIQUE KEY `uk_role_button` (`roleId`,`buttonId`),
  KEY `idx_role_button_button_id` (`buttonId`),
  CONSTRAINT `fk_role_button_button` FOREIGN KEY (`buttonId`) REFERENCES `ButtonAuth` (`buttonId`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_button_role` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色按钮权限关联表';

-- ----------------------------
-- Records of RoleButton
-- ----------------------------
BEGIN;
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (3, 1, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (4, 1, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (5, 1, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (6, 1, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (7, 1, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (8, 1, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (9, 1, 9, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (10, 1, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (11, 1, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (12, 1, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (13, 1, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (14, 1, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (15, 1, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (16, 1, 16, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (17, 2, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (18, 2, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (19, 2, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (20, 2, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (21, 2, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (22, 3, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (23, 3, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (24, 3, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (25, 3, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (26, 3, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (27, 3, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (28, 3, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (29, 3, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (30, 3, 9, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (31, 3, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (32, 3, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (33, 3, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (34, 3, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (35, 3, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (36, 3, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`roleButtonId`, `roleId`, `buttonId`, `createTime`) VALUES (37, 3, 16, '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for RoleRoute
-- ----------------------------
DROP TABLE IF EXISTS `RoleRoute`;
CREATE TABLE `RoleRoute` (
  `roleRouteId` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL COMMENT '角色ID',
  `routeId` int NOT NULL COMMENT '菜单ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`roleRouteId`),
  UNIQUE KEY `uk_role_route` (`roleId`,`routeId`),
  KEY `idx_role_route_route_id` (`routeId`),
  CONSTRAINT `fk_role_route_role` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_route_route` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单权限关联表';

-- ----------------------------
-- Records of RoleRoute
-- ----------------------------
BEGIN;
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (3, 1, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (4, 1, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (5, 1, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (6, 1, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (7, 1, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (8, 1, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (9, 1, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (10, 1, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (11, 1, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (12, 1, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (13, 1, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (14, 1, 16, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (15, 1, 17, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (16, 1, 18, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (17, 1, 19, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (18, 1, 20, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (19, 1, 21, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (20, 1, 22, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (21, 1, 23, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (22, 1, 24, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (41, 3, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (42, 3, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (43, 3, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (44, 3, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (45, 3, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (46, 3, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (47, 3, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (48, 3, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (49, 3, 9, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (50, 3, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (51, 3, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (52, 3, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (53, 3, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (54, 3, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (55, 3, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (56, 3, 16, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (57, 3, 17, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (58, 3, 18, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (59, 3, 19, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (60, 3, 20, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (61, 3, 21, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (62, 3, 22, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (63, 3, 23, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (64, 3, 24, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (65, 1, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (66, 3, 25, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (67, 3, 27, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (68, 3, 26, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (69, 1, 25, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (70, 1, 27, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (71, 1, 26, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (74, 2, 1, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (75, 2, 2, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (76, 2, 3, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (77, 2, 4, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (78, 2, 5, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (79, 2, 6, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (80, 2, 7, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (81, 2, 8, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (82, 2, 10, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (83, 2, 11, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (84, 2, 12, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (85, 2, 18, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (86, 2, 19, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (87, 2, 20, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (88, 2, 21, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (89, 2, 22, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (90, 2, 23, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (91, 2, 24, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (92, 2, 13, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`, `createTime`) VALUES (93, 2, 25, '2026-05-27 23:24:49');
COMMIT;

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleCode` varchar(50) NOT NULL COMMENT '角色编码，程序内唯一标识',
  `roleName` varchar(50) NOT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `isSystem` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否系统内置角色：1=是 0=否',
  `createBy` varchar(50) DEFAULT '' COMMENT '创建人',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateBy` varchar(50) DEFAULT '' COMMENT '更新人',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `uk_role_code` (`roleCode`),
  UNIQUE KEY `uk_role_name` (`roleName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';

-- ----------------------------
-- Records of Roles
-- ----------------------------
BEGIN;
INSERT INTO `Roles` (`roleId`, `roleCode`, `roleName`, `description`, `status`, `isSystem`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (1, 'admin', '管理员', '管理员角色，可访问后台管理能力', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `Roles` (`roleId`, `roleCode`, `roleName`, `description`, `status`, `isSystem`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (2, 'user', '普通用户', '普通用户角色，默认基础权限', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `Roles` (`roleId`, `roleCode`, `roleName`, `description`, `status`, `isSystem`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (3, 'super', '超级管理员', '超级管理员角色，拥有全部菜单与按钮权限', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for RouteAuth
-- ----------------------------
DROP TABLE IF EXISTS `RouteAuth`;
CREATE TABLE `RouteAuth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int DEFAULT NULL COMMENT '父级菜单ID，NULL表示顶级菜单',
  `menuType` tinyint NOT NULL DEFAULT '2' COMMENT '菜单类型：1=目录 2=菜单页面',
  `menuName` varchar(50) NOT NULL COMMENT '菜单名称（显示标题）',
  `routeName` varchar(255) NOT NULL COMMENT '路由名称（唯一标识）',
  `routePath` varchar(255) NOT NULL COMMENT '路由路径',
  `component` varchar(255) DEFAULT NULL COMMENT '前端组件路径',
  `redirect` varchar(255) DEFAULT NULL COMMENT '重定向路径',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序序号',
  `icon` varchar(255) DEFAULT NULL COMMENT '菜单图标',
  `iconType` tinyint NOT NULL DEFAULT '1' COMMENT '图标类型：1=iconify',
  `i18nKey` varchar(100) DEFAULT NULL COMMENT '国际化key',
  `hideInMenu` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否在菜单中隐藏：0=否 1=是',
  `activeMenu` varchar(255) DEFAULT NULL COMMENT '激活菜单路由名',
  `multiTab` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否支持多标签页：0=否 1=是',
  `keepAlive` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否缓存：0=否 1=是',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `createBy` varchar(50) DEFAULT '' COMMENT '创建人',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateBy` varchar(50) DEFAULT '' COMMENT '更新人',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_route_path` (`routePath`),
  UNIQUE KEY `uk_route_name` (`routeName`),
  KEY `idx_route_parent_id` (`parentId`),
  KEY `idx_route_status` (`status`),
  CONSTRAINT `fk_route_parent` FOREIGN KEY (`parentId`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单路由权限表';

-- ----------------------------
-- Records of RouteAuth
-- ----------------------------
BEGIN;
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (1, NULL, 2, '关于', 'about', '/about', 'layout.base$view.about', NULL, 10, 'fluent:book-information-24-regular', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (2, NULL, 1, '系统功能', 'function', '/function', 'layout.base', NULL, 6, 'icon-park-outline:all-application', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (3, 2, 1, '隐藏子菜单', 'function_hide-child', '/function/hide-child', NULL, '/function/hide-child/one', 2, 'material-symbols:filter-list-off', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (4, 3, 2, '子菜单一', 'function_hide-child_one', '/function/hide-child/one', 'view.function_hide-child_one', NULL, 0, 'material-symbols:filter-list-off', 1, NULL, 1, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (5, 3, 2, '子菜单三', 'function_hide-child_three', '/function/hide-child/three', 'view.function_hide-child_three', NULL, 0, NULL, 1, NULL, 1, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (6, 3, 2, '子菜单二', 'function_hide-child_two', '/function/hide-child/two', 'view.function_hide-child_two', NULL, 0, NULL, 1, NULL, 1, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (7, 2, 2, '多标签页', 'function_multi-tab', '/function/multi-tab', 'view.function_multi-tab', NULL, 0, 'ic:round-tab', 1, NULL, 1, 'function_tab', 1, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (8, 2, 2, '请求示例', 'function_request', '/function/request', 'view.function_request', NULL, 3, 'carbon:network-overlay', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (9, 2, 2, '超级管理员页', 'function_super-page', '/function/super-page', 'view.function_super-page', NULL, 5, 'ic:round-supervisor-account', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (10, 2, 2, '标签页', 'function_tab', '/function/tab', 'view.function_tab', NULL, 1, 'ic:round-tab', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (11, 2, 2, '切换权限', 'function_toggle-auth', '/function/toggle-auth', 'view.function_toggle-auth', NULL, 4, 'ic:round-construction', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (12, NULL, 2, '首页', 'home', '/home', 'layout.base$view.home', NULL, 1, 'mdi:monitor-dashboard', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (13, NULL, 1, '系统管理', 'manage', '/manage', 'layout.base', NULL, 9, 'carbon:cloud-service-management', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (14, 13, 2, '菜单管理', 'manage_menu', '/manage/menu', 'view.manage_menu', NULL, 3, 'material-symbols:route', 1, NULL, 0, NULL, 0, 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (15, 13, 2, '角色管理', 'manage_role', '/manage/role', 'view.manage_role', NULL, 2, 'carbon:user-role', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (16, 13, 2, '用户管理', 'manage_user', '/manage/user', 'view.manage_user', NULL, 1, 'ic:round-manage-accounts', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (17, 13, 2, '用户详情', 'manage_user-detail', '/manage/user-detail/:id', 'view.manage_user-detail', NULL, 0, NULL, 1, NULL, 1, 'manage_user', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (18, NULL, 1, '多级菜单', 'multi-menu', '/multi-menu', 'layout.base', NULL, 8, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (19, 18, 1, '菜单一', 'multi-menu_first', '/multi-menu/first', NULL, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (20, 19, 2, '菜单一子菜单', 'multi-menu_first_child', '/multi-menu/first/child', 'view.multi-menu_first_child', NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (21, 18, 1, '菜单二', 'multi-menu_second', '/multi-menu/second', NULL, NULL, 2, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (22, 21, 1, '菜单二子菜单', 'multi-menu_second_child', '/multi-menu/second/child', NULL, NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (23, 22, 2, '菜单二子菜单首页', 'multi-menu_second_child_home', '/multi-menu/second/child/home', 'view.multi-menu_second_child_home', NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (24, NULL, 2, '个人中心', 'user-center', '/user-center', 'layout.base$view.user-center', NULL, 0, NULL, 1, NULL, 1, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (25, NULL, 1, '日志管理', 'log', '/log', 'layout.base', NULL, 8, 'mdi:file-document-outline', 1, NULL, 0, NULL, 0, 0, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (26, 25, 2, '操作日志', 'log_operation', '/log/operation', 'view.manage_log_operation', NULL, 1, 'mdi:clipboard-text', 1, NULL, 0, NULL, 0, 1, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
INSERT INTO `RouteAuth` (`id`, `parentId`, `menuType`, `menuName`, `routeName`, `routePath`, `component`, `redirect`, `orderNum`, `icon`, `iconType`, `i18nKey`, `hideInMenu`, `activeMenu`, `multiTab`, `keepAlive`, `status`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (27, 25, 2, '登录日志', 'log_login', '/log/login', 'view.manage_log_login', NULL, 2, 'mdi:login-variant', 1, NULL, 0, NULL, 0, 1, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
COMMIT;

-- ----------------------------
-- Table structure for Tag
-- ----------------------------
DROP TABLE IF EXISTS `Tag`;
CREATE TABLE `Tag` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Tag
-- ----------------------------
BEGIN;
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag1', '编程', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag2', '人工智能', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag3', '健身', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag4', '营养', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag5', '旅行', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `createTime`, `updateTime`) VALUES ('tag6', '爱好', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
COMMIT;

-- ----------------------------
-- Table structure for UserRole
-- ----------------------------
DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole` (
  `userRoleId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT '用户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`userRoleId`),
  UNIQUE KEY `uk_user_role` (`userId`,`roleId`),
  KEY `idx_user_role_role_id` (`roleId`),
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户角色关联表';

-- ----------------------------
-- Records of UserRole
-- ----------------------------
BEGIN;
INSERT INTO `UserRole` (`userRoleId`, `userId`, `roleId`, `createTime`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `UserRole` (`userRoleId`, `userId`, `roleId`, `createTime`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `UserRole` (`userRoleId`, `userId`, `roleId`, `createTime`) VALUES (3, 2, 1, '1993-12-21 02:24:52');
INSERT INTO `UserRole` (`userRoleId`, `userId`, `roleId`, `createTime`) VALUES (7, 5, 1, '2026-05-27 23:50:03');
INSERT INTO `UserRole` (`userRoleId`, `userId`, `roleId`, `createTime`) VALUES (8, 6, 1, '2026-05-28 00:05:17');
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `nickName` varchar(50) DEFAULT NULL COMMENT '昵称',
  `gender` enum('male','female','other') NOT NULL DEFAULT 'other' COMMENT '性别',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启动 0=禁用；接口层可转为字符串',
  `age` tinyint unsigned DEFAULT NULL COMMENT '年龄',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `idCard` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `password` varchar(255) NOT NULL COMMENT '登录密码（加密后）',
  `currentRefreshToken` varchar(512) DEFAULT NULL COMMENT '当前有效的 Refresh Token（用于单设备登录控制）',
  `sessionId` varchar(36) DEFAULT NULL COMMENT '当前会话 ID（UUID，用于单设备登录控制）',
  `loginIp` varchar(45) DEFAULT NULL COMMENT '登录 IP 地址',
  `loginTime` datetime DEFAULT NULL COMMENT '登录时间',
  `sessionExpire` datetime DEFAULT NULL COMMENT '会话过期时间',
  `createBy` varchar(50) DEFAULT '' COMMENT '创建人',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateBy` varchar(50) DEFAULT '' COMMENT '更新人',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`),
  UNIQUE KEY `uk_user_id_card` (`idCard`),
  UNIQUE KEY `uk_user_email` (`email`),
  KEY `idx_user_phone` (`phone`),
  KEY `idx_user_status` (`status`),
  KEY `idx_user_create_time` (`createTime`),
  CONSTRAINT `chk_user_age` CHECK (((`age` is null) or ((`age` >= 0) and (`age` <= 150))))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO `Users` (`id`, `username`, `nickName`, `gender`, `status`, `age`, `phone`, `idCard`, `email`, `address`, `avatar`, `password`, `currentRefreshToken`, `sessionId`, `loginIp`, `loginTime`, `sessionExpire`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (1, 'user', 'Alice', 'female', 0, 28, '15374536782', '123456789012345678', 'alice@example.com', '123 Main St, Anytown, USA', 'avatar1.png', '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm', NULL, NULL, NULL, NULL, NULL, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-05-27 23:00:39');
INSERT INTO `Users` (`id`, `username`, `nickName`, `gender`, `status`, `age`, `phone`, `idCard`, `email`, `address`, `avatar`, `password`, `currentRefreshToken`, `sessionId`, `loginIp`, `loginTime`, `sessionExpire`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (2, 'admin', 'Bob', 'male', 1, 32, '15374536782', '987654321098765432', 'bob@example.com', '456 Elm St, Othertown, USA', 'avatar2.png', '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlSWQiOjEsInJvbGVJZHMiOlsxXSwicm9sZUNvZGUiOiJhZG1pbiIsInJvbGVDb2RlcyI6WyJhZG1pbiJdLCJyb2xlTmFtZSI6IueuoeeQhuWRmCIsInJvbGVOYW1lcyI6WyLnrqHnkIblkZgiXSwiaWF0IjoxNzc5ODk3NTE4LCJleHAiOjE3ODA1MDIzMTh9.PiNQWk_EBq0tYayxmNZslC-U0qPYxtwZhCHHCiyZGMc', 'e7ad5243-eaac-43cd-ac78-52a8d019e4ac', '::1', '2026-05-27 23:33:04', '2026-06-03 23:33:04', 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-05-27 23:58:38');
INSERT INTO `Users` (`id`, `username`, `nickName`, `gender`, `status`, `age`, `phone`, `idCard`, `email`, `address`, `avatar`, `password`, `currentRefreshToken`, `sessionId`, `loginIp`, `loginTime`, `sessionExpire`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (5, 'werwer', '12312', 'male', 1, NULL, '15651376329', NULL, '1738248422@qq.com', NULL, NULL, '$2b$10$Rjh2GERNOJocRFHPuyfmouty3/89LJdl7UCDW2Fgdwoj8E8/KMv56', NULL, NULL, NULL, NULL, NULL, '', '2026-05-27 23:50:03', '', '2026-05-27 23:50:03');
INSERT INTO `Users` (`id`, `username`, `nickName`, `gender`, `status`, `age`, `phone`, `idCard`, `email`, `address`, `avatar`, `password`, `currentRefreshToken`, `sessionId`, `loginIp`, `loginTime`, `sessionExpire`, `createBy`, `createTime`, `updateBy`, `updateTime`) VALUES (6, '123', '123123', 'male', 1, NULL, '15651376322', NULL, '1738248432@qq.com', NULL, NULL, '$2b$10$3QPEF0fhZGZp7EjY0JqZZOBTut03FEp9NqfVC9yOKEBhLh8c8p2Zy', NULL, NULL, NULL, NULL, NULL, '', '2026-05-28 00:05:17', '', '2026-05-28 00:05:17');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
