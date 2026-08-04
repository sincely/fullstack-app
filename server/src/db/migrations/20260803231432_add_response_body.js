/**
 * 操作日志表新增 response_body 字段
 * 存储完整的接口响应体 JSON，便于查看日志详情
 */

export async function up(query) {
  await query(`
    ALTER TABLE OperationLog
    ADD COLUMN response_body TEXT COMMENT '响应体(JSON)'
    AFTER response_msg
  `)
}

export async function down(query) {
  await query(`
    ALTER TABLE OperationLog
    DROP COLUMN response_body
  `)
}
