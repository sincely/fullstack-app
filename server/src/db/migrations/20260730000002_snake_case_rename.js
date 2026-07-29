/**
 * 数据库命名规范化迁移：camelCase → snake_case
 *
 * 将所有表名和列名从 camelCase 改为 snake_case，符合 MySQL 惯例。
 * 此迁移仅修改列名，不改变数据类型和约束。
 *
 * 注意：执行前请备份数据库（npm run db:backup）
 */

// 列名映射表（camelCase → snake_case）
const COLUMN_MAP = {
  // Users 表
  nickName: 'nick_name',
  idCard: 'id_card',
  currentRefreshToken: 'current_refresh_token',
  sessionId: 'session_id',
  loginIp: 'login_ip',
  loginTime: 'login_time',
  sessionExpire: 'session_expire',
  createBy: 'create_by',
  createTime: 'create_time',
  updateBy: 'update_by',
  updateTime: 'update_time',
  // Roles 表
  roleId: 'role_id',
  roleCode: 'role_code',
  roleName: 'role_name',
  isSystem: 'is_system',
  // RouteAuth 表
  parentId: 'parent_id',
  menuType: 'menu_type',
  menuName: 'menu_name',
  routeName: 'route_name',
  routePath: 'route_path',
  orderNum: 'order_num',
  iconType: 'icon_type',
  i18nKey: 'i18n_key',
  hideInMenu: 'hide_in_menu',
  activeMenu: 'active_menu',
  multiTab: 'multi_tab',
  keepAlive: 'keep_alive',
  // ButtonAuth 表
  buttonId: 'button_id',
  buttonName: 'button_name',
  buttonLabel: 'button_label',
  // UserRole 表
  userRoleId: 'user_role_id',
  userId: 'user_id',
  // RoleRoute 表
  roleRouteId: 'role_route_id',
  routeId: 'route_id',
  // RoleButton 表
  roleButtonId: 'role_button_id',
  // LoginLog 表
  loginType: 'login_type',
  ipAddress: 'ip_address',
  userAgent: 'user_agent',
  // OperationLog 表
  requestParams: 'request_params',
  requestUrl: 'request_url',
  responseStatus: 'response_status',
  responseMsg: 'response_msg',
  executeTime: 'execute_time'
}

// 表级列定义（表名 → 需要重命名的列列表）
const TABLE_COLUMNS = {
  Users: [
    'nickName',
    'idCard',
    'currentRefreshToken',
    'sessionId',
    'loginIp',
    'loginTime',
    'sessionExpire',
    'createBy',
    'createTime',
    'updateBy',
    'updateTime'
  ],
  Roles: ['roleId', 'roleCode', 'roleName', 'isSystem', 'createBy', 'createTime', 'updateBy', 'updateTime'],
  RouteAuth: [
    'parentId',
    'menuType',
    'menuName',
    'routeName',
    'routePath',
    'orderNum',
    'iconType',
    'i18nKey',
    'hideInMenu',
    'activeMenu',
    'multiTab',
    'keepAlive',
    'createBy',
    'createTime',
    'updateBy',
    'updateTime'
  ],
  ButtonAuth: [
    'buttonId',
    'routeId',
    'routeName',
    'buttonName',
    'buttonLabel',
    'orderNum',
    'createBy',
    'createTime',
    'updateBy',
    'updateTime'
  ],
  UserRole: ['userRoleId', 'userId', 'roleId', 'createTime'],
  RoleRoute: ['roleRouteId', 'roleId', 'routeId', 'createTime'],
  RoleButton: ['roleButtonId', 'roleId', 'buttonId', 'createTime'],
  LoginLog: ['userId', 'loginType', 'ipAddress', 'userAgent', 'sessionId', 'createTime'],
  OperationLog: [
    'userId',
    'requestParams',
    'requestUrl',
    'responseStatus',
    'responseMsg',
    'ipAddress',
    'userAgent',
    'executeTime',
    'createTime'
  ]
}

/**
 * 向上迁移：重命名所有列
 */
export async function up(query) {
  for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
    for (const oldCol of columns) {
      const newCol = COLUMN_MAP[oldCol]
      if (oldCol === newCol) {
        continue
      }

      // MySQL 8.0+ 支持 RENAME COLUMN（无需知道列类型）
      await query(`ALTER TABLE \`${table}\` RENAME COLUMN \`${oldCol}\` TO \`${newCol}\``)
    }
  }
}

/**
 * 向下迁移：恢复 camelCase 列名
 */
export async function down(query) {
  for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
    for (const oldCol of columns) {
      const newCol = COLUMN_MAP[oldCol]
      if (oldCol === newCol) {
        continue
      }

      await query(`ALTER TABLE \`${table}\` RENAME COLUMN \`${newCol}\` TO \`${oldCol}\``)
    }
  }
}
