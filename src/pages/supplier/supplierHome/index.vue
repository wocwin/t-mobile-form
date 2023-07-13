<template>
  <div class="home-page">
    <t-header title="供应点首页" />
    <scroll-view scroll-y class="driver-content">
      <div class="banner">
        <img src="../../../static/images/driver-banner.jpg" alt />
      </div>
      <div class="sudoku flex-box">
        <div
          class="sudoku-item self-help2 flex-box flex-ver flex-col"
          @click.stop="toPage('autoQueue3')"
        >
          <div class="icon-wrap flex-box flex-ver">
            <img style="width: 100%;height: 100%;" src="/static/images/icon/report_tom.svg" />
          </div>
          <div class="txt">明天上报</div>
        </div>
      </div>
      <div class="content flex-box">
        <div class="left flex-box flex-ver flex-col">
          <div class="text">明天约货吨数</div>
          <div class="num t-margin-top-6">{{taskCountObj.appointment || 0}}</div>
        </div>
        <div class="right flex-box flex-ver flex-col">
          <div class="text">已报明天吨数</div>
          <div class="num t-margin-top-6">{{taskCountObj.reported || 0}}</div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import supplierApi from '../../../api/supplier'
import { mapGetters } from 'vuex'
export default {
  name: 'supplierIndex',
  props: {
    show: Boolean
  },
  data() {
    return {
      taskCountObj: {},
      truckDistanceList: [],
      phone: 19912372950
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  watch: {
    show: {
      handler(val) {
        console.log('val', val)
        if (val) {
          this.taskCount()
        }
      }
    }
    // show: (n) => {
    //   if (n) {
    //     console.log('首页--调用初始化接口')
    //     this.taskCount()
    //   }
    // }
  },
  onLoad(option) {
    // Object.assign(this.$data, this.$options.data())
    console.log('首页', option, this.$store.getters)
    this.taskCount()
  },
  onShow() {
    console.log('onshow')
    this.getToken()
  },
  methods: {
    // 获取任务数量
    async taskCount() {
      const res = await supplierApi('supplierCount')
      console.log('获取任务数量', res)
      if (res.success) {
        this.taskCountObj = res.data
        // this.truckDistanceList = res.data.truckDistance
      }
    },
    // 自助排队
    autoQueue() {
      this.$openWin(`/pages/autoQueue/main`)
    },
    autoQueue2() {
      this.$openWin(`/pages/autoQueue2/main`)
    },
    toPage(type) {
      switch (type) {
        case 'autoQueue':
          this.$openWin(`/pages/autoQueue/main`)
          break
        default:
          break
      }
    },
    // 判断是否有token
    getToken() {
      if (!this.token) {
        this.$redirectTo('/pages/auth/main')
      }
    },
    makePhoneCall() {
      wx.makePhoneCall({ phoneNumber: this.phone.toString() })
    }
  }

}
</script>

<style lang="scss">
.home-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  overflow-x: hidden;
  .phone {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 40px;
    color: $main-txt;
    .icon {
      margin-right: 2px;
    }
  }
  .driver-content {
    height: calc(100% - 88px);
    .banner {
      width: 385px;
      height: 203px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .sudoku {
      .sudoku-item {
        padding-top: 10px;
        width: 25%;
        &.self-help2 {
          .icon-wrap {
            background: #f3883b !important;
          }
        }
        &.epidemic {
          .icon-wrap {
            background: #467ae5 !important;
          }
        }
        .icon-wrap {
          width: 48px;
          height: 48px;
          background: linear-gradient(180deg, #547fdd 0%, #355db4 100%), #c4c4c4;
          border-radius: 10px;
          .icon {
            width: 28px;
            height: 27px;
          }
        }
        .txt {
          width: 70px;
          margin-top: 10px;
          font-size: 14px;
          color: #646566;
          white-space: b;
          text-align: center;
        }
      }
    }
    .content {
      width: auto;
      height: 128px;
      border-radius: 10px;
      background: #fff;
      margin: 10px;
      color: #323232;
      font-size: 18px;
      box-sizing: border-box;
      .left {
        flex: 50%;
        .num {
          color: #f3883b;
          font-weight: bold;
          font-size: 28px;
        }
      }
      .right {
        flex: 50%;
        .num {
          color: #355db4;
          font-weight: bold;
          font-size: 28px;
        }
      }
    }
  }
}
</style>
