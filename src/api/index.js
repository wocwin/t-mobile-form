import { getRequest, postRequest, deleteRequest } from '@/utils/promiseRequest'
import { Constant } from '@/utils/settingConfig'

export default (function request() {
  return function () {
    let args = Array.from(arguments)
    const config = args[0]
    const funcName = args[1]
    const data = args[2]
    if (typeof config[funcName] !== 'object') {
      throw new Error('调用api函数函数错误，请检查函数名称是否错误')
    }
    // 配置wx.request的config
    var newConfig = JSON.parse(JSON.stringify(config[funcName]))
    console.log('newConfig---', newConfig)
    let base = ''
    switch (newConfig.baseApi) {
      case 'user':
        base = Constant.USER_URL
        break
      case 'sso':
        base = Constant.SSO_URL
        break
      default:
        base = Constant.BASE_URL
        break
    }
    // console.log('newConfig---base', base)
    if (newConfig.method === 'post') {
      return postRequest(base + newConfig.url, data, newConfig.headers)
    } else if (newConfig.method === 'delete') {
      return deleteRequest(base + newConfig.url, data, newConfig.headers)
    } else {
      return getRequest(base + newConfig.url, data, newConfig.headers)
    }
  }
})()
