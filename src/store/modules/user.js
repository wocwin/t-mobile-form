import requestHttp from '../../api/apiPath'
const state = {
  avatarUrl: '', // 微信头像
  token: '',
  openId: '',
  unionId: '',
  templateId: '', // 模板id
  subscribeData: {}, // 订阅消息
  userType: '', // 当前用户角色：EXTERNAL_DRIVER-司机 EXTERNAL_SUP-供应商
  mpBinding: null, // 是否绑定微信公众号
  miniBinding: null, // 是否已经绑定微信小程序
  userInfo: {}, // 登录个人信息
  wxUserInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_AVATAR_URL: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  },
  SET_OPEN_ID: (state, openId) => {
    state.openId = openId
  },
  SET_UNION_ID: (state, unionId) => {
    state.unionId = unionId
  },
  SET_MP_BINDING: (state, mpBinding) => {
    state.mpBinding = mpBinding
  },
  SET_MINI_BINDING: (state, miniBinding) => {
    state.miniBinding = miniBinding
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_WX_USER_INFO: (state, wxUserInfo) => {
    state.wxUserInfo = wxUserInfo
  },
  SET_USER_TYPE: (state, userType) => {
    state.userType = userType
  },
  SET_TEMPLATE_ID: (state, templateId) => {
    state.templateId = templateId
  },
  SET_SUBSCRIBE_DATA: (state, subscribeData) => {
    state.subscribeData = subscribeData
  }
}
const actions = {
  // 获取当前登录人信息
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      requestHttp('getProfile').then(response => {
        console.log('store用户信息', response)
        // response.data.post
        const data = response.data
        commit('SET_USER_TYPE', data.post.postCode)
        commit('SET_USER_INFO', data)
        // console.log();
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
