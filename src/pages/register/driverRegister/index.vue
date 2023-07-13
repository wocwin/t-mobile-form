<template>
  <div class="steel_supplier_login">
    <t-header title="司机注册" :isGoBack="true" :isGoBackEvent="true" background="#355db4" color="#fff"></t-header>
    <DriverRegister ref="driverRegister" />
    <div class="footer">
      <van-button class="footer-btn" block type="primary" @click="registerDriver">注册</van-button>
    </div>
    <!-- <div class="phone" @click="makePhoneCall">
      <van-icon class="icon" name="phone" />
      {{ phone }}
    </div> -->
    <Tip ref="tips"></Tip>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import DriverRegister from './driverRegister.vue'
import { getUrlQueryOfObj } from '@/utils'
import driverApi from '../../../api/driver'
import Tip from '@/components/Tip/index.vue'

export default {
  name: 'DriverLogin',
  components: {
    DriverRegister,
    Tip
  },
  data () {
    return {
      getOpenId: '', // 可能会从vuex或路径参数多个渠道来
      getUnionId: '', // 可能会从vuex或路径参数多个渠道来
      phone: 15005037270,
      errMsg: ''
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId'
    ])
  },
  onLoad (option) {
    const { query } = this.$mp
    console.log('司机注册--', option)
    console.log('司机注册--路由参数', query)
    // this.getOpenId = option.openId || this.openId || query.openId
    // this.getUnionId = option.unionId || this.unionId || query.unionId
    // if (!this.getOpenId || !this.getUnionId) { // 无openId或unionId
    //   wx.showModal({
    //     title: '获取用户信息失败',
    //     content: `请点击按钮重新获取。如此提示重复出现，可点击右上角“···”后，点击下方弹窗“重新进入小程序”按钮重启。`,
    //     showCancel: false,
    //     confirmText: '重新获取',
    //     success: () => {
    //       this.registerSuccess()
    //     }
    //   })
    // }
  },
  methods: {
    ...mapMutations({
      setToken: 'user/SET_TOKEN'
    }),
    async registerDriver () {
      let result = this.$refs.driverRegister.checkForm()
      console.log('result', result)
      let msg = ''
      let check = false
      result.forEach(item => {
        let key = item[0]
        let isCheck = item[1]
        if (['driverFrontImage', 'driverBackendImage', 'drivingFrontImage', 'drivingBackendImage'].includes(key)) {
          if (!isCheck) {
            msg = '请完成拍照上传'
          }
        }
        if (!isCheck) {
          check = true
        }
      })
      console.log('msg', msg)
      if (msg) {
        console.log(this.$refs.tips)
        this.$refs.tips.showTip(msg)
        return
      }
      // console.log('store',this);
      console.log('check', check)
      if (check) {
        return
      }
      // const res = await driverApi('driverRegister', {})
      let driverInfo = this.$refs.driverRegister.driverInfo || {}
      let data = {
        openId: this.openId,
        unionId: this.unionId,
        ...driverInfo
      }
      wx.showLoading({
        title: '注册中',
        mask: true
      })
      try {
        const res = await driverApi('driverRegister', data)
        console.log('res', res)
        if (res.success) {
          console.log('this.$mp.query', this.$mp.query)
          this.$refs.tips.showTip('注册成功')
          this.$reLaunch(`/pages/auth/main`)
        } else {
          console.log('rej')
          wx.hideLoading()
          // this.$reLaunch(`/pages/auth/main`)
        }
      } catch (error) {
        console.log('error', error)
        wx.hideLoading()
      }
      // this.errMsg = ''
      // wx.showLoading()
      // this.$refs.driverRegister.validation(async (driverParams) => {
      //   const res = await this.$http('registerDriver', {
      //     ...driverParams,
      //     openId: this.getOpenId,
      //     unionId: this.getUnionId
      //   })
      //   wx.hideLoading()
      //   console.log('小程序司机注册', res)
      //   if (res.data.success) {
      //     this.setToken(res.data.data)
      //     this.$store.dispatch('user/getUserInfo')
      //     this.registerSuccess()
      //   } else {
      //     this.errMsg = res.data.msg
      //   }
      // })
    },
    registerSuccess () {
      const query = this.$mp.query
      this.$reLaunch(`/pages/auth/main?${getUrlQueryOfObj(query)}`)
      // }
    },
    makePhoneCall () {
      wx.makePhoneCall({ phoneNumber: this.phone.toString() })
    }
  }
}
</script>
<style lang="scss">
.steel_supplier_login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: #f2f2f2;
  .footer {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
    padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
    // margin-top: 10px;
    margin: 10px 0;
    background: #ffffff;
    .footer-btn {
      width: 90%;
    }
  }
}
</style>