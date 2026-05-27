import './env.js'

export const TokenSecret = process.env.JWT_SECRET
export const TokenExpire = process.env.JWT_EXPIRES_IN || '15m'

export const RefreshTokenSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
export const RefreshTokenExpire = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
