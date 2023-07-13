<template>
  <div class="register">
    <t-header title="注册" background="#355db4" color="#fff"></t-header>
    <div class="top-area flex-box flex-col flex-ver">
      <t-icon src="/static/images/icon/login_logo.svg" size="620" />
      <div class="button-area">
        <van-button
          block
          type="primary"
          @click="toLogin('driverRegister')"
          style="margin-top: 16rpx;"
        >司机注册</van-button>
        <van-button
          block
          type="primary"
          @click="toLogin('supplierRegister')"
          style="margin-top: 16rpx;"
        >供应点注册</van-button>
        <van-button
          color="#355db4"
          plain
          @click="toLogin('supplierLogin')"
          style="margin-top: 16rpx;"
        >供应点登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import supplierApi from '../../api/supplier'
import { mapGetters } from 'vuex'
import { getUrlQueryOfObj } from '@/utils'
export default {
  name: 'register',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    async toLogin(type) {
      if (type === 'supplierRegister') {
        console.log('注册进度')
        if (this.token) {
          const res = await supplierApi('registerProgress')
          console.log('res', res)
        } else {
          this.$openWin(`/pages/register/supplierRegister/main?type=add`)
        }
        return
      }
      const query = this.$mp.query
      this.$openWin(`/pages/register/${type}/main?${getUrlQueryOfObj(query)}`)
    }
  }
}
</script>
<style lang="scss">
.register {
  height: 100vh;
  overflow: hidden;
  .top-area {
    height: 100%;
    .button-area {
      display: grid;
      flex-grow: 1;
      align-content: flex-start;
      margin-top: 70px;
      padding-bottom: 40px;
      width: 600rpx;
      ._van-button {
        .van-button--plain {
          width: 100%;
        }
      }
    }
  }
}
</style>
