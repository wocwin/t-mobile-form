<template>
  <view class="mp-picker">
    <view :class="{'pickerMask':showPicker}" @click.stop="maskClick" catchtouchmove="true"></view>
    <view class="mp-picker-content" :class="{'mp-picker-view-show':showPicker}">
      <view class="mp-picker__hd" catchtouchmove="true">
        <view class="mp-picker__action" @click.stop="pickerCancel">{{cancelTxt}}</view>
        <view
          class="mp-picker__action"
          :style="{color:confirmColor}"
          @click.stop="pickerConfirm"
        >{{confirmTxt}}</view>
      </view>
      <!-- 单列 -->
      <picker-view
        indicator-style="height: 50px;"
        class="mp-picker-view"
        :value="pickerValue"
        @change.stop="pickerChange"
        v-if="pickerValueSingleArray.length > 0"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item,index) in pickerValueSingleArray"
              :key="index"
            >{{item[pickerLab]}}</view>
          </picker-view-column>
        </block>
      </picker-view>
    </view>
  </view>
</template>

<script>
import variables from '@/static/styles/variables.scss'
export default {
  name: 'MpPicker',
  data () {
    return {
      pickerValue: 0, // 默认选中第一个
      pickerValueSingleArray: this.pickerValueArray, // 常规下拉选择
      /* 是否显示控件 */
      showPicker: false
    }
  },
  props: {
    /* picker 数组 */
    pickerValueArray: {
      type: Array,
      default () {
        return []
      }
    },
    // pickerValueArray value字段
    pickerVal: {
      type: String,
      default: 'value'
    },
    // pickerValueArray label字段
    pickerLab: {
      type: String,
      default: 'label'
    },
    // 确认字体颜色
    confirmColor: {
      type: String,
      default: `${variables.mainTxt}`
    },
    // 确定文案
    confirmTxt: {
      type: String,
      default: '确定'
    },
    // 取消文案
    cancelTxt: {
      type: String,
      default: '取消'
    }
  },
  watch: {
    pickerValueArray: {
      handler (val) {
        // console.log(777, val)
        this.pickerValueSingleArray = val
      }
    }
  },
  methods: {
    // 显示下拉数据
    show () {
      this.showPicker = true
    },
    // 点击蒙层取消
    maskClick () {
      this.pickerCancel()
    },
    // 取消按钮
    pickerCancel () {
      this.showPicker = false
      this.$emit('cancel')
    },
    // 确定按钮
    pickerConfirm () {
      this.showPicker = false
      this.$emit('confirm', this.pickerValueSingleArray[this.pickerValue])
    },
    // 常规选择器
    pickerChange (e) {
      this.pickerValue = e.mp.detail.value
      this.$emit('change', this.pickerValueSingleArray[this.pickerValue])
    }
  }
}
</script>

<style lang="scss">
.mp-picker {
  .pickerMask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .mp-picker-content {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease;
    transform: translateY(100%);
    z-index: 3000;
    opacity: 0;
    .mp-picker__hd {
      display: flex;
      padding: 5rpx 30rpx;
      background-color: #fff;
      position: relative;
      text-align: center;
      font-size: 18px;
      &:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
      }
      .mp-picker__action {
        display: block;
        flex: 1;
        color: #1aad19;
        &:first-child {
          text-align: left;
          color: #888;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
    .mp-picker-view {
      position: relative;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 238px;
      background-color: rgba(255, 255, 255, 1);
      .picker-item {
        text-align: center;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }
  .mp-picker-view-show {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
