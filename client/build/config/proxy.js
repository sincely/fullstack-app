import { createServiceConfig } from '../../src/utils/service'

/**
 * 创建 Vite 开发代理配置
 *
 * @param env 当前环境变量
 * @param isDev 是否为开发环境
 * @returns {Record<string, any> | undefined} 未开启代理时返回 undefined
 */
export function createViteProxy(env, isDev) {
  // 仅在开发环境且显式开启开关时启用代理
  const isEnableHttpProxy = isDev && env.VITE_HTTP_PROXY === 'Y'

  if (!isEnableHttpProxy) return undefined

  // 生成默认服务与其他服务的基础代理配置
  const { baseURL, proxyPattern, other } = createServiceConfig(env)

  const proxy = createProxyItem({ baseURL, proxyPattern })

  // 合并其他后端服务的代理规则
  other.forEach((item) => {
    Object.assign(proxy, createProxyItem(item))
  })

  console.log('代理配置', proxy)

  return proxy
}

function createProxyItem(item) {
  const proxy = {}

  // 将 /proxy-xxx 前缀的请求转发到目标服务，并在转发前去除该前缀
  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: (path) => {
      // 默认后端本身就以 /api 为前缀，这里不做去前缀处理
      if (item.proxyPattern === '/api') {
        return path
      }
      return path.replace(new RegExp(`^${item.proxyPattern}`), '')
    }
  }

  return proxy
}
