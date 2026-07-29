/**
 * @module IP 地理位置解析
 * @description 通过免费 IP 查询接口解析 IP 归属地，带本地缓存与超时容错
 */

import axios from 'axios'
import logger from '../config/logger.js'

// 简易内存缓存：ip -> location，避免重复请求
const cache = new Map()
const CACHE_MAX = 1000

/**
 * 判断是否为本地/内网 IP
 */
const isPrivateIp = (ip) => {
  if (!ip || ip === 'Unknown') {
    return true
  }
  // IPv6 本地回环
  if (ip === '::1' || ip === '::') {
    return true
  }
  // 去除 IPv6 映射的 IPv4 前缀
  const normalized = ip.replace(/^::ffff:/, '')
  if (normalized === '127.0.0.1') {
    return true
  }
  // 内网段 10.x / 172.16-31.x / 192.168.x
  const parts = normalized.split('.')
  if (parts.length === 4) {
    const [a, b] = parts.map(Number)
    if (a === 10) {
      return true
    }
    if (a === 172 && b >= 16 && b <= 31) {
      return true
    }
    if (a === 192 && b === 168) {
      return true
    }
  }
  return false
}

/**
 * 根据 IP 解析地理位置
 * 本地/内网 IP 返回 "本地访问"，公网 IP 调用免费接口查询
 * @param {string} ip
 * @returns {Promise<string>} 地理位置描述，如 "中国 北京 北京" 或 "本地访问"
 */
export const getIpLocation = async (ip) => {
  if (isPrivateIp(ip)) {
    return '本地访问'
  }

  // 命中缓存直接返回
  if (cache.has(ip)) {
    return cache.get(ip)
  }

  try {
    // 使用 ip-api.com 免费接口（无需 key，限速 45 req/min）
    const { data } = await axios.get('http://ip-api.com/json/' + ip, {
      params: { lang: 'zh-CN', fields: 'status,country,regionName,city' },
      timeout: 3000
    })

    if (data?.status === 'success') {
      const parts = [data.country, data.regionName, data.city].filter(Boolean)
      const location = parts.join(' ') || '未知地区'

      // 写入缓存
      if (cache.size >= CACHE_MAX) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      cache.set(ip, location)

      return location
    }

    return '未知地区'
  } catch (error) {
    logger.warn({ err: { message: error.message }, ip }, 'IP 地理位置解析失败')
    return '未知地区'
  }
}

export default { getIpLocation }
