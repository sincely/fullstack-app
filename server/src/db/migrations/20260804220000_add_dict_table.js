/**
 * 新增字典管理表（Dict）及相关菜单权限配置
 */

export async function up(query) {
  // 创建字典表
  await query(`
    CREATE TABLE IF NOT EXISTS Dict (
      id int NOT NULL AUTO_INCREMENT,
      dict_name varchar(100) NOT NULL COMMENT '字典名称',
      dict_code varchar(100) NOT NULL COMMENT '字典编码',
      status tinyint NOT NULL DEFAULT 1 COMMENT '状态：1=启用 0=禁用',
      remark varchar(500) DEFAULT '' COMMENT '备注',
      create_by varchar(50) DEFAULT '' COMMENT '创建人',
      create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      update_by varchar(50) DEFAULT '' COMMENT '更新人',
      update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (id),
      UNIQUE KEY uk_dict_name (dict_name),
      UNIQUE KEY uk_dict_code (dict_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典表'
  `)

  // 查询父菜单 "系统管理" (route_name = 'manage') 的 ID
  const manageRows = await query(
    `SELECT id FROM RouteAuth WHERE route_name = 'manage' LIMIT 1`
  )
  const parentId = manageRows[0]?.id

  if (parentId) {
    // 插入菜单记录
    await query(`
      INSERT INTO RouteAuth (parent_id, menu_type, menu_name, route_name, route_path, component, redirect, order_num, icon, icon_type, i18n_key, hide_in_menu, active_menu, multi_tab, keep_alive, status, create_by, create_time, update_by, update_time)
      VALUES (?, 2, '字典管理', 'manage_dict', '/manage/dict', 'view.manage_dict', NULL, 4, 'mdi:book-open-outline', 1, NULL, 0, NULL, 0, 0, 1, 'System', NOW(), 'System', NOW())
    `, [parentId])

    // 查询刚插入的菜单 ID
    const dictRows = await query(
      `SELECT id FROM RouteAuth WHERE route_name = 'manage_dict' LIMIT 1`
    )
    const dictRouteId = dictRows[0]?.id

    if (dictRouteId) {
      // 插入按钮权限：新增、编辑、删除
      await query(`
        INSERT INTO ButtonAuth (route_id, route_name, button_name, button_label, order_num, status, create_by, create_time, update_by, update_time)
        VALUES
          (?, 'manage_dict', 'dict:add', '新增字典', 1, 1, 'System', NOW(), 'System', NOW()),
          (?, 'manage_dict', 'dict:edit', '编辑字典', 2, 1, 'System', NOW(), 'System', NOW()),
          (?, 'manage_dict', 'dict:delete', '删除字典', 3, 1, 'System', NOW(), 'System', NOW())
      `, [dictRouteId, dictRouteId, dictRouteId])
    }
  }
}

export async function down(query) {
  // 删除按钮权限
  await query(`DELETE FROM ButtonAuth WHERE route_name = 'manage_dict'`)
  // 删除菜单
  await query(`DELETE FROM RouteAuth WHERE route_name = 'manage_dict'`)
  // 删除表
  await query(`DROP TABLE IF EXISTS Dict`)
}
