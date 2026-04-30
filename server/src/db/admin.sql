SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
-- buttonauth DDL
CREATE TABLE `buttonauth` (`buttonId` INT NOT NULL AUTO_INCREMENT,
`routeId` INT NULL,
`routeName` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
`buttonName` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
INDEX `routeId`(`routeId` ASC) USING BTREE,
PRIMARY KEY (`buttonId`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 17 ROW_FORMAT = Dynamic;
-- rolebuttonauth DDL
CREATE TABLE `rolebuttonauth` (`id` INT NOT NULL AUTO_INCREMENT,
`roleId` INT NOT NULL,
`buttonId` INT NOT NULL,
INDEX `idx_buttonId`(`buttonId` ASC) USING BTREE,
INDEX `idx_roleId`(`roleId` ASC) USING BTREE,
UNIQUE INDEX `uniq_role_button`(`roleId` ASC,`buttonId` ASC) USING BTREE,
PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 1 ROW_FORMAT = Dynamic;
-- roleroute DDL
CREATE TABLE `roleroute` (`roleRouteId` INT NOT NULL AUTO_INCREMENT,
`roleId` INT NOT NULL,
`routeId` INT NOT NULL,
UNIQUE INDEX `roleId`(`roleId` ASC,`routeId` ASC) USING BTREE,
INDEX `routeId`(`routeId` ASC) USING BTREE,
PRIMARY KEY (`roleRouteId`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 65 ROW_FORMAT = Dynamic;
-- roles DDL
CREATE TABLE `roles` (`roleId` INT NOT NULL AUTO_INCREMENT,
`roleName` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`description` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
UNIQUE INDEX `roleName`(`roleName` ASC) USING BTREE,
PRIMARY KEY (`roleId`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 4 ROW_FORMAT = Dynamic;
-- routeauth DDL
CREATE TABLE `routeauth` (`id` INT NOT NULL AUTO_INCREMENT,
`path` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`name` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`component` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
`redirect` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
`meta` JSON NULL,
`parent_id` INT NULL,
UNIQUE INDEX `name`(`name` ASC) USING BTREE,
INDEX `parent_id`(`parent_id` ASC) USING BTREE,
UNIQUE INDEX `path`(`path` ASC) USING BTREE,
PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 25 ROW_FORMAT = Dynamic;
-- users DDL
CREATE TABLE `users` (`id` INT NOT NULL AUTO_INCREMENT,
`username` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`gender` ENUM("male","female","other") CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`email` VARCHAR(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`createTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
`status` ENUM("active","inactive","banned") CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
`roleId` INT NULL,
`phone` VARCHAR(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
`password` VARCHAR(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
`nickName` VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
UNIQUE INDEX `email`(`email` ASC) USING BTREE,
INDEX `fk_role`(`roleId` ASC) USING BTREE,
PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci AUTO_INCREMENT = 3 ROW_FORMAT = Dynamic;
-- buttonauth Constraints
ALTER TABLE `buttonauth` 
 ADD CONSTRAINT `buttonauth_ibfk_1` FOREIGN KEY (`routeId`) REFERENCES `routeauth` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
-- roleroute Constraints
ALTER TABLE `roleroute` 
 ADD CONSTRAINT `roleroute_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `roleroute_ibfk_2` FOREIGN KEY (`routeId`) REFERENCES `routeauth` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
-- routeauth Constraints
ALTER TABLE `routeauth` 
 ADD CONSTRAINT `routeauth_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `routeauth` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
-- users Constraints
ALTER TABLE `users` 
 ADD CONSTRAINT `fk_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
-- buttonauth DML
INSERT INTO `buttonauth` (`buttonId`,`routeId`,`routeName`,`buttonName`) VALUES (1,8,'function_request','request:get'),(2,8,'function_request','request:post'),(3,10,'function_tab','tab:add'),(4,10,'function_tab','tab:update'),(5,10,'function_tab','tab:remove'),(6,14,'manage_menu','menu:add'),(7,14,'manage_menu','menu:edit'),(8,14,'manage_menu','menu:delete'),(9,15,'manage_role','role:add'),(10,15,'manage_role','role:edit'),(11,15,'manage_role','role:delete'),(12,15,'manage_role','role:menu'),(13,15,'manage_role','role:button'),(14,16,'manage_user','user:add'),(15,16,'manage_user','user:edit'),(16,16,'manage_user','user:delete');
-- roleroute DML
INSERT INTO `roleroute` (`roleRouteId`,`roleId`,`routeId`) VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,10),(10,1,11),(11,1,12),(12,1,13),(13,1,14),(14,1,16),(15,1,17),(16,1,18),(17,1,19),(18,1,20),(19,1,21),(20,1,22),(21,1,23),(22,1,24),(23,2,1),(24,2,2),(25,2,3),(26,2,4),(27,2,5),(28,2,6),(29,2,7),(30,2,8),(31,2,10),(32,2,11),(33,2,12),(34,2,18),(35,2,19),(36,2,20),(37,2,21),(38,2,22),(39,2,23),(40,2,24),(41,3,1),(42,3,2),(43,3,3),(44,3,4),(45,3,5),(46,3,6),(47,3,7),(48,3,8),(49,3,9),(50,3,10),(51,3,11),(52,3,12),(53,3,13),(54,3,14),(55,3,15),(56,3,16),(57,3,17),(58,3,18),(59,3,19),(60,3,20),(61,3,21),(62,3,22),(63,3,23),(64,3,24);
-- roles DML
INSERT INTO `roles` (`roleId`,`roleName`,`description`) VALUES (1,'admin','Administrator role with all permissions'),(2,'user','Regular user role with limited permissions'),(3,'super','all roles');
-- routeauth DML
INSERT INTO `routeauth` (`id`,`path`,`name`,`component`,`redirect`,`meta`,`parent_id`) VALUES (1,'/about','about','layout.base$view.about',NULL,'{"icon": "fluent:book-information-24-regular", "order": 10, "title": "关于"}',NULL),(2,'/function','function','layout.base',NULL,'{"icon": "icon-park-outline:all-application", "order": 6, "title": "系统功能"}',NULL),(3,'/function/hide-child','function_hide-child',NULL,'/function/hide-child/one','{"icon": "material-symbols:filter-list-off", "order": 2, "title": "隐藏子菜单"}',2),(4,'/function/hide-child/one','function_hide-child_one','view.function_hide-child_one',NULL,'{"icon": "material-symbols:filter-list-off", "title": "子菜单一", "activeMenu": "function_hide-child", "hideInMenu": true}',3),(5,'/function/hide-child/three','function_hide-child_three','view.function_hide-child_three',NULL,'{"title": "子菜单三", "activeMenu": "function_hide-child", "hideInMenu": true}',3),(6,'/function/hide-child/two','function_hide-child_two','view.function_hide-child_two',NULL,'{"title": "子菜单二", "activeMenu": "function_hide-child", "hideInMenu": true}',3),(7,'/function/multi-tab','function_multi-tab','view.function_multi-tab',NULL,'{"icon": "ic:round-tab", "title": "多标签页", "multiTab": true, "activeMenu": "function_tab", "hideInMenu": true}',2),(8,'/function/request','function_request','view.function_request',NULL,'{"icon": "carbon:network-overlay", "order": 3, "title": "请求示例", "buttons": [{"code": "request:get", "desc": "获取请求"}, {"code": "request:post", "desc": "提交请求"}]}',2),(9,'/function/super-page','function_super-page','view.function_super-page',NULL,'{"icon": "ic:round-supervisor-account", "order": 5, "title": "超级管理员页"}',2),(10,'/function/tab','function_tab','view.function_tab',NULL,'{"icon": "ic:round-tab", "order": 1, "title": "标签页", "buttons": [{"code": "tab:add", "desc": "新增标签页"}, {"code": "tab:update", "desc": "修改标签页"}, {"code": "tab:remove", "desc": "删除标签页"}]}',2),(11,'/function/toggle-auth','function_toggle-auth','view.function_toggle-auth',NULL,'{"icon": "ic:round-construction", "order": 4, "title": "切换权限"}',2),(12,'/home','home','layout.base$view.home',NULL,'{"icon": "mdi:monitor-dashboard", "order": 1, "title": "首页"}',NULL),(13,'/manage','manage','layout.base',NULL,'{"icon": "carbon:cloud-service-management", "order": 9, "title": "系统管理"}',NULL),(14,'/manage/menu','manage_menu','view.manage_menu',NULL,'{"icon": "material-symbols:route", "order": 3, "title": "菜单管理", "buttons": [{"code": "menu:add", "desc": "新增菜单"}, {"code": "menu:edit", "desc": "编辑菜单"}, {"code": "menu:delete", "desc": "删除菜单"}], "keepAlive": true}',13),(15,'/manage/role','manage_role','view.manage_role',NULL,'{"icon": "carbon:user-role", "order": 2, "title": "角色管理", "buttons": [{"code": "role:add", "desc": "新增角色"}, {"code": "role:edit", "desc": "编辑角色"}, {"code": "role:delete", "desc": "删除角色"}, {"code": "role:menu", "desc": "菜单权限"}, {"code": "role:button", "desc": "按钮权限"}]}',13),(16,'/manage/user','manage_user','view.manage_user',NULL,'{"icon": "ic:round-manage-accounts", "order": 1, "title": "用户管理", "buttons": [{"code": "user:add", "desc": "新增用户"}, {"code": "user:edit", "desc": "编辑用户"}, {"code": "user:delete", "desc": "删除用户"}]}',13),(17,'/manage/user-detail/:id','manage_user-detail','view.manage_user-detail',NULL,'{"title": "用户详情", "activeMenu": "manage_user", "hideInMenu": true}',13),(18,'/multi-menu','multi-menu','layout.base',NULL,'{"order": 8, "title": "多级菜单"}',NULL),(19,'/multi-menu/first','multi-menu_first',NULL,NULL,'{"order": 1, "title": "菜单一"}',18),(20,'/multi-menu/first/child','multi-menu_first_child','view.multi-menu_first_child',NULL,'{"title": "菜单一子菜单"}',19),(21,'/multi-menu/second','multi-menu_second',NULL,NULL,'{"order": 2, "title": "菜单二"}',18),(22,'/multi-menu/second/child','multi-menu_second_child',NULL,NULL,'{"title": "菜单二子菜单"}',21),(23,'/multi-menu/second/child/home','multi-menu_second_child_home','view.multi-menu_second_child_home',NULL,'{"title": "菜单二子菜单首页"}',22),(24,'/user-center','user-center','layout.base$view.user-center',NULL,'{"title": "个人中心", "hideInMenu": true}',NULL);
-- users DML
INSERT INTO `users` (`id`,`username`,`gender`,`email`,`createTime`,`status`,`roleId`,`phone`,`password`,`nickName`) VALUES (1,'user','female','alice@example.com','2024-06-29 15:31:30','active',2,'15615376325','$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm','werqwer'),(2,'admin','male','bob@example.com','2024-06-29 15:31:30','',1,'15651376633','$2b$10$Lsz9OdgKyuShCfzxQL7AcewmJKvQz47Xx.33E5MZCOA8a5GnSD1Hm','w11111'),(6,'234234','male','1738248442@qq.com','2026-04-30 16:38:54','active',2,'15651376322','$2b$10$wFwQsHxizTuUS.tSFGTc8uHaYcN./UcS47wD8GcvzKZzznZtOtrrK','werwer'),(7,'3452345','male','1738238438@qq.com','2026-04-30 17:02:56','active',2,'15651376329','$2b$10$ngsDX4FAnvFJad9aCPjEO.QY9LyFsj/YBRmzxtUMdRaI2lQ8vTlxC','2');
SET FOREIGN_KEY_CHECKS = 1;
