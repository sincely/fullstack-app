/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80407 (8.4.7)
 Source Host           : localhost:3306
 Source Schema         : cms

 Target Server Type    : MySQL
 Target Server Version : 80407 (8.4.7)
 File Encoding         : 65001

 Date: 29/04/2026 22:58:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ButtonAuth
-- ----------------------------
DROP TABLE IF EXISTS `ButtonAuth`;
CREATE TABLE `ButtonAuth` (
  `buttonId` int NOT NULL AUTO_INCREMENT,
  `routeId` int DEFAULT NULL,
  `routeName` varchar(255) DEFAULT NULL,
  `buttonName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`buttonId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `buttonauth_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of ButtonAuth
-- ----------------------------
BEGIN;
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (1, 8, 'function_request', 'request:get');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (2, 8, 'function_request', 'request:post');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (3, 10, 'function_tab', 'tab:add');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (4, 10, 'function_tab', 'tab:update');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (5, 10, 'function_tab', 'tab:remove');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (6, 14, 'manage_menu', 'menu:add');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (7, 14, 'manage_menu', 'menu:edit');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (8, 14, 'manage_menu', 'menu:delete');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (9, 15, 'manage_role', 'role:add');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (10, 15, 'manage_role', 'role:edit');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (11, 15, 'manage_role', 'role:delete');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (12, 15, 'manage_role', 'role:menu');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (13, 15, 'manage_role', 'role:button');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (14, 16, 'manage_user', 'user:add');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (15, 16, 'manage_user', 'user:edit');
INSERT INTO `ButtonAuth` (`buttonId`, `routeId`, `routeName`, `buttonName`) VALUES (16, 16, 'manage_user', 'user:delete');
COMMIT;

-- ----------------------------
-- Table structure for RoleRoute
-- ----------------------------
DROP TABLE IF EXISTS `RoleRoute`;
CREATE TABLE `RoleRoute` (
  `roleRouteId` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL,
  `routeId` int NOT NULL,
  PRIMARY KEY (`roleRouteId`),
  UNIQUE KEY `roleId` (`roleId`,`routeId`),
  KEY `routeId` (`routeId`),
  CONSTRAINT `roleroute_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`),
  CONSTRAINT `roleroute_ibfk_2` FOREIGN KEY (`routeId`) REFERENCES `RouteAuth` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of RoleRoute
-- ----------------------------
BEGIN;
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (1, 1, 1);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (2, 1, 2);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (3, 1, 3);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (4, 1, 4);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (5, 1, 5);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (6, 1, 6);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (7, 1, 7);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (8, 1, 8);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (9, 1, 10);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (10, 1, 11);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (11, 1, 12);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (12, 1, 13);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (13, 1, 14);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (14, 1, 16);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (15, 1, 17);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (16, 1, 18);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (17, 1, 19);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (18, 1, 20);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (19, 1, 21);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (20, 1, 22);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (21, 1, 23);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (22, 1, 24);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (23, 2, 1);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (24, 2, 2);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (25, 2, 3);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (26, 2, 4);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (27, 2, 5);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (28, 2, 6);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (29, 2, 7);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (30, 2, 8);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (31, 2, 10);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (32, 2, 11);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (33, 2, 12);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (34, 2, 18);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (35, 2, 19);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (36, 2, 20);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (37, 2, 21);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (38, 2, 22);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (39, 2, 23);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (40, 2, 24);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (41, 3, 1);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (42, 3, 2);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (43, 3, 3);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (44, 3, 4);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (45, 3, 5);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (46, 3, 6);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (47, 3, 7);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (48, 3, 8);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (49, 3, 9);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (50, 3, 10);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (51, 3, 11);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (52, 3, 12);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (53, 3, 13);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (54, 3, 14);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (55, 3, 15);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (56, 3, 16);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (57, 3, 17);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (58, 3, 18);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (59, 3, 19);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (60, 3, 20);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (61, 3, 21);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (62, 3, 22);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (63, 3, 23);
INSERT INTO `RoleRoute` (`roleRouteId`, `roleId`, `routeId`) VALUES (64, 3, 24);
COMMIT;

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `roleName` (`roleName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of Roles
-- ----------------------------
BEGIN;
INSERT INTO `Roles` (`roleId`, `roleName`, `description`) VALUES (1, 'admin', 'Administrator role with all permissions');
INSERT INTO `Roles` (`roleId`, `roleName`, `description`) VALUES (2, 'user', 'Regular user role with limited permissions');
INSERT INTO `Roles` (`roleId`, `roleName`, `description`) VALUES (3, 'super', 'all roles');
COMMIT;

-- ----------------------------
-- Table structure for RouteAuth
-- ----------------------------
DROP TABLE IF EXISTS `RouteAuth`;
CREATE TABLE `RouteAuth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `component` varchar(255) DEFAULT NULL,
  `redirect` varchar(255) DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`),
  UNIQUE KEY `name` (`name`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `routeauth_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `RouteAuth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of RouteAuth
-- ----------------------------
BEGIN;
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (1, '/about', 'about', 'layout.base$view.about', NULL, '{\"title\": \"关于\", \"icon\": \"fluent:book-information-24-regular\", \"order\": 10}', NULL);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (2, '/function', 'function', 'layout.base', NULL, '{\"title\": \"系统功能\", \"icon\": \"icon-park-outline:all-application\", \"order\": 6}', NULL);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (3, '/function/hide-child', 'function_hide-child', NULL, '/function/hide-child/one', '{\"title\": \"隐藏子菜单\", \"icon\": \"material-symbols:filter-list-off\", \"order\": 2}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (4, '/function/hide-child/one', 'function_hide-child_one', 'view.function_hide-child_one', NULL, '{\"title\": \"子菜单一\", \"icon\": \"material-symbols:filter-list-off\", \"hideInMenu\": true, \"activeMenu\": \"function_hide-child\"}', 3);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (5, '/function/hide-child/three', 'function_hide-child_three', 'view.function_hide-child_three', NULL, '{\"title\": \"子菜单三\", \"hideInMenu\": true, \"activeMenu\": \"function_hide-child\"}', 3);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (6, '/function/hide-child/two', 'function_hide-child_two', 'view.function_hide-child_two', NULL, '{\"title\": \"子菜单二\", \"hideInMenu\": true, \"activeMenu\": \"function_hide-child\"}', 3);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (7, '/function/multi-tab', 'function_multi-tab', 'view.function_multi-tab', NULL, '{\"title\": \"多标签页\", \"icon\": \"ic:round-tab\", \"multiTab\": true, \"hideInMenu\": true, \"activeMenu\": \"function_tab\"}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (8, '/function/request', 'function_request', 'view.function_request', NULL, '{\"title\": \"请求示例\", \"icon\": \"carbon:network-overlay\", \"order\": 3, \"buttons\": [{\"code\": \"request:get\", \"desc\": \"获取请求\"}, {\"code\": \"request:post\", \"desc\": \"提交请求\"}]}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (9, '/function/super-page', 'function_super-page', 'view.function_super-page', NULL, '{\"title\": \"超级管理员页\", \"icon\": \"ic:round-supervisor-account\", \"order\": 5}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (10, '/function/tab', 'function_tab', 'view.function_tab', NULL, '{\"title\": \"标签页\", \"icon\": \"ic:round-tab\", \"order\": 1, \"buttons\": [{\"code\": \"tab:add\", \"desc\": \"新增标签页\"}, {\"code\": \"tab:update\", \"desc\": \"修改标签页\"}, {\"code\": \"tab:remove\", \"desc\": \"删除标签页\"}]}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (11, '/function/toggle-auth', 'function_toggle-auth', 'view.function_toggle-auth', NULL, '{\"title\": \"切换权限\", \"icon\": \"ic:round-construction\", \"order\": 4}', 2);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (12, '/home', 'home', 'layout.base$view.home', NULL, '{\"title\": \"首页\", \"icon\": \"mdi:monitor-dashboard\", \"order\": 1}', NULL);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (13, '/manage', 'manage', 'layout.base', NULL, '{\"title\": \"系统管理\", \"icon\": \"carbon:cloud-service-management\", \"order\": 9}', NULL);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (14, '/manage/menu', 'manage_menu', 'view.manage_menu', NULL, '{\"title\": \"菜单管理\", \"icon\": \"material-symbols:route\", \"order\": 3, \"keepAlive\": true, \"buttons\": [{\"code\": \"menu:add\", \"desc\": \"新增菜单\"}, {\"code\": \"menu:edit\", \"desc\": \"编辑菜单\"}, {\"code\": \"menu:delete\", \"desc\": \"删除菜单\"}]}', 13);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (15, '/manage/role', 'manage_role', 'view.manage_role', NULL, '{\"title\": \"角色管理\", \"icon\": \"carbon:user-role\", \"order\": 2, \"buttons\": [{\"code\": \"role:add\", \"desc\": \"新增角色\"}, {\"code\": \"role:edit\", \"desc\": \"编辑角色\"}, {\"code\": \"role:delete\", \"desc\": \"删除角色\"}, {\"code\": \"role:menu\", \"desc\": \"菜单权限\"}, {\"code\": \"role:button\", \"desc\": \"按钮权限\"}]}', 13);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (16, '/manage/user', 'manage_user', 'view.manage_user', NULL, '{\"title\": \"用户管理\", \"icon\": \"ic:round-manage-accounts\", \"order\": 1, \"buttons\": [{\"code\": \"user:add\", \"desc\": \"新增用户\"}, {\"code\": \"user:edit\", \"desc\": \"编辑用户\"}, {\"code\": \"user:delete\", \"desc\": \"删除用户\"}]}', 13);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (17, '/manage/user-detail/:id', 'manage_user-detail', 'view.manage_user-detail', NULL, '{\"title\": \"用户详情\", \"hideInMenu\": true, \"activeMenu\": \"manage_user\"}', 13);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (18, '/multi-menu', 'multi-menu', 'layout.base', NULL, '{\"title\": \"多级菜单\", \"order\": 8}', NULL);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (19, '/multi-menu/first', 'multi-menu_first', NULL, NULL, '{\"title\": \"菜单一\", \"order\": 1}', 18);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (20, '/multi-menu/first/child', 'multi-menu_first_child', 'view.multi-menu_first_child', NULL, '{\"title\": \"菜单一子菜单\"}', 19);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (21, '/multi-menu/second', 'multi-menu_second', NULL, NULL, '{\"title\": \"菜单二\", \"order\": 2}', 18);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (22, '/multi-menu/second/child', 'multi-menu_second_child', NULL, NULL, '{\"title\": \"菜单二子菜单\"}', 21);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (23, '/multi-menu/second/child/home', 'multi-menu_second_child_home', 'view.multi-menu_second_child_home', NULL, '{\"title\": \"菜单二子菜单首页\"}', 22);
INSERT INTO `RouteAuth` (`id`, `path`, `name`, `component`, `redirect`, `meta`, `parent_id`) VALUES (24, '/user-center', 'user-center', 'layout.base$view.user-center', NULL, '{\"title\": \"个人中心\", \"hideInMenu\": true}', NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `age` int DEFAULT NULL,
  `idCard` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive','banned') NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nickName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCard` (`idCard`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_role` (`roleId`),
  CONSTRAINT `fk_role` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`roleId`),
  CONSTRAINT `users_chk_1` CHECK ((`age` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO `Users` (`id`, `username`, `gender`, `age`, `idCard`, `email`, `address`, `createTime`, `status`, `avatar`, `roleId`, `password`) VALUES (1, 'user', 'female', 28, '123456789012345678', 'alice@example.com', '123 Main St, Anytown, USA', '2024-06-29 15:31:30', 'active', 'avatar1.png', 2, '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm');
INSERT INTO `Users` (`id`, `username`, `gender`, `age`, `idCard`, `email`, `address`, `createTime`, `status`, `avatar`, `roleId`, `password`) VALUES (2, 'admin', 'male', 32, '987654321098765432', 'bob@example.com', '456 Elm St, Othertown, USA', '2024-06-29 15:31:30', 'active', 'avatar2.png', 1, '$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
