<template>
  <div class="navigation-bar flex-box flex-ver-v" @click.stop="full" :style="navigationBarStyle">
    <!-- 是否显示搜索icon -->
    <div v-if="showSearch" :style="searchStyle" class="search-home">
      <van-icon @click.stop="searchShow" v-if="!show" name="search" color="#fff" size="20px" />
      <div class="seach-content" v-if="show">
        <van-search
          :value="accountInput"
          placeholder="请输入搜索关键词"
          use-action-slot
          show-action
          focus
          @change="onChange"
        >
          <view slot="action" @click.stop="onClick">搜索</view>
        </van-search>
      </div>
    </div>
    <!-- 是否显示返回及首页icon -->
    <div v-else class="back-margin-left" :style="searchStyle">
      <!-- 既显示返回又显示返回首页icon -->
      <div v-if="isGoBack && backMain" class="back-home">
        <div
          class="back flex-box flex-ver"
          @click.stop="goBack"
          v-if="isGoBack"
          :style="{height: menuSettings.height + 'px'}"
        >
          <van-icon name="arrow-left" />
        </div>
        <div class="line"></div>
        <div
          class="home flex-box flex-ver"
          @click="goHome"
          v-if="backMain"
          :style="{height: menuSettings.height + 'px'}"
        >
          <van-icon name="wap-home-o" />
        </div>
      </div>
      <!-- 只显示返回上一步icon -->
      <div
        v-else-if="isGoBack"
        class="flex-box flex-ver-v"
        @click.stop="goBack"
        :style="{height: menuSettings.height + 'px'}"
      >
        <van-icon name="arrow-left" color="#fff" size="20px" />
      </div>
      <div v-else class="flex-box flex-ver-v t-height-100-percent">
        <slot name="left" />
      </div>
    </div>
    <!-- title标题 -->
    <div v-if="!show" class="title" :style="titleStyle">{{title}}</div>
    <!-- 右侧胶囊 -->
    <div class="back-margin-right" :style="rightStyle"></div>
    <!-- 蒙层 -->
    <div
      v-if="show"
      :class="[show ?'fullopacity':'']"
      :style="{top: height + 'px'}"
      @click.stop="full"
    ></div>
  </div>
</template>

<script>
import { statusBar, navigationBar, navBarStyle } from '@/utils/systemSetting'
import variables from '@/static/styles/variables.scss'
export default {
  name: 'NavBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    // title字体颜色
    color: {
      type: String,
      default: `${variables.mainWhite}`
    },
    // navBar背景颜色
    background: {
      type: String,
      default: `${variables.mainBg}`
    },
    // 是否显示搜索icon
    showSearch: {
      type: Boolean,
      default: false
    },
    // 是否显示返回首页icon
    backMain: {
      type: Boolean,
      default: false
    },
    // 是否返回上一层
    isGoBack: {
      type: Boolean,
      default: false
    },
    // 返回上一层触发方法
    isGoBackEvent: {
      type: Boolean,
      default: false
    }
  },
  /**
   * 组件的初始数据
   */
  data() {
    return {
      paddingTop: statusBar.android, // 默认为android大部分普通机型高度
      height: navigationBar.default + statusBar.android,
      barStyle: {},
      accountInput: '', // 搜索内容
      marginTop: 0,
      scale: 1,
      show: false,
      showBackIconLength: 1
    }
  },
  computed: {
    menuSettings() {
      return this.$store.state.common.menuSettings
    },
    // navBar样式
    navigationBarStyle() {
      let background = this.background || this.barStyle.background || ''
      return `padding-top:${this.paddingTop}px;height:${this.height}px;background:${background};`
    },
    // 左侧搜索icon或显示返回上一步及显示返回首页样式
    searchStyle() {
      return `min-width:${this.menuSettings.width}px;height: ${this.menuSettings.height}px;transform:scale(${this.scale})`
    },
    // nav标题样式
    titleStyle() {
      let color = this.color || this.barStyle.color
      return `text-align:${this.barStyle.textAlign};color: ${color};font-size:${this.barStyle.fontSize}px;line-height:${this.barStyle.height}px`
    },
    // 右侧胶囊样式
    rightStyle() {
      return `min-width:${this.menuSettings.width}px;height: ${this.menuSettings.height}px;`
    }
  },
  mounted() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    const ratio = systemInfo.screenHeight / systemInfo.screenWidth // 高宽比例
    const isNewModel = ratio >= 2
    const isIPhone = systemInfo.model.indexOf('iPhone') >= 0
    const barHeight = systemInfo.statusBarHeight || (isNewModel ? statusBar.newModel : isIPhone ? statusBar.iPhone : statusBar.android)
    this.paddingTop = barHeight
    this.height = barHeight + navigationBar.default
    let barStyle = { ...navBarStyle }
    barStyle.height = navigationBar.default
    this.barStyle = barStyle
    this.getMenuSettings(1, 3)
    this.scale = 1 - (0.5 / this.menuSettings.height)
    this.marginTop = this.menuSettings.top - systemInfo.statusBarHeight + 4
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // vuex存储menuSettings
    getMenuSettings(current, count) {
      // 获取胶囊信息
      let menuSettings = wx.getMenuButtonBoundingClientRect()
      // console.log('menuSettings', menuSettings)
      if (!menuSettings.height || menuSettings.height === 0) {
        if (current > 3) {
          return
        }
        setTimeout(() => {
          this.getMenuSettings(current + 1, count)
        }, 200)
      } else {
        menuSettings.navBarHeight = this.height
        this.$store.commit('common/SET_MENU_SETTINGS', menuSettings)
      }
    },
    // 点击搜索icon，显示输入框
    searchShow() {
      this.show = true
      this.accountInput = ''
    },
    // 输入的内容赋值
    onChange(e) {
      this.accountInput = e.mp.detail
    },
    // 点击搜索按钮，并将值传出
    onClick() {
      this.$emit('search', this.accountInput)
      setTimeout(() => {
        this.show = false
      }, 500)
    },
    // 隐藏搜索框
    full() {
      // console.log(111, this.menuSettings)
      this.show = false
    },
    // 返回首页
    goHome() {
      this.$reLaunch('/pages/tabbarPage/main')
    },
    // 返回上一层
    goBack() {
      const pages = getCurrentPages()
      this.$emit('goBack')
      console.log('goback')
      if (this.isGoBack && this.isGoBackEvent && pages.length > 1) {
        this.$back()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navigation-bar {
  width: 100vw;
  height: 60px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  z-index: 100;
}
.search-home {
  display: flex;
  align-items: center;
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden;
  .back {
    flex: 1;
  }
}
.back-margin-right {
  margin-right: 10px;
}
.back-home {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  margin-left: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 1px rgb(207, 207, 207);
  overflow: hidden;
  .back {
    flex: 1;
  }
  .home {
    flex: 1;
  }
  .line {
    width: 1px;
    height: 20px;
    background: rgba(0, 0, 0, 0.2);
    transform: scaleX(0.5);
  }
}
.title {
  flex: 1;
  font-size: 16px;
  box-sizing: border-box;
  padding: 0 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.fullopacity {
  position: fixed;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgb(1, 1, 1);
  transition: all 2s;
  opacity: 0.5;
}
</style>
