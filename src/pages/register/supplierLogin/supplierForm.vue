<template>
  <div class="supplier_form">
    <register-form ref="form" :model="form" :rules="rules">
      <register-input
        placeholder="请输入手机号码"
        :maxlength="11"
        v-model="form.phoneNum"
        prop="phoneNum"
      />
      <register-input placeholder="请输入密码" isPassword v-model="form.password" prop="password" />
      <register-input placeholder="请输入位置" width="50%" v-model="form.position" prop="position" />
    </register-form>
    <van-button block type="primary" @click="registerSteelSupplier">登录</van-button>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import RegisterForm from '../RegisterForm.vue'
import RegisterInput from '../RegisterInput.vue'
import { getUrlQueryOfObj } from '@/utils'
export default {
  name: 'SupplierForm',
  components: {
    RegisterForm,
    RegisterInput
  },
  data() {
    return {
      form: {
        phoneNum: '',
        password: '',
        position: ''
      },
      rules: {
        phoneNum: (value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号码'))
          } else if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error('请输入正确的手机号'))
          }
        },
        password: (value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'))
          } else if (value.match(/[^(\u4e00-\u9fa5)]/g)) {
            callback(new Error('只能输入中文'))
          }
        },
        position: (value, callback) => {
          if (value === '') {
            callback(new Error('请输入位置'))
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId'
    ])
  },
  methods: {
    ...mapMutations({
      setToken: 'user/SET_TOKEN'
    }),
    validation(callback) {
      this.$refs.form.validation((valid) => {
        callback(valid, this.form)
      })
    },
    registerSteelSupplier() {
      this.validation(async (valid, form) => {
        if (!valid) {
          const res = await this.$http('registerSteelSupplier', {
            ...form,
            openId: this.openId,
            unionId: this.unionId
          })
          console.log('废钢供应商注册', res)
          if (res.success) {
            this.setToken(res.data)
            this.$store.dispatch('user/getUserInfo')
            this.registerSuccess()
          } else {
            this.$toast(res.msg)
          }
        }
      })
    },
    registerSuccess() {
      const query = this.$parent.$mp.query
      this.$reLaunch(`/pages/auth/main?${getUrlQueryOfObj(query)}`)
    }
  }
}
</script>
<style lang="scss">
.supplier_form {
  margin-top: 10px;
  width: 600rpx;
}
</style>