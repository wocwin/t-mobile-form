<template>
  <div class="review_progress">
    <t-header title="审批结果" background="#355db4" color="#fff"></t-header>
    <div class="content_wrap">
      <div v-if="userInfo.approveStatus === 0" class="result flex-box flex-col flex-ver">
        <img class="img" src="./images/approve.png" />
        <span class="label">审批中</span>
        <span class="value">请耐心等待，或刷新一下</span>
        <van-button
          block
          class="btn"
          type="primary"
          @click="refresh"
          :loading="loading"
          loading-text="刷新中..."
        >刷新</van-button>
      </div>
      <div v-else class="result flex-box flex-col flex-ver">
        <img class="img" src="./images/approveReject.png" />
        <span class="label">审批驳回</span>
        <span class="value">驳回原因：{{ approveResult || '暂无' }}</span>
        <van-button
          block
          class="btn"
          type="primary"
          @click="reRegister"
          :loading="loading"
          loading-text="请稍后..."
        >重新注册</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ReviewProgress',
  data() {
    return {
      loading: false,
      approveResult: ''
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId',
      'userInfo'
    ])
  },
  onLoad(option) {
    if (this.userInfo.approveStatus === 2) {
      this.getSupplierByOpenId()
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.$store.dispatch('user/getUserInfo')
      if (this.userInfo.approveStatus === 1) { // 通过
        this.$reLaunch('/pages/auth/main')
      } else if (this.userInfo.approveStatus === 2) { // 驳回
        this.getSupplierByOpenId()
      }
      this.loading = false
    },
    async getSupplierByOpenId() {
      const res = await this.$http('supplierSecondList', {
        openId: this.openId,
        names: this.userInfo.userName,
        telephones: this.userInfo.phonenumber,
        pageNum: 1,
        pageSize: 1
      })
      if (res.success && res.data.rows.length === 1) {
        const row = res.data.rows[0]
        this.approveResult = row.approveResult
      }
    },
    async reRegister() {
      this.loading = true
      const res = await this.$http('supplierSecondLoginOut')
      this.loading = false
      if (res.success) {
        this.$reLaunch('/pages/register/main?registerType=2')
      }
    }
  }
}
</script>
<style lang="scss">
.review_progress {
  display: flex;
  flex-direction: column;
  height: 100%;
  .place-holder {
    flex-shrink: 0;
  }
  .content_wrap {
    padding: 32rpx;
    height: 100%;
    background-color: #f2f2f2;
    .result {
      padding: 32rpx;
      background-color: #fff;
      border-radius: 8rpx;
      .img {
        width: 200rpx;
        height: 200rpx;
      }
      .label {
        font-size: 40rpx;
      }
      .value {
        margin-top: 4rpx;
        color: #969799;
        font-size: 24rpx;
      }
      .btn {
        margin-top: 36rpx;
        width: 100%;
      }
    }
  }
}
</style>