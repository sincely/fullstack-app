/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80407 (8.4.7)
 Source Host           : localhost:3306
 Source Schema         : app

 Target Server Type    : MySQL
 Target Server Version : 80407 (8.4.7)
 File Encoding         : 65001

 Date: 05/08/2026 00:32:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ButtonAuth
-- ----------------------------
DROP TABLE IF EXISTS `ButtonAuth`;
CREATE TABLE `ButtonAuth` (
  `button_id` int NOT NULL AUTO_INCREMENT,
  `route_id` int NOT NULL COMMENT '所属菜单ID',
  `route_name` varchar(255) NOT NULL COMMENT '所属路由名称，冗余字段便于展示和查询',
  `button_name` varchar(100) NOT NULL COMMENT '按钮权限编码，如 user:add',
  `button_label` varchar(50) DEFAULT NULL COMMENT '按钮显示名称，如 新增/编辑/删除',
  `order_num` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`button_id`),
  UNIQUE KEY `uk_route_button_name` (`route_id`,`button_name`),
  KEY `idx_button_route_name` (`route_name`),
  CONSTRAINT `fk_button_route` FOREIGN KEY (`route_id`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='按钮权限表';

-- ----------------------------
-- Records of ButtonAuth
-- ----------------------------
BEGIN;
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (1, 8, 'function_request', 'request:get', 'GET请求', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (2, 8, 'function_request', 'request:post', 'POST请求', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (3, 10, 'function_tab', 'tab:add', '新增标签', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (4, 10, 'function_tab', 'tab:update', '编辑标签', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (5, 10, 'function_tab', 'tab:remove', '删除标签', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (6, 14, 'manage_menu', 'menu:add', '新增菜单', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (7, 14, 'manage_menu', 'menu:edit', '编辑菜单', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (8, 14, 'manage_menu', 'menu:delete', '删除菜单', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (9, 15, 'manage_role', 'role:add', '新增角色', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (10, 15, 'manage_role', 'role:edit', '编辑角色', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (11, 15, 'manage_role', 'role:delete', '删除角色', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (12, 15, 'manage_role', 'role:menu', '分配菜单', 4, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (13, 15, 'manage_role', 'role:button', '分配按钮', 5, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (14, 16, 'manage_user', 'user:add', '新增用户', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (15, 16, 'manage_user', 'user:edit', '编辑用户', 2, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `ButtonAuth` (`button_id`, `route_id`, `route_name`, `button_name`, `button_label`, `order_num`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (16, 16, 'manage_user', 'user:delete', '删除用户', 3, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for Dict
-- ----------------------------
DROP TABLE IF EXISTS `Dict`;
CREATE TABLE `Dict` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dict_name` varchar(100) NOT NULL COMMENT '字典名称',
  `dict_code` varchar(100) NOT NULL COMMENT '字典编码',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_name` (`dict_name`),
  UNIQUE KEY `uk_dict_code` (`dict_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典管理表';

-- ----------------------------
-- Records of Dict
-- ----------------------------
BEGIN;
INSERT INTO `Dict` (`id`, `dict_name`, `dict_code`, `status`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (1, '111', '11', 1, '1111111', '', '2026-08-04 22:20:22', '', '2026-08-04 22:27:09');
INSERT INTO `Dict` (`id`, `dict_name`, `dict_code`, `status`, `remark`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (2, '去玩儿去玩儿', 'code', 1, '111', '', '2026-08-04 22:28:43', '', '2026-08-04 22:28:43');
COMMIT;

-- ----------------------------
-- Table structure for LoginLog
-- ----------------------------
DROP TABLE IF EXISTS `LoginLog`;
CREATE TABLE `LoginLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `login_type` varchar(20) DEFAULT NULL COMMENT '登录类型：password/code/sms',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP地址',
  `location` varchar(255) DEFAULT NULL COMMENT '登录地点',
  `browser` varchar(100) DEFAULT NULL COMMENT '浏览器',
  `os` varchar(100) DEFAULT NULL COMMENT '操作系统',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '完整UA',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '登录状态：1=成功 0=失败',
  `message` varchar(255) DEFAULT NULL COMMENT '登录消息',
  `session_id` varchar(36) DEFAULT NULL COMMENT '会话ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='登录日志表';

-- ----------------------------
-- Records of LoginLog
-- ----------------------------
BEGIN;
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (1, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '12010452-44a7-4295-9a3a-5c33e2c96c28', '2026-08-04 00:13:29');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (2, 2, 'Admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '1734b15b-f5ba-4ea8-837a-75e11bcd5374', '2026-08-04 00:13:41');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (3, NULL, 'Super', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, '用户名或密码错误', NULL, '2026-08-04 00:13:42');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (4, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '41cc0664-03f6-49d5-b34c-e8c934bb85c4', '2026-08-04 00:13:44');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (5, 1, 'User', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '9d7e0994-9da8-456b-af84-0bc0c6daac88', '2026-08-04 00:13:45');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (6, NULL, 'Super', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, '用户名或密码错误', NULL, '2026-08-04 00:13:46');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (7, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', 'fda4ea9d-21da-4a84-a544-80bda803aad5', '2026-08-04 00:13:48');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (8, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '8e53cafa-b0b7-4257-8ded-e8bf48b04144', '2026-08-04 22:12:34');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (9, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', 'bc8116bf-2537-4756-ab73-e54d2e8220a0', '2026-08-04 23:26:45');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (10, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', 'd33a88a1-93e9-489b-aed3-52d9e1819547', '2026-08-04 23:27:11');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (11, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '2f528b39-7cea-4f08-b714-56dfe9d1fdfa', '2026-08-04 23:31:19');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (12, 2, 'Admin', 'password', '::1', '本地访问', 'Unknown', 'Unknown', 'curl/8.7.1', 1, '登录成功', 'eba6a579-fb62-4a4d-9d25-962d09ff07fc', '2026-08-04 23:32:19');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (13, 2, 'Admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/150.0.0.0 Safari/537.36', 1, '登录成功', '13cdb553-3af7-4275-bca0-6b612ba8cc9d', '2026-08-04 23:35:21');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (14, 2, 'Admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/150.0.0.0 Safari/537.36', 1, '登录成功', '06e34f0a-0205-4285-95fc-4b5cba273056', '2026-08-04 23:36:30');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (15, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '2b37515d-9adb-4d51-a76c-88c961e514c8', '2026-08-04 23:39:18');
INSERT INTO `LoginLog` (`id`, `user_id`, `username`, `login_type`, `ip_address`, `location`, `browser`, `os`, `user_agent`, `status`, `message`, `session_id`, `create_time`) VALUES (16, 2, 'admin', 'password', '127.0.0.1', '本地访问', 'Google Chrome', 'macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 1, '登录成功', '71d7bcbf-d730-4226-a6a4-5a93a41e7f02', '2026-08-05 00:16:58');
COMMIT;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  `executedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of migrations
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for OperationLog
-- ----------------------------
DROP TABLE IF EXISTS `OperationLog`;
CREATE TABLE `OperationLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT '操作用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '操作用户名',
  `action` varchar(100) DEFAULT NULL COMMENT '操作类型',
  `module` varchar(50) DEFAULT NULL COMMENT '系统模块',
  `method` varchar(10) DEFAULT NULL COMMENT '请求方法 GET/POST/PUT/DELETE',
  `request_url` varchar(255) DEFAULT NULL COMMENT '请求URL',
  `request_params` text COMMENT '请求参数(JSON)',
  `response_status` varchar(10) DEFAULT NULL COMMENT '响应状态码',
  `response_msg` varchar(255) DEFAULT NULL COMMENT '响应消息',
  `response_body` text COMMENT '响应体(JSON)',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '浏览器标识',
  `execute_time` int DEFAULT NULL COMMENT '执行时间(毫秒)',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '操作状态：1=成功 0=失败',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_action` (`action`),
  KEY `idx_module` (`module`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志表';

-- ----------------------------
-- Records of OperationLog
-- ----------------------------
BEGIN;
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (1, 2, 'admin', '编辑', '用户管理', 'POST', '', '{\"id\":1,\"status\":\"1\"}', '', '更新用户状态成功', '{\"code\":200,\"msg\":\"更新用户状态成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-03 23:49:43');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (2, 2, 'admin', '编辑', '菜单管理', 'POST', '', '{\"id\":4,\"parentId\":3,\"menuType\":2,\"menuName\":\"子菜单一\",\"routeName\":\"function_hide-child_one\",\"routePath\":\"/function/hide-child/one\",\"component\":\"view.function_hide-child_one\",\"redirect\":\"\",\"orderNum\":0,\"icon\":\"material-symbols:filter-list-off\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":\"function_hide-child\",\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '更新菜单成功', '{\"code\":200,\"msg\":\"更新菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 00:13:12');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (3, 2, 'admin', '编辑', '菜单管理', 'POST', '', '{\"id\":5,\"parentId\":3,\"menuType\":2,\"menuName\":\"子菜单三\",\"routeName\":\"function_hide-child_three\",\"routePath\":\"/function/hide-child/three\",\"component\":\"view.function_hide-child_three\",\"redirect\":\"\",\"orderNum\":0,\"icon\":\"\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":\"function_hide-child\",\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '更新菜单成功', '{\"code\":200,\"msg\":\"更新菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 00:13:16');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (4, 2, 'admin', '编辑', '菜单管理', 'POST', '', '{\"id\":6,\"parentId\":3,\"menuType\":2,\"menuName\":\"子菜单二\",\"routeName\":\"function_hide-child_two\",\"routePath\":\"/function/hide-child/two\",\"component\":\"view.function_hide-child_two\",\"redirect\":\"\",\"orderNum\":0,\"icon\":\"\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":\"function_hide-child\",\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '更新菜单成功', '{\"code\":200,\"msg\":\"更新菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 00:13:20');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (5, 2, 'admin', '编辑', '用户管理', 'POST', '', '{\"id\":2,\"gender\":\"1\",\"email\":\"bob@example.com\",\"phone\":\"15374536782\",\"nickName\":\"Bob\",\"status\":\"1\",\"roleIds\":[1,2,3]}', '', '更新用户成功', '{\"code\":200,\"msg\":\"更新用户成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 21:39:59');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (6, 2, 'admin', '新增', '菜单管理', 'POST', '', '{\"parentId\":13,\"menuType\":2,\"menuName\":\"字典管理\",\"routeName\":\"manage_dict\",\"routePath\":\"/manage/dict\",\"component\":\"view.manage_dict\",\"orderNum\":4,\"icon\":\"icon-park-o11utline:all-application\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":null,\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '创建菜单成功', '{\"code\":200,\"msg\":\"创建菜单成功\",\"data\":{\"id\":40}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 21:46:00');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (7, 2, 'admin', '编辑', '角色管理', 'POST', '', '{\"roleId\":3,\"routeIds\":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]}', '', '更新角色菜单成功', '{\"code\":200,\"msg\":\"更新角色菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 21:46:19');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (12, 2, 'admin', '删除', '菜单管理', 'POST', '', '{\"id\":40}', '', '删除菜单成功', '{\"code\":200,\"msg\":\"删除菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:09:45');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (13, 2, 'admin', '新增', '菜单管理', 'POST', '', '{\"parentId\":13,\"menuType\":2,\"menuName\":\"字典管理\",\"routeName\":\"manage_dict\",\"routePath\":\"/manage/dict\",\"component\":\"view.manage_dict\",\"orderNum\":4,\"icon\":\"ic:baseline-block\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":null,\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '创建菜单成功', '{\"code\":200,\"msg\":\"创建菜单成功\",\"data\":{\"id\":41}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:11:30');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (15, 2, 'admin', '编辑', '菜单管理', 'POST', '', '{\"id\":17,\"parentId\":13,\"menuType\":2,\"menuName\":\"用户详情\",\"routeName\":\"manage_user-detail\",\"routePath\":\"/manage/user-detail/:id\",\"component\":\"view.manage_user-detail\",\"redirect\":\"\",\"orderNum\":0,\"icon\":\"\",\"iconType\":1,\"hideInMenu\":false,\"activeMenu\":\"manage_user\",\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '更新菜单成功', '{\"code\":200,\"msg\":\"更新菜单成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:12:18');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (16, 2, 'admin', '新增', '系统管理', 'POST', '', '{\"dictName\":\"111\",\"dictCode\":\"11\",\"status\":\"1\",\"remark\":\"\"}', '', '创建字典成功', '{\"code\":200,\"msg\":\"创建字典成功\",\"data\":{\"id\":1}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:20:22');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (17, 2, 'admin', '编辑', '系统管理', 'POST', '', '{\"id\":1,\"dictId\":1,\"dictName\":\"111\",\"dictCode\":\"11\",\"status\":\"1\",\"remark\":\"1111111\"}', '', '更新字典成功', '{\"code\":200,\"msg\":\"更新字典成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:27:09');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (18, 2, 'admin', '新增', '系统管理', 'POST', '', '{\"dictName\":\"去玩儿去玩儿\",\"dictCode\":\"code\",\"status\":\"1\",\"remark\":\"111\"}', '', '创建字典成功', '{\"code\":200,\"msg\":\"创建字典成功\",\"data\":{\"id\":2}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:28:43');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (19, 2, 'admin', '新增', '菜单管理', 'POST', '', '{\"parentId\":41,\"menuType\":3,\"menuName\":\"新增\",\"routeName\":\"add\",\"routePath\":\"\",\"orderNum\":1,\"iconType\":1,\"hideInMenu\":false,\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '创建菜单成功', '{\"code\":200,\"msg\":\"创建菜单成功\",\"data\":{\"id\":42}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:29:48');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (20, 2, 'admin', '新增', '菜单管理', 'POST', '', '{\"parentId\":41,\"menuType\":3,\"menuName\":\"编辑\",\"routeName\":\"edit\",\"routePath\":\"\",\"orderNum\":2,\"iconType\":1,\"hideInMenu\":false,\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '创建菜单成功', '{\"code\":200,\"msg\":\"创建菜单成功\",\"data\":{\"id\":43}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:30:00');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (21, 2, 'admin', '新增', '菜单管理', 'POST', '', '{\"parentId\":41,\"menuType\":3,\"menuName\":\"删除\",\"routeName\":\"delete\",\"routePath\":\"\",\"orderNum\":2,\"iconType\":1,\"hideInMenu\":false,\"multiTab\":false,\"keepAlive\":false,\"status\":\"1\"}', '', '创建菜单成功', '{\"code\":200,\"msg\":\"创建菜单成功\",\"data\":{\"id\":44}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 22:30:09');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (32, 2, 'admin', '新增', '用户管理', 'POST', '', '{\"username\":\"111\",\"password\":\"***\",\"gender\":\"1\",\"email\":\"1738248428@qq.com\",\"phone\":\"15651376329\",\"status\":\"1\",\"roleIds\":[1,2]}', '', '邮箱已存在', '{\"code\":40013,\"msg\":\"邮箱已存在\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 0, '2026-08-04 23:20:42');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (33, 2, 'admin', '新增', '用户管理', 'POST', '', '{\"username\":\"111\",\"password\":\"***\",\"gender\":\"1\",\"email\":\"1738248421@qq.com\",\"phone\":\"15651376329\",\"status\":\"1\",\"roleIds\":[1,2]}', '', '创建用户成功', '{\"code\":200,\"msg\":\"创建用户成功\",\"data\":{\"id\":9}}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-04 23:20:46');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (34, 2, 'admin', '重置', '用户管理', 'POST', '', '{\"id\":9}', '', '密码重置成功，默认密码: 123456', '{\"code\":200,\"msg\":\"密码重置成功，默认密码: 123456\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-05 00:17:10');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (35, 2, 'admin', '重置', '用户管理', 'POST', '', '{\"id\":8}', '', '密码重置成功，默认密码: 123456', '{\"code\":200,\"msg\":\"密码重置成功，默认密码: 123456\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-05 00:17:13');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (36, 2, 'admin', '删除', '用户管理', 'POST', '', '{\"id\":7}', '', '删除用户成功', '{\"code\":200,\"msg\":\"删除用户成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-05 00:17:15');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (37, 2, 'admin', '删除', '用户管理', 'POST', '', '{\"id\":8}', '', '删除用户成功', '{\"code\":200,\"msg\":\"删除用户成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-05 00:17:17');
INSERT INTO `OperationLog` (`id`, `user_id`, `username`, `action`, `module`, `method`, `request_url`, `request_params`, `response_status`, `response_msg`, `response_body`, `ip_address`, `user_agent`, `execute_time`, `status`, `create_time`) VALUES (38, 2, 'admin', '删除', '用户管理', 'POST', '', '{\"id\":9}', '', '删除用户成功', '{\"code\":200,\"msg\":\"删除用户成功\"}', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 0, 1, '2026-08-05 00:17:19');
COMMIT;

-- ----------------------------
-- Table structure for RoleButton
-- ----------------------------
DROP TABLE IF EXISTS `RoleButton`;
CREATE TABLE `RoleButton` (
  `role_button_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL COMMENT '角色ID',
  `button_id` int NOT NULL COMMENT '按钮ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`role_button_id`),
  UNIQUE KEY `uk_role_button` (`role_id`,`button_id`),
  KEY `idx_role_button_button_id` (`button_id`),
  CONSTRAINT `fk_role_button_button` FOREIGN KEY (`button_id`) REFERENCES `ButtonAuth` (`button_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_button_role` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色按钮权限关联表';

-- ----------------------------
-- Records of RoleButton
-- ----------------------------
BEGIN;
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (3, 1, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (4, 1, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (5, 1, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (6, 1, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (7, 1, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (8, 1, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (9, 1, 9, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (10, 1, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (11, 1, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (12, 1, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (13, 1, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (14, 1, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (15, 1, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (16, 1, 16, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (17, 2, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (18, 2, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (19, 2, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (20, 2, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (21, 2, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (22, 3, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (23, 3, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (24, 3, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (25, 3, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (26, 3, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (27, 3, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (28, 3, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (29, 3, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (30, 3, 9, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (31, 3, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (32, 3, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (33, 3, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (34, 3, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (35, 3, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (36, 3, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleButton` (`role_button_id`, `role_id`, `button_id`, `create_time`) VALUES (37, 3, 16, '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for RoleRoute
-- ----------------------------
DROP TABLE IF EXISTS `RoleRoute`;
CREATE TABLE `RoleRoute` (
  `role_route_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL COMMENT '角色ID',
  `route_id` int NOT NULL COMMENT '菜单ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`role_route_id`),
  UNIQUE KEY `uk_role_route` (`role_id`,`route_id`),
  KEY `idx_role_route_route_id` (`route_id`),
  CONSTRAINT `fk_role_route_role` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_route_route` FOREIGN KEY (`route_id`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单权限关联表';

-- ----------------------------
-- Records of RoleRoute
-- ----------------------------
BEGIN;
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (3, 1, 3, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (4, 1, 4, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (5, 1, 5, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (6, 1, 6, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (7, 1, 7, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (8, 1, 8, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (9, 1, 10, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (10, 1, 11, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (11, 1, 12, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (12, 1, 13, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (13, 1, 14, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (14, 1, 16, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (15, 1, 17, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (16, 1, 18, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (17, 1, 19, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (18, 1, 20, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (19, 1, 21, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (20, 1, 22, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (21, 1, 23, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (22, 1, 24, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (65, 1, 15, '1993-12-21 02:24:52');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (69, 1, 25, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (70, 1, 27, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (71, 1, 26, '2026-05-27 23:18:18');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (74, 2, 1, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (75, 2, 2, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (76, 2, 3, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (77, 2, 4, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (78, 2, 5, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (79, 2, 6, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (80, 2, 7, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (81, 2, 8, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (82, 2, 10, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (83, 2, 11, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (84, 2, 12, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (85, 2, 18, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (86, 2, 19, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (87, 2, 20, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (88, 2, 21, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (89, 2, 22, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (90, 2, 23, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (91, 2, 24, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (92, 2, 13, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (93, 2, 25, '2026-05-27 23:24:49');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (100, 3, 1, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (101, 3, 2, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (102, 3, 3, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (103, 3, 4, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (104, 3, 5, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (105, 3, 6, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (106, 3, 7, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (107, 3, 8, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (108, 3, 9, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (109, 3, 10, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (110, 3, 11, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (111, 3, 12, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (112, 3, 13, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (113, 3, 14, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (114, 3, 15, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (115, 3, 16, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (116, 3, 17, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (117, 3, 18, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (118, 3, 19, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (119, 3, 20, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (120, 3, 21, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (121, 3, 22, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (122, 3, 23, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (123, 3, 24, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (124, 3, 25, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (125, 3, 26, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (126, 3, 27, '2026-08-04 21:46:19');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (129, 1, 41, '2026-08-04 22:12:48');
INSERT INTO `RoleRoute` (`role_route_id`, `role_id`, `route_id`, `create_time`) VALUES (130, 3, 41, '2026-08-04 22:12:48');
COMMIT;

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_code` varchar(50) NOT NULL COMMENT '角色编码，程序内唯一标识',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `is_system` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否系统内置角色：1=是 0=否',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  UNIQUE KEY `uk_role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';

-- ----------------------------
-- Records of Roles
-- ----------------------------
BEGIN;
INSERT INTO `Roles` (`role_id`, `role_code`, `role_name`, `description`, `status`, `is_system`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (1, 'admin', '管理员', '管理员角色，可访问后台管理能力', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `Roles` (`role_id`, `role_code`, `role_name`, `description`, `status`, `is_system`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (2, 'user', '普通用户', '普通用户角色，默认基础权限 11', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-03 22:50:44');
INSERT INTO `Roles` (`role_id`, `role_code`, `role_name`, `description`, `status`, `is_system`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (3, 'super', '超级管理员', '超级管理员角色，拥有全部菜单与按钮权限', 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
COMMIT;

-- ----------------------------
-- Table structure for RouteAuth
-- ----------------------------
DROP TABLE IF EXISTS `RouteAuth`;
CREATE TABLE `RouteAuth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL COMMENT '父级菜单ID，NULL表示顶级菜单',
  `menu_type` tinyint NOT NULL DEFAULT '2' COMMENT '菜单类型：1=目录 2=菜单页面',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称（显示标题）',
  `route_name` varchar(255) NOT NULL COMMENT '路由名称（唯一标识）',
  `route_path` varchar(255) NOT NULL COMMENT '路由路径',
  `component` varchar(255) DEFAULT NULL COMMENT '前端组件路径',
  `redirect` varchar(255) DEFAULT NULL COMMENT '重定向路径',
  `order_num` int NOT NULL DEFAULT '0' COMMENT '排序序号',
  `icon` varchar(255) DEFAULT NULL COMMENT '菜单图标',
  `icon_type` tinyint NOT NULL DEFAULT '1' COMMENT '图标类型：1=iconify',
  `i18n_key` varchar(100) DEFAULT NULL COMMENT '国际化key',
  `hide_in_menu` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否在菜单中隐藏：0=否 1=是',
  `active_menu` varchar(255) DEFAULT NULL COMMENT '激活菜单路由名',
  `multi_tab` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否支持多标签页：0=否 1=是',
  `keep_alive` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否缓存：0=否 1=是',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启用 0=禁用',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_route_path` (`route_path`),
  UNIQUE KEY `uk_route_name` (`route_name`),
  KEY `idx_route_parent_id` (`parent_id`),
  KEY `idx_route_status` (`status`),
  CONSTRAINT `fk_route_parent` FOREIGN KEY (`parent_id`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单路由权限表';

-- ----------------------------
-- Records of RouteAuth
-- ----------------------------
BEGIN;
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (1, NULL, 2, '关于', 'about', '/about', 'layout.base$view.about', NULL, 10, 'fluent:book-information-24-regular', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (2, NULL, 1, '系统功能', 'function', '/function', 'layout.base', NULL, 6, 'icon-park-outline:all-application', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (3, 2, 1, '隐藏子菜单', 'function_hide-child', '/function/hide-child', NULL, '/function/hide-child/one', 2, 'material-symbols:filter-list-off', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (4, 3, 2, '子菜单一', 'function_hide-child_one', '/function/hide-child/one', 'view.function_hide-child_one', '', 0, 'material-symbols:filter-list-off', 1, NULL, 0, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-04 00:13:12');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (5, 3, 2, '子菜单三', 'function_hide-child_three', '/function/hide-child/three', 'view.function_hide-child_three', '', 0, '', 1, NULL, 0, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-04 00:13:16');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (6, 3, 2, '子菜单二', 'function_hide-child_two', '/function/hide-child/two', 'view.function_hide-child_two', '', 0, '', 1, NULL, 0, 'function_hide-child', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-04 00:13:20');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (7, 2, 2, '多标签页', 'function_multi-tab', '/function/multi-tab', 'view.function_multi-tab', NULL, 0, 'ic:round-tab', 1, NULL, 1, 'function_tab', 1, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (8, 2, 2, '请求示例', 'function_request', '/function/request', 'view.function_request', NULL, 3, 'carbon:network-overlay', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (9, 2, 2, '超级管理员页', 'function_super-page', '/function/super-page', 'view.function_super-page', NULL, 5, 'ic:round-supervisor-account', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (10, 2, 2, '标签页', 'function_tab', '/function/tab', 'view.function_tab', NULL, 1, 'ic:round-tab', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (11, 2, 2, '切换权限', 'function_toggle-auth', '/function/toggle-auth', 'view.function_toggle-auth', NULL, 4, 'ic:round-construction', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (12, NULL, 2, '首页', 'home', '/home', 'layout.base$view.home', NULL, 1, 'mdi:monitor-dashboard', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (13, NULL, 1, '系统管理', 'manage', '/manage', 'layout.base', NULL, 9, 'carbon:cloud-service-management', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (14, 13, 2, '菜单管理', 'manage_menu', '/manage/menu', 'view.manage_menu', NULL, 3, 'material-symbols:route', 1, NULL, 0, NULL, 0, 1, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (15, 13, 2, '角色管理', 'manage_role', '/manage/role', 'view.manage_role', NULL, 2, 'carbon:user-role', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (16, 13, 2, '用户管理', 'manage_user', '/manage/user', 'view.manage_user', NULL, 1, 'ic:round-manage-accounts', 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (17, 13, 2, '用户详情', 'manage_user-detail', '/manage/user-detail/:id', 'view.manage_user-detail', '', 0, '', 1, NULL, 0, 'manage_user', 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-04 22:12:18');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (18, NULL, 1, '多级菜单', 'multi-menu', '/multi-menu', 'layout.base', NULL, 8, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (19, 18, 1, '菜单一', 'multi-menu_first', '/multi-menu/first', NULL, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (20, 19, 2, '菜单一子菜单', 'multi-menu_first_child', '/multi-menu/first/child', 'view.multi-menu_first_child', NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (21, 18, 1, '菜单二', 'multi-menu_second', '/multi-menu/second', NULL, NULL, 2, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (22, 21, 1, '菜单二子菜单', 'multi-menu_second_child', '/multi-menu/second/child', NULL, NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (23, 22, 2, '菜单二子菜单首页', 'multi-menu_second_child_home', '/multi-menu/second/child/home', 'view.multi-menu_second_child_home', NULL, 0, NULL, 1, NULL, 0, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (24, NULL, 2, '个人中心', 'user-center', '/user-center', 'layout.base$view.user-center', NULL, 0, NULL, 1, NULL, 1, NULL, 0, 0, 1, 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '1993-12-21 02:24:52');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (25, NULL, 1, '日志管理', 'log', '/log', 'layout.base', NULL, 8, 'mdi:file-document-outline', 1, NULL, 0, NULL, 0, 0, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (26, 25, 2, '操作日志', 'log_operation', '/log/operation', 'view.manage_log_operation', NULL, 1, 'mdi:clipboard-text', 1, NULL, 0, NULL, 0, 1, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (27, 25, 2, '登录日志', 'log_login', '/log/login', 'view.manage_log_login', NULL, 2, 'mdi:login-variant', 1, NULL, 0, NULL, 0, 1, 1, 'System', '2026-05-27 23:18:18', 'System', '2026-05-27 23:49:01');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (31, 14, 3, '新增', 'add', '', NULL, '', 4, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:18:43', '', '2026-08-03 22:31:29');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (32, 14, 3, '编辑', '_btn_14_edit_1785766951376', '_btn_14_1785766951376', NULL, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:22:31', '', '2026-08-03 22:22:31');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (34, 14, 3, '删除', '_btn_14_delete_1785767482969', '_btn_14_1785767482969', NULL, NULL, 2, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:31:22', '', '2026-08-03 22:31:22');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (35, 15, 3, '新增', '_btn_15_add_1785767605888', '_btn_15_1785767605888', NULL, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:33:25', '', '2026-08-03 22:33:25');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (38, 15, 3, '删除', '_btn_15_delete_1785767775290', '_btn_15_1785767775290', NULL, NULL, 2, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:36:15', '', '2026-08-03 22:36:15');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (39, 15, 3, '编辑', '_btn_15_edit_1785767785023', '_btn_15_1785767785023', NULL, NULL, 3, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-03 22:36:25', '', '2026-08-03 22:36:25');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (41, 13, 2, '字典管理', 'manage_dict', '/manage/dict', 'view.manage_dict', NULL, 4, 'ic:baseline-block', 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-04 22:11:30', '', '2026-08-04 22:11:30');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (42, 41, 3, '新增', '_btn_41_add_1785853788236', '_btn_41_1785853788236', NULL, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-04 22:29:48', '', '2026-08-04 22:29:48');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (43, 41, 3, '编辑', '_btn_41_edit_1785853800537', '_btn_41_1785853800537', NULL, NULL, 2, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-04 22:30:00', '', '2026-08-04 22:30:00');
INSERT INTO `RouteAuth` (`id`, `parent_id`, `menu_type`, `menu_name`, `route_name`, `route_path`, `component`, `redirect`, `order_num`, `icon`, `icon_type`, `i18n_key`, `hide_in_menu`, `active_menu`, `multi_tab`, `keep_alive`, `status`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (44, 41, 3, '删除', '_btn_41_delete_1785853809061', '_btn_41_1785853809061', NULL, '', 3, NULL, 1, NULL, 0, NULL, 0, 0, 1, '', '2026-08-04 22:30:09', '', '2026-08-04 22:32:42');
COMMIT;

-- ----------------------------
-- Table structure for Tag
-- ----------------------------
DROP TABLE IF EXISTS `Tag`;
CREATE TABLE `Tag` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Tag
-- ----------------------------
BEGIN;
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag1', '编程', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag2', '人工智能', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag3', '健身', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag4', '营养', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag5', '旅行', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
INSERT INTO `Tag` (`id`, `name`, `create_time`, `update_time`) VALUES ('tag6', '爱好', '2024-06-27 18:26:44', '2024-06-27 18:26:44');
COMMIT;

-- ----------------------------
-- Table structure for UserRole
-- ----------------------------
DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole` (
  `user_role_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `role_id` int NOT NULL COMMENT '角色ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`user_role_id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`),
  KEY `idx_user_role_role_id` (`role_id`),
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户角色关联表';

-- ----------------------------
-- Records of UserRole
-- ----------------------------
BEGIN;
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (1, 1, 1, '1993-12-21 02:24:52');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (2, 1, 2, '1993-12-21 02:24:52');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (7, 5, 1, '2026-05-27 23:50:03');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (8, 6, 1, '2026-05-28 00:05:17');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (10, 2, 1, '2026-08-04 21:39:59');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (11, 2, 2, '2026-08-04 21:39:59');
INSERT INTO `UserRole` (`user_role_id`, `user_id`, `role_id`, `create_time`) VALUES (12, 2, 3, '2026-08-04 21:39:59');
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `nick_name` varchar(50) DEFAULT NULL COMMENT '昵称',
  `gender` enum('male','female','other') NOT NULL DEFAULT 'other' COMMENT '性别',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1=启动 0=禁用；接口层可转为字符串',
  `age` tinyint unsigned DEFAULT NULL COMMENT '年龄',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `password` varchar(255) NOT NULL COMMENT '登录密码（加密后）',
  `current_refresh_token` varchar(512) DEFAULT NULL COMMENT '当前有效的 Refresh Token（用于单设备登录控制）',
  `session_id` varchar(36) DEFAULT NULL COMMENT '当前会话 ID（UUID，用于单设备登录控制）',
  `login_ip` varchar(45) DEFAULT NULL COMMENT '登录 IP 地址',
  `login_time` datetime DEFAULT NULL COMMENT '登录时间',
  `session_expire` datetime DEFAULT NULL COMMENT '会话过期时间',
  `create_by` varchar(50) DEFAULT '' COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(50) DEFAULT '' COMMENT '更新人',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`),
  UNIQUE KEY `uk_user_id_card` (`id_card`),
  UNIQUE KEY `uk_user_email` (`email`),
  KEY `idx_user_phone` (`phone`),
  KEY `idx_user_status` (`status`),
  KEY `idx_user_create_time` (`create_time`),
  CONSTRAINT `chk_user_age` CHECK (((`age` is null) or ((`age` >= 0) and (`age` <= 150))))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO `Users` (`id`, `username`, `nick_name`, `gender`, `status`, `age`, `phone`, `id_card`, `email`, `address`, `avatar`, `password`, `current_refresh_token`, `session_id`, `login_ip`, `login_time`, `session_expire`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (1, 'user', 'Alice', 'female', 1, 28, '15374536782', '123456789012345678', 'alice@example.com', '123 Main St, Anytown, USA', 'avatar1.png', '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidXNlciIsInJvbGVJZCI6MSwicm9sZUlkcyI6WzEsMl0sInJvbGVDb2RlIjoiYWRtaW4iLCJyb2xlQ29kZXMiOlsiYWRtaW4iLCJ1c2VyIl0sInJvbGVOYW1lIjoi566h55CG5ZGYIiwicm9sZU5hbWVzIjpbIueuoeeQhuWRmCIsIuaZrumAmueUqOaItyJdLCJzZXNzaW9uSWQiOiI5ZDdlMDk5NC05ZGE4LTQ1NmItYWY4NC0wYmMwYzZkYWFjODgiLCJpYXQiOjE3ODU3NzM2MjUsImV4cCI6MTc4NjM3ODQyNX0.-o391fG5UpF78z3BXDGbj7VbBYxVglkfeNspqTHMXVE', '9d7e0994-9da8-456b-af84-0bc0c6daac88', '127.0.0.1', '2026-08-04 00:13:45', '2026-08-11 00:13:46', 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-04 00:13:45');
INSERT INTO `Users` (`id`, `username`, `nick_name`, `gender`, `status`, `age`, `phone`, `id_card`, `email`, `address`, `avatar`, `password`, `current_refresh_token`, `session_id`, `login_ip`, `login_time`, `session_expire`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (2, 'admin', 'Bob', 'male', 1, 32, '15374536782', '987654321098765432', 'bob@example.com', '456 Elm St, Othertown, USA', 'avatar2.png', '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlSWQiOjEsInJvbGVJZHMiOlsxLDIsM10sInJvbGVDb2RlIjoiYWRtaW4iLCJyb2xlQ29kZXMiOlsiYWRtaW4iLCJ1c2VyIiwic3VwZXIiXSwicm9sZU5hbWUiOiLnrqHnkIblkZgiLCJyb2xlTmFtZXMiOlsi566h55CG5ZGYIiwi5pmu6YCa55So5oi3Iiwi6LaF57qn566h55CG5ZGYIl0sInNlc3Npb25JZCI6IjcxZDdiY2JmLWQ3MzAtNDIyNi1hNmE0LTVhOTNhNDFlN2YwMiIsImlhdCI6MTc4NTg2MDIxOCwiZXhwIjoxNzg2NDY1MDE4fQ.5x6ooAjqLkm3w7sMAWJxz92XX_ruUezPJw34GGy6E8o', '71d7bcbf-d730-4226-a6a4-5a93a41e7f02', '127.0.0.1', '2026-08-05 00:16:58', '2026-08-12 00:16:59', 'Edward Smith', '1993-12-21 02:24:52', 'Timothy Thomas', '2026-08-05 00:16:58');
INSERT INTO `Users` (`id`, `username`, `nick_name`, `gender`, `status`, `age`, `phone`, `id_card`, `email`, `address`, `avatar`, `password`, `current_refresh_token`, `session_id`, `login_ip`, `login_time`, `session_expire`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (5, 'werwer', '12312', 'male', 1, NULL, '15651376329', NULL, '1738248422@qq.com', NULL, NULL, '$2b$10$Rjh2GERNOJocRFHPuyfmouty3/89LJdl7UCDW2Fgdwoj8E8/KMv56', NULL, NULL, NULL, NULL, NULL, '', '2026-05-27 23:50:03', '', '2026-05-27 23:50:03');
INSERT INTO `Users` (`id`, `username`, `nick_name`, `gender`, `status`, `age`, `phone`, `id_card`, `email`, `address`, `avatar`, `password`, `current_refresh_token`, `session_id`, `login_ip`, `login_time`, `session_expire`, `create_by`, `create_time`, `update_by`, `update_time`) VALUES (6, '123', '123123', 'male', 1, NULL, '15651376322', NULL, '1738248432@qq.com', NULL, NULL, '$2b$10$3QPEF0fhZGZp7EjY0JqZZOBTut03FEp9NqfVC9yOKEBhLh8c8p2Zy', NULL, NULL, NULL, NULL, NULL, '', '2026-05-28 00:05:17', '', '2026-05-28 00:05:17');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
