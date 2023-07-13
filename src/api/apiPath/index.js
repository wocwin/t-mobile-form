import request from '../index'
const config = {
  /**
   * 注册登录api
   */
  // 获取当前登录人用户信息
  getProfile: {
    url: `/system/user/profile`,
    baseApi: 'user'
  },
  // 更具openId获取用户token
  getAccessToken: {
    url: '/web/openIdLogin',
    method: 'post',
    baseApi: 'sso'
  },
  // 退出登录
  logout: {
    url: '/web/logout',
    method: 'post',
    baseApi: 'sso'
  },
  // 根据code获取openId
  getOpenId: {
    url: `/common/wx/getOpenId`
  },
  // 根据code获取openid、unionid
  getOpenidAndUnionid: {
    url: '/applet/code/id'
  }
}

export default function req(funcName, data) {
  return request(config, funcName, data)
}
