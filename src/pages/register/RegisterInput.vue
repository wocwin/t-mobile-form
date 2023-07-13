<template>
  <div
    class="register_input flex-box flex-ver-v"
    :style="{width:width||'100%'}"
    :class="{ error: status === 0 }"
  >
    <input
      class="input_dom flex-grow"
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :value="value"
      :password="isShowPassword"
      @input="change"
      @focus="focus = true"
      @blur="onBlur"
    />
    <p v-if="status === 0 && !focus" class="error">{{ errMsg }}</p>
    <van-icon v-if="value && focus" class="clear_icon" name="clear" @click="clear" />
    <van-icon
      v-if="isPassword?((value && focus) || isShowPassword):isShowPassword"
      class="clear_icon icon_eye"
      :name="isShowPassword?'eye':'closed-eye'"
      @click="showPassword"
    />
  </div>
</template>
<script>
export default {
  name: 'RegisterInput',
  props: {
    placeholder: String,
    value: String,
    type: {
      type: String,
      default: 'text'
    },
    isPassword: {
      type: Boolean,
      default: false
    },
    width: String,
    maxlength: {
      type: Number,
      default: 140
    }
  },
  data() {
    return {
      isShowPassword: this.isPassword,
      status: 1, // 1 正常 0 校验错误
      focus: false,
      errMsg: ''
    }
  },
  methods: {
    change(e) {
      this.status = 1
      const { type } = this
      if (type === 'number') {
        const d = e.target.value.replace(/[^\d]/g, '')
        this.$emit('input', d ? Number(d) : undefined)
      } else {
        this.$emit('input', e.target.value)
      }
    },
    clear() {
      this.$emit('input', '')
    },
    // 是否显示密码
    showPassword() {
      this.isShowPassword = !this.isShowPassword
    },
    onBlur() {
      setTimeout(() => {
        this.focus = false
      }, 500)
    },
    setError(error) {
      this.status = 0
      this.errMsg = error.message
    }
  }
}
</script>
<style lang="scss">
.register_input {
  margin-bottom: 32rpx;
  width: 100%;
  height: 88rpx;
  background-color: #f2f2f2;
  border-radius: 8rpx;
  font-size: 14px;
  color: #181818;
  box-sizing: border-box;
  &.error {
    box-shadow: 0 0 0rpx 1rpx #ee0a24;
  }
  .input_dom {
    padding: 0 32rpx;
    line-height: 88rpx;
  }
  .error {
    margin-right: 20rpx;
    color: #ee0a24;
    white-space: nowrap;
  }
  .clear_icon {
    padding: 20rpx 20rpx 20rpx 0;
    color: #969799;
    font-size: 36rpx;
  }
}
</style>