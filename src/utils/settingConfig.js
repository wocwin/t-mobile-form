import { BASE_URL } from './baseUrlConfig'

console.log('settingConfig---', BASE_URL)
export const Constant = {
  BASE_URL: BASE_URL.business,
  SSO_URL: BASE_URL.sso,
  USER_URL: BASE_URL.user,
  // 上传接口
  UPLOAD_IMGE: `/applet/common/upload`
}
export const APP_NAME = '废钢供应链平台SCM'
export const PLATE_TYPES = [
  {
    label: '黄牌',
    name: '黄牌',
    value: '1',
    class: 'plate_color_yellow'
  },
  {
    label: '蓝牌',
    name: '蓝牌',
    value: '2',
    class: 'plate_color_blue'
  },
  {
    label: '绿牌',
    name: '绿牌',
    value: '3',
    class: 'plate_color_green'
  }
]
