/**
 * 根据当前环境变量创建服务配置
 *
 * @param env 当前环境变量
 */
export function createServiceConfig(env) {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env

  let other = {}
  try {
    other = JSON.parse(VITE_OTHER_SERVICE_BASE_URL)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid JSON string')
  }

  const httpConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  }

  const otherHttpKeys = Object.keys(httpConfig.other)

  const otherConfig = otherHttpKeys.map((key) => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    }
  })

  const config = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  }

  console.log('config', config)

  return config
}

/**
 * 获取后端服务基础地址
 *
 * @param env 当前环境变量
 * @param isProxy 是否启用代理
 */
export function getServiceBaseURL(env, isProxy) {
  const { baseURL, other } = createServiceConfig(env)

  const otherBaseURL = {}

  other.forEach((item) => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL
  })

  return {
    baseURL: isProxy ? createProxyPattern() : baseURL,
    otherBaseURL
  }
}

/**
 * 获取后端服务代理路径模式
 *
 * @param key 服务键，不传时使用默认键
 */
function createProxyPattern(key) {
  if (!key) {
    return '/api'
  }

  return `/api-${key}`
}
