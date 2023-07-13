
// 浮点数加法运算
function FloatAdd (arg1, arg2) {
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return this.FloatDiv((this.FloatMul(arg1, m) + this.FloatMul(arg2, m)), m)
}
// 浮点数减法运算
function FloatSub (arg1, arg2) {
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return (this.FloatDiv((this.FloatMul(arg1, m) - this.FloatMul(arg2, m)), m)).toFixed(n)
}
// 浮点数乘法运算
function FloatMul (arg1, arg2) {
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) { }
  try { m += s2.split('.')[1].length } catch (e) { }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
// 浮点数除法运算
function FloatDiv (arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1, r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
  try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
// 把字符串按每4等分 分割
export function splitStr (str) {
  return str.replace(/(\S{4})(?=(\S{0,4})+)/g, '$1 ')
}
// 获取当前页面
export function getCurrentPageUrl () {
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route // 当前页面url
  return url
}
// 获取当前页面参数，仅允许取一次
export function getCurrentPageQuery () {
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const query = currentPage.data.query || {} // 当前页面参数
  return query
}
// 打开新窗口
export function openWin (url) {
  wx.navigateTo({ url: url })
}
// 关闭当前页面，跳转到应用内的某个页面
export function redirectTo (url) {
  wx.redirectTo({ url: url })
}
// 关闭所有页面，打开到应用内的某个页面
export function reLaunch (url) {
  wx.reLaunch({ url: url })
}
// 返回上一级窗口，允许带上参数
export function back (query = {}, delta = 1) {
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - (delta + 1)]
  prevPage.setData({
    query
  })
  wx.navigateBack({ delta })
}
/**
 * @param {弹出内容} title
 * @param {icon类型} type   ('success','loading','none')
 * @param {显示时间} time   毫秒
 */
export function Toast (title, type, time) {
  wx.showToast({
    title,
    icon: type || 'none',
    duration: time || 1750,
    mask: true
  })
}
// 使用函数节流防止重复点击
export function throttle (fn, gapTime) {
  if (gapTime === null || gapTime === undefined) {
    gapTime = 2000
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) // 将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
// 将对象转为URL参数
export function getUrlQueryOfObj (obj = {}) {
  return Object.keys(obj).reduce((acc, cur) => {
    acc += `&${cur}=${obj[cur]}`
    return acc
  }, '').slice(1)
}

export default {
  FloatAdd,
  FloatSub,
  FloatMul,
  FloatDiv
}
