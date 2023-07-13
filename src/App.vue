<script>
export default {
  onLaunch () {
    this.checkUpdate()
  },
  methods: {
    checkUpdate () { // 新版本自动更新
      const canUseUpdateManager = wx.canIUse('getUpdateManager') // 小程序更新机制兼容性
      if (canUseUpdateManager) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(checkForUpdateRes => { // 检查是否有更新
          if (checkForUpdateRes.hasUpdate) {
            wx.showModal({
              title: '更新提示',
              content: '检测到新版本，请更新后重启应用',
              confirmText: '更新',
              showCancel: false,
              success: () => {
                this.downLoadAndUpdate(updateManager)
              }
            })
          }
        })
      } else { // 微信版本过低无法使用自动更新
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法正常更新小程序。',
          confirmText: '更新微信',
          success: ({confirm, cancel}) => {
            if (confirm) {
              wx.updateWeChatApp()
            }
          }
        })
      }
    },
    downLoadAndUpdate (updateManager) { // 下载新版本并引导重启
      wx.showLoading()
      updateManager.onUpdateReady(() => {
        wx.hideLoading()
        updateManager.applyUpdate()
      })
      // 新版本下载失败
      updateManager.onUpdateFailed(() => {
        wx.hideLoading()
        wx.showModal({
          title: '更新失败',
          content: '请退出并在小程序列表中删除当前小程序，重新搜索打开以完成更新。',
          showCancel: false
        })
      })
    }
  }
}
</script>

<style>
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
page {
  --button-primary-background-color: #355DB4;
  --button-primary-border-color: #355DB4;
  /* --button-default-color: #355DB4;
  --button-default-border-color: #355DB4; */

  height: 100%;
  color: #323232;
  box-sizing: border-box;
}
</style>
