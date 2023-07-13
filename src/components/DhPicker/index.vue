<template>
  <div class="dh-picker" :style="{marginTop:isMarginTop?'20px':''}">
    <div class="select-cell register-input" @click.stop="openSelect">
      <mp-picker ref="mpPicker" v-bind="$attrs" v-on="$listeners" />
      <div class="picker-box flex-box flex-ver-v">
        <div
          class="t-font-size-14 picker-view flex-box flex-between flex-ver-v"
          :class="selectLabel?'t-color-dark':'t-color-placeholder'"
        >
          {{selectLabel?selectLabel:placeholder}}
          <van-icon name="arrow-down" style="margin-right:15px;" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MpPicker from './MpPicker'
export default {
  name: 'DhPicker',
  // 组件引入
  components: {
    MpPicker
  },
  data () {
    return {
    }
  },
  props: {
    // 是否距离顶部20px
    isMarginTop: {
      type: Boolean,
      default: false
    },
    // 提示文字
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 下拉选择展示的文字
    selectLabel: {
      type: String,
      default: ''
    }
  },
  methods: {
    openSelect () {
      this.$refs.mpPicker.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.dh-picker {
  .register-input {
    width: 254px;
    height: 36px;
    background: #f8f8f8;
    border-radius: 20px;
    font-size: 28rpx;
    line-height: 80rpx;
    padding-left: 30rpx;
  }
  // .select-cell {
  //   margin-top: 20px;
  // }
}
</style>