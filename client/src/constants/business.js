import { transformRecordToOption } from '@/utils/common'

export const enableStatusRecord = {
  1: '启用',
  2: '禁用'
}

export const enableStatusOptions = transformRecordToOption(enableStatusRecord)

export const userGenderRecord = {
  1: '男',
  2: '女'
}

export const userGenderOptions = transformRecordToOption(userGenderRecord)

export const menuTypeRecord = {
  1: '目录',
  2: '菜单'
}

export const menuTypeOptions = transformRecordToOption(menuTypeRecord)

export const menuIconTypeRecord = {
  1: 'iconify图标',
  2: '本地图标'
}

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord)
