const getters = {
  menuSettings: state => state.common.menuSettings,
  alwaysRemind: state => state.common.alwaysRemind, // 订阅消息是否勾选总是提醒
  avatarUrl: state => state.user.avatarUrl,
  token: state => state.user.token,
  openId: state => state.user.openId,
  unionId: state => state.user.unionId,
  mpBinding: state => state.user.mpBinding, // 是否绑定微信公众号
  miniBinding: state => state.user.miniBinding, // 是否已经绑定微信小程序
  userInfo: state => state.user.userInfo,
  wxUserInfo: state => state.user.wxUserInfo,
  templateId: state => state.user.templateId, // 模板id
  subscribeData: state => state.user.subscribeData, // 订阅消息
  userType: state => state.user.userType // 当前登录用户 EXTERNAL_DRIVER-司机 EXTERNAL_SUP-供应商
}
export default getters
