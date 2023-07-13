<template>
  <div class="supplier-audit">
    <t-header title="供货点注册审批结果" :isGoBack="true" :isGoBackEvent="true" background="#355db4" color="#fff"></t-header>
    <div class="detail">
      <div v-if="query.status==='0'" class="detail__content">
        <img class="content__img" src="../../../static/images/review.png" alt="">
        <div class="content__text">审核中</div>
        <div class="content__tip">正在审核，请耐心等待，或刷新一下</div>
        <van-button class="content__button" type="primary" block :loading="loading" @click="clickRefresh">刷新</van-button>
      </div>
      <div v-if="query.status==='-1'" class="detail__content">
        <img class="content__img" src="../../../static/images/fail_audit.png" alt="">
        <div class="content__text" style="color:red;">不通过</div>
        <div class="content__message">
          <span>不通过原因:</span>
          <span style="color:#181818;">{{query.remark || '暂无'}}</span>
        </div>
        <!-- <van-button class="content__button" type="primary" block :loading="loading" @click="clickEdit">返回修改</van-button> -->
      </div>
      <div class="detail__footer">
        <div>审批人电话：</div>
      </div>
    </div>
  </div>
</template>

<script>
import supplierApi from '../../../api/supplier'
export default {
  props: {},
  data () {
    return {
      query: {},
      loading: false
    }
  },
  mounted () {

  },
  onLoad(options) {
    if (options.remark && options.remark === 'null') {
      options.remark = ''
    }
    this.query = {...options}
    console.log(this.query.remark === 'null')
    console.log('options', options)
  },
  methods: {
    async clickEdit() {
      wx.navigateTo({
        url: `/pages/register/supplierRegister/main?type=edit`
      })
    },
    async  clickRefresh() {
      try {
        this.loading = true
        const res = await supplierApi('registerProgress')
        console.log('res', res)
        if (res.success) {
          if (res.data.status === '0') {
            wx.showToast({
              title: '审核中',
              icon: 'none'
            })
          }
          if (res.data.status === '-1') {
            this.query.status = '-1'
          }
          if (['1', '2'].includes(res.data.status)) {
            wx.showToast({
              title: '审核已通过',
              icon: 'none'
            })
            wx.reLaunch({
              url: `/pages/auth/main`
            })
          }
          this.loading = false
        } else {
          this.loading = false
        }
      } catch (error) {
        this.loading = false
      }
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
.supplier-audit{
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f2f2f2;
  overflow: hidden;
  .detail{
    flex: 1;
    background: #fff;
    margin: 10px;
    box-sizing: border-box;
    overflow: hidden;
    .detail__content{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 60%;
      box-sizing: border-box;
      overflow: hidden;
      .content__img{
        width: 100px;
        height: 100px;
        margin-top: 100px;
      }
      .content__text{
        margin-top:10px;
        font-size: 20px;
        font-weight:400;
      }
      .content__tip{
        margin-top:10px;
        font-size: 14px;
        font-weight:400;
        color: #969799;
      }
      .content__message{
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin-top:10px;
        font-size: 14px;
        font-weight:400;
        color: #969799;
      }
      .content__button{
        width: 90%;
        margin-top: 20px;
        border-radius: 6px;
      }
    }
    .detail__footer{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40%;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
</style>