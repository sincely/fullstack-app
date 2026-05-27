import jwt from 'jsonwebtoken'
import { TokenSecret, TokenExpire, RefreshTokenSecret, RefreshTokenExpire } from '../config/jwt.js'

/**
 * 生成 Access Token
 * @param {Object} payload - 要加密的数据
 * @returns {string} Token
 */
export function generateToken(payload) {
  return jwt.sign(payload, TokenSecret, {
    expiresIn: TokenExpire
  })
}

/**
 * 生成 Refresh Token
 * @param {Object} payload - 要加密的数据
 * @returns {string} Refresh Token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, RefreshTokenSecret, {
    expiresIn: RefreshTokenExpire
  })
}

/**
 * 验证 Access Token
 * @param {string} token - Token
 * @returns {Object} 解密后的 payload
 * @throws {Error} TOKEN_EXPIRED | TOKEN_INVALID
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, TokenSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token 已过期，请重新登录')
      err.code = 1001 // 与前端 VITE_SERVICE_EXPIRED_TOKEN_CODES 保持一致
      err.status = 401
      throw err
    }
    const err = new Error('Token 无效')
    err.code = 1001 // 与前端 VITE_SERVICE_EXPIRED_TOKEN_CODES 保持一致
    err.status = 401
    throw err
  }
}

/**
 * 验证 Refresh Token
 * @param {string} token - Refresh Token
 * @returns {Object} 解密后的 payload
 * @throws {Error} TOKEN_EXPIRED | TOKEN_INVALID
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, RefreshTokenSecret)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Refresh Token 已过期，请重新登录')
      err.code = 1001 // 与前端 VITE_SERVICE_EXPIRED_TOKEN_CODES 保持一致
      err.status = 401
      throw err
    }
    const err = new Error('Refresh Token 无效')
    err.code = 1001 // 与前端 VITE_SERVICE_EXPIRED_TOKEN_CODES 保持一致
    err.status = 401
    throw err
  }
}

/**
 * 解码 Token（不验证）
 * @param {string} token - Token
 * @returns {Object|null} 解码后的数据或 null
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch {
    return null
  }
}
