const state = {
  // 导航菜单设置
  menuSettings: {},
  alwaysRemind: false // 订阅消息是否勾选总是提醒
}
const mutations = {
  SET_MENU_SETTINGS: (state, menuSettings) => {
    state.menuSettings = menuSettings
  },
  SET_ALWAYS_REMIND: (state, alwaysRemind) => {
    state.alwaysRemind = alwaysRemind
  }
}
const actions = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
