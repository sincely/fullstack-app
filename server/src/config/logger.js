import fs from 'node:fs'
import path from 'node:path'
import pino from 'pino'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development'

// 日志目录：项目根目录下的 logs 文件夹
const logDir = path.resolve(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// 按日期生成日志文件名
const getLogFileName = () => {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  return path.join(logDir, `${dateStr}.txt`)
}

const logger = pino(
  {
    level: isDev ? 'debug' : 'info',
    hooks: {
      logMethod(inputArgs, method, level) {
        const levelIcons = {
          10: '🔍', // TRACE
          20: '🐛', // DEBUG
          30: '🚀', // INFO
          40: '⚠️', // WARN
          50: '🚨', // ERROR
          60: '💀' // FATAL
        }
        const icon = levelIcons[level] || '📝'

        // Handle case: logger.info('message')
        if (typeof inputArgs[0] === 'string') {
          inputArgs[0] = `${icon} ${inputArgs[0]}`
        } else if (typeof inputArgs[0] === 'object' && typeof inputArgs[1] === 'string') {
          // Handle case: logger.info({ obj }, 'message')
          inputArgs[1] = `${icon} ${inputArgs[1]}`
        }

        return method.apply(this, inputArgs)
      }
    },
    transport: isDev
      ? {
          targets: [
            // 控制台输出（带颜色美化）
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname'
              }
            },
            // 文件输出（纯文本可读格式）
            {
              target: 'pino-pretty',
              options: {
                colorize: false,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
                destination: getLogFileName(),
                append: true,
                mkdir: true
              }
            }
          ]
        }
      : {
          // 生产环境：文件输出纯文本格式，便于直接阅读
          target: 'pino-pretty',
          options: {
            colorize: false,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            destination: getLogFileName(),
            append: true,
            mkdir: true
          }
        },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          query: req.query,
          body: req.body,
          remoteAddress: req.remoteAddress,
          remotePort: req.remotePort
        }
      },
      res(res) {
        return {
          statusCode: res.statusCode
        }
      },
      // 使用 errWithCause 保留错误因果链（Node 16.9+ Error.cause 支持）
      err: pino.stdSerializers.errWithCause
    }
  },
  // 同步写入文件，确保异常日志不丢失
  pino.destination({ sync: true, dest: getLogFileName() })
)

export default logger

// Create a child logger with additional context
export function createLogger(context) {
  return logger.child(context)
}
