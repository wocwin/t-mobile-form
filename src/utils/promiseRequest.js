import store from '@/store'
import { Toast } from './index'
import { Constant } from './settingConfig'
const Promise = require('es6-promise').Promise
const accountInfo = wx.getAccountInfoSync()

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      // 成功 (只返回res.data)
      obj.success = function (res) {
        // console.log('成功拦截', res)
        // resolve(res.data)
        if (res.data.success) {
          resolve(res.data)
        } else {
          console.log('res---data', res)
          const loginCode = [10000, 10001, 11002, 10009, 11003]
          if (!loginCode.includes(res.data.code)) { Toast(res.data.msg || res.data.message, 'none', 1600) }
          if (res.data.code === 401) { // 用户不存在
            wx.showModal({
              title: '无权访问',
              content: '当前登录信息已失效，点击下方按钮重新登录。',
              confirmText: '重新登录',
              showCancel: false,
              success: () => {
                wx.reLaunch({ url: '/pages/auth/main' })
              }
            })
          }
          resolve(res.data)
        }
      }
      obj.fail = function (res) {
        // console.log('失败拦截', res)
        reject(res)
      }
      fn(obj)
    })
  }
}
// post请求
function wxCompletePromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        // 成功 (只返回res.data)
        resolve(res)
      }
      obj.fail = function (res) {
        // 失败
        reject(res)
      }
      fn(obj)
    })
  }
}
// 无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  )
}
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
export function getRequest(url, data, headers = {}) {
  var getRequest = wxPromisify(wx.request)
  var header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    'env': accountInfo.miniProgram.envVersion,
    'base-url': Constant.BASE_URL,
    'Authorization': store.getters.token,
    ...headers
  }
  // console.log('封装http', url, data)
  if (!url.includes('/common/wx/getOpenId')) {
    header.Authorization = store.getters.token
  }
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: header
  })
}
/**
 * 微信请求delete方法
 * url
 * data 以对象的格式传入
 */
export function deleteRequest(url, data, headers = {}) {
  var getRequest = wxPromisify(wx.request)
  var header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    'Authorization': store.getters.token,
    ...headers
  }
  return getRequest({
    url: url,
    method: 'DELETE',
    data: data,
    header: header
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
export function postRequest(url, data, headers = {}) {
  var postRequest = wxPromisify(wx.request)
  var header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-requested-with': 'XMLHttpRequest',
    'env': accountInfo.miniProgram.envVersion,
    'base-url': Constant.BASE_URL,
    ...headers
  }
  if (!url.includes('/web/openIdLogin')) {
    // console.log('post', url)
    header.Authorization = store.getters.token
  } else {
    postRequest = wxCompletePromisify(wx.request)
  }
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: header
  })
}
