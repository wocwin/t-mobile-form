<template>
  <div class="no-data flex-box flex-ver-h flex-col" v-if="listParam.length<1">
    <img src="../../static/images/weberror.png" style="width:100%;" v-if="imgVisible" />
    <div
      class="t-padding10 block page-loading t-textAlign-center t-color-shadow t-font-size-14"
    >{{ msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    listParam: { // 传入数据数组对象
      type: [Array, Object],
      default: () => []
    },
    imgVisible: {
      type: Boolean,
      default: false
    },
    // 是否显示文案
    noMore: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: 1
    }
  },
  computed: {
    msg () {
      switch (this.status) {
        case -1:
          return '加载错误'
        case 0:
          return '没有更多了...'
        case 1:
          return '上拉加载更多'
        case 2:
          return '加载中...'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.no-data {
  width: 100%;
  // height: 100%;
  // background-color: #f9f9f9;
}
</style>
