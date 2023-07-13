import Vue from 'vue'
import App from './App'
import store from './store' // 引入vuex
import PromiseHttp from './api/apiPath/index'
import THeader from '@/components/THeader'
import DhLoading from '@/components/DhLoading'
import TIcon from '@/components/TIcon'
import './static/styles/index.scss' // 引入公共样式
import { openWin, reLaunch, redirectTo, back, getCurrentPageQuery, Toast } from './utils/index'
// import TMobileForm from 't-mobile-form/packages/form/src/index.vue'
import TMobileForm from '../packages/form/src/index.vue'
// 请求接口挂载在Vue原型上
Vue.prototype.$http = PromiseHttp
// 将store挂载到Vue原型上
Vue.prototype.$store = store
Vue.prototype.$openWin = openWin
Vue.prototype.$redirectTo = redirectTo
Vue.prototype.$reLaunch = reLaunch
Vue.prototype.$back = back
Vue.prototype.$getCurrentPageQuery = getCurrentPageQuery
Vue.prototype.$toast = Toast
Vue.component('DhLoading', DhLoading) // loding组件
Vue.component('THeader', THeader) // 头部导航栏组件注册
Vue.component('TIcon', TIcon) // svg icon
Vue.component('TMobileForm', TMobileForm) // TMobileForm
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
