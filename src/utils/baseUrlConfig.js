// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync()

// env类型
const env = accountInfo.miniProgram.envVersion
console.log('env类型', env)
const baseApi = {
  // 开发版
  develop: {
    business: 'http://10.0.10.240:8301/fgscm',
    // business: 'http://10.0.5.228:8301/fgscm',
    sso: 'http://10.0.10.240:9171/portal-sso',
    user: 'http://10.0.10.240:9172/portal-user'
  },
  // 测试环境，发版前体验版直接用生产环境
  trial: 'https://iiuat.donghaigangtie.com/api-uat',
  // trial: 'https://ii.donghaigangtie.com/api',
  // 生产环境
  release: 'https://ii.donghaigangtie.com/api'
  // release: 'https://ii.donghaigangtie.com/api'
  // release: 'http://10.0.10.211:10000'
}

// 请求baseURL
export const BASE_URL = baseApi[env]
