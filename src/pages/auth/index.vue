<template>
  <div class="auth flex-box flex-ver">
    <div class="loading-wrap flex-box flex-col flex-ver">
      <img class="launch_loading_logo" src="../../static/images/logo.png" />
      <p class="app-name">{{ appName }}</p>
    </div>
  </div>
</template>
<script>
import { getUrlQueryOfObj } from '@/utils'
import supplierApi from '../../api/supplier'
import { mapMutations, mapGetters } from 'vuex'
import { APP_NAME } from '@/utils/settingConfig'
export default {
  name: 'Auth',
  data() {
    return {
      appName: APP_NAME,
      code: '' // wx.login拿回来的code
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId'
    ])
  },
  onLoad(option) {
    // console.log('接受参数', option)
    wx.showLoading({
      title: '检查应用版本',
      mask: true
    })
    // 检测IOS版本
    wx.getSystemInfo({
      success: (res) => {
        wx.hideLoading()
        // console.log(11, res)
        let versionIos = res.system.split(' ')[1].split('.')[0]
        let version = res.system.split(' ')[0].toLowerCase()
        // console.log(222, version, versionIos)
        if (version === 'ios' && versionIos < 10) {
          wx.showModal({
            title: '提示',
            content: `当前ios版本为${res.system.split(' ')[1]}，请升级10以上再登录！`,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },
  onShow() {
    // 调用微信登录wx.login
    this.logining()
  },
  methods: {
    ...mapMutations({
      setToken: 'user/SET_TOKEN',
      setOpenId: 'user/SET_OPEN_ID',
      setUnionId: 'user/SET_UNION_ID'
    }),
    // 调用微信登录wx.login获取code
    logining() {
      wx.showLoading({
        title: '登录微信用户',
        mask: true
      })
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.hideLoading()
            // 通过code获取openid和session_key
            this.code = res.code
            console.log('wx.login获得code成功', res)
            // 调用获取用户信息接口
            console.log('openId', this.openId)
            console.log('unionId', this.unionId)
            // if (!this.unionId) {
            //   this.getUnionId({code: this.code})
            // }
            if (!this.openId || !this.unionId) {
              this.getAsyncOpenId({ code: this.code })
            } else {
              // vuex中的openId/unionId
              this.getAccessToken(this.openId)
            }
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            title: 'wx.login失败' + err,
            icon: 'none',
            duration: 1000
          })
        }
      })
    },
    // 获取unionId
    async getUnionId(params) {
      const res = await this.$http('getOpenidAndUnionid', params)
      console.log('res', res)
    },
    // 获取openId和unionid
    async getAsyncOpenId(parameter) {
      wx.showLoading({
        title: '获取openId和unionid',
        mask: true
      })
      const res = await this.$http('getOpenidAndUnionid', parameter)
      console.log('获取openId和unionid', res)
      wx.hideLoading()
      if (res.success) {
        // 生成唯一值
        this.setOpenId(res.data.openId)
        this.setUnionId(res.data.unionId)
        // console.log('获取openId---值', res.data.openId)
        this.getAccessToken(res.data.openId)
      }
    },
    // 获取token
    async getAccessToken(openId) {
      const res = await this.$http('getAccessToken', { openId })
      console.log('获取token', res)
      if (res.data.success) {
        this.setToken(res.data.data)
        wx.showLoading({
          title: '获取用户信息',
          mask: true
        })
        const userRole = await this.$store.dispatch('user/getUserInfo')
        console.log('userRole---', userRole)
        if (userRole.success) {
          wx.hideLoading()
          const findRole = userRole.data.post
          if (findRole.postCode === 'EXTERNAL_SUP') {
            const res = await supplierApi('registerProgress')
            console.log('res', res)
            if (res.success) {
              if (['-1', '0'].includes(res.data.status)) {
                console.log('跳转')
                wx.navigateTo({
                  url: `/pages/subpackages/supplier/main?${getUrlQueryOfObj(res.data)}`
                })
              }
              if (res.data.status === '1') {
                this.$reLaunch('/pages/tabbarPage/main')
              }
            }
            return
          }
          // 进入首页
          if (findRole) {
            this.$reLaunch('/pages/tabbarPage/main')
          } else {
            wx.showToast({
              title: '当前用户未绑定合法角色',
              icon: 'none',
              duration: 3000
            })
          }
        }
      } else {
        switch (res.data.code) {
          case 10000:
            console.log(999999)
            this.setToken('')
            this.$reLaunch('/pages/register/main')
            break
          case 10009:
            console.log('直接进入首页', res.data)
            this.$reLaunch('/pages/tabbarPage/main')
            break
          case 11002:
          case 11003:
            this.setToken('')
            this.loginErr(`获取token失败，${res.msg}！`)
            break
        }
      }
    },
    // 当前用户未绑定、登录失败、异常等
    loginErr(msg = '') {
      wx.showModal({
        title: '登录失败',
        content: msg,
        confirmText: '刷新',
        showCancel: false,
        success: () => {
          this.$reLaunch(`/pages/auth/main`)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.auth {
  height: 100%;

  .loading-wrap {
    padding-bottom: 160px;

    .launch_loading_logo {
      width: 50px;
      height: 50px;
      border-radius: 50px;
    }

    .app-name {
      margin-top: 20px;
    }
  }
}
</style>