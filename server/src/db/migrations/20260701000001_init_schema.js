/**
 * 示例迁移文件：初始化表结构
 *
 * 迁移文件命名规范：
 * {YYYYMMDDHHMMSS}_{description}.{js|sql}
 *
 * 例如：
 * - 20260701000001_init_schema.js
 * - 20260715000002_add_user_status.sql
 */

/**
 * 向上迁移：创建表或添加字段
 * @param {Function} query - SQL 执行函数
 */
export async function up(query) {
  // 示例：创建一个简单的配置表
  await query(`
    CREATE TABLE IF NOT EXISTS \`app_config\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`key\` VARCHAR(100) NOT NULL UNIQUE,
      \`value\` TEXT,
      \`description\` VARCHAR(255),
      \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  // 插入默认配置
  await query(`
    INSERT INTO \`app_config\` (\`key\`, \`value\`, \`description\`) VALUES
    ('app.name', 'Koa Admin', '应用名称'),
    ('app.version', '1.0.0', '应用版本')
  `)
}

/**
 * 向下迁移：回滚操作
 * @param {Function} query - SQL 执行函数
 */
export async function down(query) {
  await query('DROP TABLE IF EXISTS `app_config`')
}