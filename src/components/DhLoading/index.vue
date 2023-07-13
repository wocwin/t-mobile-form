<template>
  <div class="loading flex-box flex-ver" v-if="loading">
    <div class="content-loading">
      <van-loading type="spinner" :color="color" :size="size" />
      <div class="loading-title t-font-size-14 t-margin-top-5" :style="txtColor">{{loadingTitle}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DhLoading',
  props: {
    loading: { // 是否显示loading
      type: Boolean,
      default: true
    },
    color: { // loading颜色 16进制
      type: String,
      default: '#fff'
    },
    loadingTitle: { // loading颜色 16进制
      type: String,
      default: '加载中'
    },
    size: { // loading大小
      type: String,
      default: '30px'
    }
  },
  computed: {
    txtColor () {
      return `color:${this.color};`
    }
  }
}
</script>
<style lang='scss' scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
  z-index: 999;
  .content-loading {
    width: 120px;
    height: 118px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    margin: 0;
  }
}
</style>
