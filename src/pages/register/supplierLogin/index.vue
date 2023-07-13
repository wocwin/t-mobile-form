<template>
  <div class="supplier_login">
    <t-header
      title="供应点登录"
      :isGoBack="true"
      :isGoBackEvent="true"
      background="#355db4"
      color="#fff"
    ></t-header>
    <supplier-form />
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import { getUrlQueryOfObj } from '@/utils'
import RegisterForm from '../RegisterForm.vue'
import RegisterInput from '../RegisterInput.vue'
import SupplierForm from './supplierForm.vue'
export default {
  name: 'SupplierLogin',
  components: {
    RegisterForm,
    RegisterInput,
    SupplierForm
  },
  data() {
    return {
      getOpenId: '', // 可能会从vuex或路径参数多个渠道来
      getUnionId: '', // 可能会从vuex或路径参数多个渠道来
      isError: false,
      isError1: false,
      supplierRegisterInfo: {
        userName: '', // 账号或司机姓名
        phoneNum: '', // 手机号
        password: '' // 用户密码
      }
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId',
      'menuSettings'
    ])
  },
  onLoad(option) {
    // Object.assign(this.$data, this.$options.data())
    // this.getOpenId = option.openId || this.openId
    // this.getUnionId = option.unionId || this.unionId
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
    // 校验姓名和账号手机号码
    checkVerify(event, type, val) {
      let value = (event.mp && event.mp.detail.value) || val
      let reg = /[^]/
      let msg = ''
      switch (type) {
        case 'phoneNum': // 手机号码
          reg = /^1[3456789]\d{9}$/
          msg = !value ? '请输入手机号码' : '请输入正确的手机号码'
          break
        case 'userName': // 账号姓名
          reg = /^[\s\S]{1,10}$/
          msg = !value ? 'scm账号不能为空' : 'scm账号不能超过10个字符'
          break
        default:
          break
      }
      this.supplierRegisterInfo[type] = value
      // console.log('车牌号', value)
      if (!reg.test(value)) {
        this.$toast(msg)
        switch (type) {
          case 'phoneNum': // 手机号码
            if (this.supplierRegisterInfo[type]) {
              this.isError = true
            } else {
              this.isError = false
            }
            break
          case 'userName': // 账号或司机姓名
            if (this.supplierRegisterInfo[type]) {
              this.isError1 = true
            } else {
              this.isError1 = false
            }
            break
          default:
            break
        }
      } else {
        this.checkError(type)
      }
    },
    // 清空输入框
    clearAll(type) {
      this.checkError(type)
      this.supplierRegisterInfo[type] = ''
    },
    // 输入框错误
    checkError(type) {
      switch (type) {
        case 'phoneNum': // 手机号码
          this.isError = false
          break
        case 'userName': // 账号或司机姓名
          this.isError1 = false
          break
        default:
          break
      }
    },
    // 供应商注册
    async validation(validCallback) {
      // console.log('供应商注册', this.supplierRegisterInfo)
      if (this.isError || this.isError1) {
        this.$toast('请正确输入注册信息', 'none')
        return
      }
      if (!this.supplierRegisterInfo.phoneNum) {
        this.$toast('请输入手机号码', 'none')
        return
      }
      if (!this.supplierRegisterInfo.userName) {
        this.$toast('请输入司机姓名', 'none')
        return
      }
      if (!this.supplierRegisterInfo.password) {
        this.$toast('请输入SCM密码', 'none')
        return
      }
      let supplierParams = {
        phoneNum: this.supplierRegisterInfo.phoneNum, // 手机号
        password: this.supplierRegisterInfo.password,
        userName: this.supplierRegisterInfo.userName // 用户名
      }
      validCallback(supplierParams)
    },
    // 供应商注册
    async registerSubmit() {
      this.validation(async (supplierParams) => {
        const res = await this.$http('registerSupplier', {
          ...supplierParams,
          openId: this.getOpenId,
          unionId: this.getUnionId
        })
        console.log('小程序供应商注册', res)
        if (res.success) {
          this.setToken(res.data)
          this.$store.dispatch('user/getUserInfo')
          this.registerSuccess()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    registerSuccess() {
      const query = this.$mp.query
      this.$reLaunch(`/pages/auth/main?${getUrlQueryOfObj(query)}`)
    }
  }
}
</script>
<style lang="scss">
.supplier_login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  // .register-input {
  //   width: 570rpx;
  //   height: 88rpx;
  //   background: #f8f8f8;
  //   border-radius: 8px;
  //   font-size: 28rpx;
  //   line-height: 88rpx;
  //   padding-left: 30rpx;
  // }
  // .verify-input {
  //   width: auto;
  // }
  // .select-cell {
  //   margin-top: 20px;
  // }
  // .uploader {
  //   margin-top: 20px;
  //   .uploader-content {
  //     .uploader-image {
  //       width: 80px;
  //       height: 80px;
  //       background: #355db4;
  //       border-radius: 50%;
  //     }
  //     .txt {
  //       color: #323232;
  //       font-size: 14px;
  //       margin-top: 5px;
  //     }
  //   }
  //   .prediv-image {
  //     width: 254px;
  //     height: 168px;
  //     background: #e0e0e0;
  //     border-radius: 10px;
  //     position: relative;
  //     .uploader__img {
  //       width: 100%;
  //       height: 100%;
  //       border-radius: 10px;
  //     }
  //     .del-icon {
  //       background: #fff;
  //       border-radius: 50%;
  //       font-size: 18px;
  //       position: absolute;
  //       top: 10px;
  //       right: 10px;
  //     }
  //   }
  // }
  // .button-area {
  //   margin-top: 20px;
  //   height: 130rpx;
  //   .register-btn {
  //     flex-shrink: 0;
  //     width: 600rpx;
  //     height: 88rpx;
  //     font-size: 24rpx;
  //     line-height: 88rpx;
  //     text-align: center;
  //     margin: 10rpx 0;
  //     color: #fff;
  //     font-size: 32rpx;
  //     background: #355db4;
  //     border-radius: 8rpx;
  //   }
  //   .register-btn[disabled] {
  //     opacity: 0.5;
  //   }
  // }
}
</style>