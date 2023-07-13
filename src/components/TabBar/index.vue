<template>
  <section class="tabBar-wrap">
    <article class="tabBar-box">
      <ul class="tabBar-nav" v-if="navList.length > 0">
        <li class="item" v-for="(item, index) in navList" @click="selectNavItem(index, item.pagePath)" :key="index">
          <p class="item-images">
            <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" alt="iconPath" />
          </p>
          <p class="t-margin-top-3" :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text'">
            {{ item.text }}</p>
        </li>
      </ul>
    </article>
  </section>
  <!-- <van-tabbar :active="active" @change="onTabbarChange" active-color="#355DB4">
    <van-tabbar-item v-for="(item, index) in navList" :key="index" :name="item.name" :info="item.info || null">
      <img slot="icon" mode="aspectFit" :src="item.iconPath" style="width: 30px; height: 18px;" />
      <img slot="icon-active" mode="aspectFit" :src="item.selectedIconPath" style="width: 30px; height: 18px;" />
      {{ item.text }}
    </van-tabbar-item>
  </van-tabbar> -->
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TabBar',
  props: {
    // 是需要高亮的下标
    selectNavIndex: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      active: ''
    }
  },
  computed: {
    ...mapGetters([
      'userType' // 当前登录用户 0-司机 1-供应商
    ]),
    navList() {
      return {
        'EXTERNAL_DRIVER': [
          {
            name: 'driverIndex',
            text: '首页',
            pagePath: '/pages/driver/driverIndex/main',
            iconPath: '../../static/tabs/home.png',
            selectedIconPath: '../../static/tabs/home-active.png'
          },
          {
            name: 'freightReport',
            text: '货运上报',
            pagePath: '/pages/driver/freightReport/main',
            iconPath: '../../static/tabs/contract-report.png',
            selectedIconPath: '../../static/tabs/contract-report-active.png'
          },
          {
            name: 'unloadingQueue',
            text: '卸货排队',
            pagePath: '/pages/driver/unloadingQueue/main',
            iconPath: '../../static/tabs/lineup.png',
            selectedIconPath: '../../static/tabs/lineup-active.png'
          },
          {
            name: 'personalCenter',
            text: '个人中心',
            pagePath: '/pages/driver/personalCenter/main',
            iconPath: '../../static/tabs/personal.png',
            selectedIconPath: '../../static/tabs/personal-active.png'
          }
        ],
        'EXTERNAL_SUP': [
          {
            name: 'supplierHome',
            text: '首页',
            pagePath: '/pages/supplier/supplierHome/main',
            iconPath: '/static/tabs/home.png',
            selectedIconPath: '/static/tabs/home-active.png'
          },
          {
            name: 'contractReport',
            text: '约货上报',
            pagePath: '/pages/supplier/contractReport/main',
            iconPath: '/static/tabs/contract-report.png',
            selectedIconPath: '/static/tabs/contract-report-active.png'
          },
          {
            name: 'todayTask',
            text: '今天任务',
            pagePath: '/pages/supplier/todayTask/main',
            iconPath: '/static/tabs/today-task.png',
            selectedIconPath: '/static/tabs/today-task-active.png'
          },
          {
            name: 'supplierPersonal',
            text: '个人中心',
            pagePath: '/pages/supplier/supplierPersonal/main',
            iconPath: '/static/tabs/personal.png',
            selectedIconPath: '/static/tabs/personal-active.png'
          }
        ]
      }[this.userType]
    }
  },
  onLoad(options) {
    this.active = options.active || this.navList[0].name
  },
  onShow() {
    const currentPageQuery = this.$getCurrentPageQuery()
    this.active = currentPageQuery.active || this.active || this.navList[0].name
  },
  methods: {
    onTabbarChange(e) {
      console.log('999', e.mp)
      this.active = e.mp.detail
    },
    /**
     * 点击导航栏
     * @param index
     */
    selectNavItem(index, pagePath) {
      // console.log(1212, pagePath, index, this.selectNavIndex)
      if (index === this.selectNavIndex) {
        return false
      }
      this.bindViewTap(pagePath)
    },

    /**
     * 路由跳转
     */
    bindNavigateTo(url) {
      wx.navigateTo({
        url
      })
    },

    /**
     * tabBar路由跳转
     */
    bindViewTap(url) {
      // wx.switchTab({
      wx.reLaunch({
        url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabBar-wrap {
  .tabBar-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    // padding: 10px 0;
    border-top: 1px solid #eee;
    background-color: #f8f8f8;

    .tabBar-nav {
      width: 100%;
      display: flex;

      .item {
        flex: 1;
        text-align: center;
      }

      .item-text {
        color: #666f83;
        font-size: 12px;
        transition: 0.24s linear;
      }

      .item-text-active {
        color: #355db4;
      }

      .item-images {
        width: 24px;
        height: 24px;
        margin: 0 auto;
        text-align: center;
        transition: 0.24s linear;

        img {
          display: inline;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
