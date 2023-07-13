<template>
  <div class="dh-search" :style="dhSearchStyle">
    <input
      :disabled="disabled || inputDisabled"
      v-model.trim="pickerValue"
      :placeholder="placeholder"
      class="picker-item-input"
      :class="pickerValue?'t-color-dark':'t-color-placeholder'"
      @input.stop="bindkeyinput"
    />
    <picker
      :disabled="disabled"
      class="picker-box flex-box flex-ver-v"
      @change.stop="bindchange"
      :value="index"
      :range-key="pickerLab"
      :range="dropDownData"
    >
      <van-icon class="picker-icon t-color-placeholder" name="arrow-down" />
    </picker>
  </div>
</template>
<script>
import MpPicker from '../DhPicker/MpPicker'
export default {
  name: 'dhSearch',
  // 组件引入
  components: {
    MpPicker
  },
  props: {
    disabled: Boolean, // 整个组件禁用状态
    inputDisabled: Boolean, // 输入组件禁用状态
    // 下拉框数据来源
    list: {
      type: Array,
      default () {
        return []
      }
    },
    // 组件宽度
    width: {
      type: String,
      default: '392rpx'
    },
    // 组件高度
    height: {
      type: String,
      default: '72rpx'
    },
    // 提示语
    placeholder: {
      type: String
    },
    // 下拉选择展示的文字
    selectLabel: {
      type: String
    },
    // list value字段
    pickerVal: {
      type: String,
      default: 'driverCode'
    },
    // list label字段
    pickerLab: {
      type: String,
      default: 'plateNum'
    }
  },
  data () {
    return {
      // 输入框值
      pickerValue: this.selectLabel,
      // 下拉框下标
      index: 0,
      // 下拉框数据
      dropDownData: this.list
    }
  },
  computed: {
    dhSearchStyle () {
      return `width:${this.width};height:${this.height}`
    }
  },
  watch: {
    list: {
      handler (val) {
        this.dropDownData = val
      }
    },
    selectLabel: {
      handler (val) {
        this.pickerValue = val
      }
    }
  },
  methods: {
    // 文本框输入事件
    bindkeyinput (event) {
      console.log('文本框输入事件', event)
      const value = event.mp.detail.value
      const list = JSON.parse(JSON.stringify(this.list))
      const array = list.filter(item => item[this.pickerLab].indexOf(value) !== -1).map(item => {
        const result = JSON.parse(JSON.stringify(item))
        return result
      })
      this.dropDownData = array
    },
    // 下拉框选择事件
    bindchange (event) {
      const idx = event.mp.detail.value
      // const val = this.dropDownData[idx][this.pickerVal]
      this.index = idx
      // this.dropDownData = this.list
      this.pickerValue = this.dropDownData[idx][this.pickerLab]
      // console.log('下拉框选择事件', event, this.dropDownData)
      this.$emit('action', { index: idx, list: this.dropDownData })
    }
  }
}
</script>
<style lang="scss">
.dh-search {
  margin-left: 30rpx;
  background: #f8f8f8;
  border-radius: 40rpx;
  font-size: 14px;
  line-height: 80rpx;
  padding-left: 20rpx;
  display: flex;
  .picker-item-input {
    margin-left: 10rpx;
    width: 80%;
    height: 100%;
    line-height: 60rpx;
    font-size: 14px;
  }
  .picker-box {
    width: 30%;
    height: 100%;
    justify-content: flex-end;
    .picker-icon {
      margin-right: 35px;
      width: 100%;
      height: 72rpx;
    }
  }
}
</style>
