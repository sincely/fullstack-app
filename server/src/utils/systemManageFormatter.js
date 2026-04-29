const pad = (value) => String(value).padStart(2, '0')

export const formatDateTime = (value) => {
  if (!value) {
    return ''
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`
}

export const toRoleCode = (roleName = '') => {
  const normalized = String(roleName).trim()
  if (!normalized) {
    return 'R_USER'
  }

  const upper = normalized.toUpperCase()
  if (upper.startsWith('R_')) {
    return upper
  }
  if (upper.includes('SUPER')) {
    return 'super'
  }
  if (upper.includes('ADMIN')) {
    return 'admin'
  }

  return 'R_USER'
}

export const toDocStatus = (status) => {
  return status === 'active' ? '1' : '2'
}

export const toDocGender = (gender) => {
  if (gender === 'male') {
    return '1'
  }
  if (gender === 'female') {
    return '2'
  }

  return ''
}

export const toRoleRecord = (role) => {
  return {
    id: role.roleId,
    createBy: '',
    createTime: formatDateTime(role.createTime),
    updateBy: '',
    updateTime: formatDateTime(role.updateTime),
    status: '1',
    roleName: role.roleName ?? '',
    roleCode: toRoleCode(role.roleName),
    roleDesc: role.description ?? ''
  }
}

export const toUserRecord = (user) => {
  return {
    id: user.id,
    createBy: '',
    createTime: formatDateTime(user.createTime),
    updateBy: '',
    updateTime: formatDateTime(user.updateTime),
    status: toDocStatus(user.status),
    userName: user.username ?? '',
    userGender: toDocGender(user.gender),
    nickName: user.username ?? '',
    userPhone: '',
    userEmail: user.email ?? '',
    userRoles: [toRoleCode(user.roleName)]
  }
}
