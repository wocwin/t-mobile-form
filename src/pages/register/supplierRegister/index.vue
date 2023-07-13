<template>
  <div class="steel_supplier_login">
    <t-header
      title="供应点注册"
      :isGoBack="true"
      :isGoBackEvent="true"
      background="#355db4"
      color="#fff"
    ></t-header>
    <steel-supplier-register />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import RegisterForm from '../RegisterForm.vue'
import RegisterInput from '../RegisterInput.vue'
import { getUrlQueryOfObj } from '@/utils'
import SteelSupplierRegister from './steelSupplierRegister.vue'
export default {
  name: 'SteelSupplierLogin',
  components: {
    RegisterForm,
    RegisterInput,
    SteelSupplierRegister
  },
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: (value, callback) => {
          if (value === '') {
            callback(new Error('请输入用户名'))
          } else if (value.match(/[^(A-Z0-9)]/g)) {
            callback(new Error('请输入大写字母或数字'))
          }
        },
        password: (value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'))
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId',
      'menuSettings'
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
    login() {
      this.validation(async (valid, form) => {
        if (!valid) {
          const res = await this.$http('supplierSecondLogin', {
            ...form,
            openId: this.openId,
            unionId: this.unionId
          })
          console.log('废钢供应商登录', res)
          if (res.success) {
            this.setToken(res.data)
            this.$store.dispatch('user/getUserInfo')
            const query = this.$mp.query
            this.$reLaunch(`/pages/auth/main?${getUrlQueryOfObj(query)}`)
          } else {
            this.$toast(res.data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.steel_supplier_login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background: #f2f2f2;
}
</style>