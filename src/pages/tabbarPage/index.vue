<template>
  <div class="tabbar_page flex-box flex-col">
    <!-- 司机 -->
    <div class="page_wrap" v-if="userType === 'EXTERNAL_DRIVER'" v-show="active === 'driverIndex'">
      <driver-index ref="driverIndex" :show="active === 'driverIndex'" />
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_DRIVER'" v-show="active === 'freightReport'">
      <freight-report ref="freightReport" :show="active === 'freightReport'" />
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_DRIVER'" v-show="active === 'unloadingQueue'">
      <unloading-queue ref="unloadingQueue" :show="active === 'unloadingQueue'" />
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_DRIVER'" v-show="active === 'personalCenter'">
      <personal-center ref="personalCenter" :show="active === 'personalCenter'" />
    </div>
    <!-- 供应点 -->
    <div class="page_wrap" v-if="userType === 'EXTERNAL_SUP'" v-show="active === 'supplierHome'">
      <supplier-home ref="supplierHome" :show="active === 'supplierHome'" />
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_SUP'" v-show="active === 'contractReport'">
      <contract-report ref="contractReport" :show="active === 'contractReport'" :dateType="1" />
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_SUP'" v-show="active === 'todayTask'">
      <contract-report ref="contractReport" :show="active === 'todayTask'" :dateType="0" />
      <!-- <today-task ref="todayTask" :show="active === 'todayTask'" /> -->
    </div>
    <div class="page_wrap" v-if="userType === 'EXTERNAL_SUP'" v-show="active === 'supplierPersonal'">
      <supplier-personal ref="supplierPersonal" :show="active === 'supplierPersonal'" />
    </div>
    <!-- <van-tabbar :active="active" @change="onTabbarChange" active-color="#355DB4">
      <van-tabbar-item v-for="(item, index) in tabbarOption" :key="index" :name="item.name" :info="item.info || null">
        <img slot="icon" mode="aspectFit" :src="item.iconPath" style="width: 30px; height: 18px;" />
        <img slot="icon-active" mode="aspectFit" :src="item.selectedIconPath" style="width: 30px; height: 18px;" />
        {{ item.text }}
      </van-tabbar-item>
    </van-tabbar> -->
    <!-- <tab-bar /> -->
    <section class="tabBar-wrap" v-if="tabbarOption.length > 0">
      <article class="tabBar-box">
        <ul class="tabBar-nav">
          <li class="item" v-for="(item, index) in tabbarOption" @click="selectNavItem(item)" :key="index">
            <p class="item-images">
              <img :src="active === item.name ? item.selectedIconPath : item.iconPath" alt="iconPath" />
            </p>
            <p class="t-margin-top-3" :class="active === item.name ? 'item-text item-text-active' : 'item-text'">
              {{ item.text }}</p>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>
<script>
// 司机
import driverIndex from '@/pages/driver/home/index.vue'
import freightReport from '@/pages/driver/freightReport/index.vue'
import unloadingQueue from '@/pages/driver/unloadingQueue/index.vue'
import personalCenter from '@/pages/driver/personalCenter/index.vue'
// 供应点
import supplierHome from '@/pages/supplier/supplierHome/index.vue'
import contractReport from '@/pages/supplier/contractReport/index.vue'
import todayTask from '@/pages/supplier/todayTask/index.vue'
import supplierPersonal from '@/pages/supplier/supplierPersonal/index.vue'

import { mapGetters } from 'vuex'
export default {
  name: 'TabbarPage',
  components: {
    driverIndex,
    freightReport,
    unloadingQueue,
    personalCenter,
    supplierHome,
    contractReport,
    todayTask,
    supplierPersonal
  },
  data() {
    return {
      active: ''
    }
  },
  computed: {
    ...mapGetters([
      'userType' // 当前登录用户 EXTERNAL_DRIVER-司机 EXTERNAL_SUP-供应商
    ]),
    tabbarOption() {
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
            iconPath: '../../static/tabs/home.png',
            selectedIconPath: '../../static/tabs/home-active.png'
          },
          {
            name: 'contractReport',
            text: '约货上报',
            pagePath: '/pages/supplier/contractReport/main',
            iconPath: '../../static/tabs/contract-report.png',
            selectedIconPath: '../../static/tabs/contract-report-active.png'
          },
          {
            name: 'todayTask',
            text: '今天任务',
            pagePath: '/pages/supplier/todayTask/main',
            iconPath: '../../static/tabs/today-task.png',
            selectedIconPath: '../../static/tabs/today-task-active.png'
          },
          {
            name: 'supplierPersonal',
            text: '个人中心',
            pagePath: '/pages/supplier/supplierPersonal/main',
            iconPath: '../../static/tabs/personal.png',
            selectedIconPath: '../../static/tabs/personal-active.png'
          }
        ]
      }[this.userType]
    }
  },
  onLoad(options) {
    this.active = options.active || this.tabbarOption[0].name
    // console.log('onload--', this.active)
  },
  onShow() {
    const currentPageQuery = this.$getCurrentPageQuery()
    this.active = currentPageQuery.active || this.active || this.tabbarOption[0].name
    // console.log('onShow--', this.active)
  },
  methods: {
    selectNavItem({ name }) {
      this.active = name
    },
    onTabbarChange(e) {
      this.active = e.mp.detail
    }
  }
}
</script>
<style lang="scss">
.tabbar_page {
  height: 100%;

  .page_wrap {
    height: calc(100% - 55px);
    // height: 100%;

    &.hidden {
      display: none;
    }
  }

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
}
</style>
