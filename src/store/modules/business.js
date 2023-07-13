import requestHttp from '../../api/apiPath'
const state = {
  secondSupplierInfo: { // 二级供应商详细信息
    bindSupplierList: [],
    name: '',
    position: '',
    telephone: ''
  }
}
const mutations = {
  SET_SECOND_SUPPLIER_INFO: (state, secondSupplierInfo) => {
    state.secondSupplierInfo = secondSupplierInfo
  }
}
const actions = {
  // 获取二级供应商详细信息
  getSecondSupplierInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      requestHttp('getSupplierSecondInfo').then(response => {
        if (response.success) {
          commit('SET_SECOND_SUPPLIER_INFO', response.data)
        }
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
