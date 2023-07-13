<template>
  <div class="personal-center">
    <t-header title="个人中心" />
    <div class="header">
      <h3 class="name">{{ userInfo.name ? userInfo.name : '' }}</h3>
      <div class="item_wrap flex-box flex-ver-v">
        <span class="label">注册电话：</span>
        <span class="value">{{ userInfo.telephone ? userInfo.telephone : '' }}</span>
        <van-icon class="edit_icon" name="edit" @click="edit('tel')" />
      </div>
      <div class="item_wrap flex-box flex-ver-v">
        <span class="label">身份证号码：</span>
        <span class="value">{{ userInfo.code ? userInfo.code : '' }}</span>
        <van-icon class="edit_icon" name="edit" @click="edit('idNum')" />
      </div>
      <div class="item_wrap flex-box flex-ver-v">
        <span class="label">从业资格证：</span>
        <span class="value">{{ userInfo.certificate ? userInfo.certificate : '' }}</span>
        <van-icon class="edit_icon" name="edit" @click="edit('certificate')" />
      </div>
    </div>
    <scroll-view
      scroll-y
      :style="{ height: 'calc(100% - ' + menuSettings.navBarHeight + 'px - ' + 106 + 'px)'}"
    >
      <div class="customer_wrap">
        <div class="title_wrap flex-box flex-between flex-ver-v">
          <span class="title">车辆信息</span>
          <div class="add flex-box flex-ver-v" @click="addCar">
            <van-icon class="icon" name="plus" />新增
          </div>
        </div>
        <div class="list_wrap flex-box flex-col">
          <div v-if="plateNumList.length === 0" class="no_data_img flex-box flex-col flex-ver-v">
            <img src="../../../static/images/no-data.png" />
            <span>暂无数据</span>
          </div>
          <div
            class="car_item flex-box flex-ver-v"
            v-for="(truck,index) in plateNumList"
            :key="index"
          >
            <div
              :class="{'plate_color_0': truck.plateColor === 0, 'plate_color_1': truck.plateColor === 1, 'plate_color_2': truck.plateColor === 2}"
            ></div>
            <div class="label">{{ truck.plateNum }}</div>
            <van-icon class="qr" name="apps-o" color="#355DB4" size="22px" @click="QrCode(truck)" />
            <van-icon class="icon" name="cross" @click="deleteTruck(truck.truckCode)" />
          </div>
        </div>
      </div>
      <van-button class="logout" block @click="remove">退出登录</van-button>
    </scroll-view>
    <!-- 二维码弹窗展示 -->
    <van-popup
      :show="showNotice"
      class="notice-popup"
      close-icon="close"
      custom-style="100vh"
      position="bottom"
      closeable
      @close="popClose"
    >
      <div class="box flex-box flex-col flex-ver">
        <img :src="QrCodeImg" />
        <div class="t-margin-top-5">车牌号：{{plateNum}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { PLATE_TYPES } from '../../../utils/settingConfig'
export default {
  name: 'SupplierPersonal',
  props: {
    show: Boolean
  },
  data() {
    return {
      showNotice: false,
      userInfo: {},
      plateNumList: [], // 车牌信息数组
      plateNum: '', // 车牌号码
      QrCodeImg: '', // 二维码图片地址
      KEY_FOR_PLSTE_COLOR: PLATE_TYPES.reduce((acc, cur) => {
        acc[cur.value] = cur.label
        return acc
      }, {})
    }
  },
  computed: {
    menuSettings() {
      return this.$store.getters.menuSettings
    }
  },
  watch: {
    show: (n) => {
      if (n) {
        console.log('个人中心--调用初始化接口')
      }
    }
  },
  onLoad(option) {
    console.log('登录信息', this.$store.getters.userInfo)
    // this.getDriverInfo()
  },
  // 每次进入首页重新调用
  onShow() {
    // this.show && this.getDriverInfo()
  },
  methods: {
    // 获取用户信息
    async getDriverInfo() {
      const res = await this.$http('getDriverInfo')
      console.log('获取用户信息', res)
      if (res.success) {
        this.userInfo = res.data
        this.plateNumList = res.data.rows
      }
    },
    // 查看二维码
    QrCode({ filePath, plateNum }) {
      this.showNotice = true
      this.QrCodeImg = filePath
      this.plateNum = plateNum
    },
    // 关闭二维码弹窗
    popClose() {
      this.showNotice = false
    },
    // 新增车辆信息
    addCar() {
      this.$openWin(`/pages/addCarInfo/main`)
    },
    // 修改手机号或身份证
    edit(type) {
      this.$openWin(`/pages/editDreverInfo/main?type=${type}`)
    },
    // 删除车辆
    deleteTruck(truckCode) {
      console.log('删除车辆', truckCode)
      wx.showModal({
        title: '提示',
        content: '您确认要删除此车辆信息吗？',
        success: async (res) => {
          if (res.confirm) {
            const res = await this.$http('deleteTruck', { truckCode })
            if (res.success) {
              this.getDriverInfo()
              this.$toast('成功删除此车辆信息')
            }
          }
        }
      })
    },
    // 点击解除绑定按钮
    remove() {
      wx.showModal({
        title: '退出登录',
        content: '应用将回到注册页面',
        success: async (res) => {
          if (res.confirm) {
            const res = await this.$http('removeBind')
            console.log('解除绑定', res)
            if (res.success) {
              this.$store.commit('user/SET_TOKEN', '')
              this.$store.commit('user/SET_OPEN_ID', '')
              this.$store.commit('user/SET_UNION_ID', '')
              this.$store.commit('user/SET_MP_BINDING', '')
              this.$store.commit('user/SET_USER_TYPE', '')
              this.$store.commit('user/SET_MINI_BINDING', '')
              this.$store.commit('user/SET_USER_INFO', {})
              this.$store.commit('user/SET_SUBSCRIBE_DATA', {})
              // 关闭websocket
              // wx.closeSocket()
              wx.reLaunch({ url: `/pages/auth/main` })
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.personal-center {
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  .header {
    padding: 0 32rpx 32rpx;
    background-color: #355db4;
    color: #fff;
    .name {
      margin-bottom: 20rpx;
      min-height: 64rpx;
      font-size: 44rpx;
      line-height: 64rpx;
      font-weight: 500;
    }
    .item_wrap {
      margin-top: 16rpx;
      font-size: 14px;
      .label {
        flex-shrink: 0;
        color: #b9c7e4;
      }
      .edit_icon {
        padding: 0 24rpx;
        font-size: 20px;
      }
    }
  }
  .customer_wrap {
    padding-top: 24rpx;
    font-size: 16px;
    .title_wrap {
      padding: 0 32rpx;
      height: 88rpx;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0;
      color: #181818;
      font-weight: 500;
      .add {
        color: #355db4;
        font-weight: 400;
        .icon {
          margin-right: 12rpx;
          padding: 20rpx 0;
          font-size: 18px;
        }
      }
    }
    .list_wrap {
      background-color: #fff;
      .no_data_img {
        margin: 32rpx auto;
        color: #969799;
        font-size: 14px;
        img {
          margin-bottom: 16rpx;
          width: 180rpx;
          height: 200rpx;
        }
      }
      .car_item {
        padding: 0 32rpx;
        height: 88rpx;
        border-bottom: 1px solid #f0f0f0;
        color: #181818;
        .plate_color_0,
        .plate_color_1,
        .plate_color_2 {
          width: 28rpx;
          height: 28rpx;
          border-radius: 4rpx;
        }
        .plate_color_0 {
          background-color: $plate_color_yellow;
        }
        .plate_color_1 {
          background-color: $plate_color_blue;
        }
        .plate_color_2 {
          background-color: $plate_color_green;
        }
        .label,
        .fleet {
          margin: 0 16rpx;
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .icon {
          padding: 20rpx 0 20rpx 20rpx;
          color: #969799;
        }
        .qr {
          margin-right: 20rpx;
        }
      }
    }
  }
  .logout {
    margin: 32rpx;
  }
  .notice-popup {
    .van-popup {
      .van-popup__close-icon--top-right {
        top: 12%;
        font-size: 30px;
      }
    }
    .box {
      height: 100vh;
      width: 100%;
      position: relative;
      img {
        width: 260px;
        height: 260px;
      }
    }
  }
}
</style>
