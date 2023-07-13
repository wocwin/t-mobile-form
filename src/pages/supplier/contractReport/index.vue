<template>
  <div class="contract-report">
    <t-header title="约货上报" />
    <div class="detail">
      <div>
        <div class="detail-label">明天约货总吨数</div>
        <div class="detail-count">{{tomorrowOrder.appointment || 0}}</div>
      </div>
      <div>
        <div class="detail-label">我已上报吨数</div>
        <div class="detail-count">{{tomorrowOrder.reported || 0}}</div>
      </div>
      <div>
        <div class="detail-label">总车数</div>
        <div class="detail-count">{{tomorrowOrder.cars || 0}}</div>
      </div>
    </div>
    <div class="detail-list">
      <van-tabs id="tabs" :active="active" @change="onChange">
        <van-tab title="明天约货详情" name="order">
          <div v-for="(item,index) in orderList" :key="index" class="order-item">
            <div class="order-item__header">
              <div class="order-item__title">{{item.materialName || ''}}</div>
              <div>
                <span class="order-item__label">约货吨数:</span>
                <span class="order-item__count">{{item.appointment || 0}}</span>
              </div>
            </div>
            <div class="order-item__footer">
              <div>
                <span>上报吨数:</span>
                <span>{{item.reported || 0}}</span>
              </div>
              <div>
                <span>车数:</span>
                <span>{{item.cars || 0}}</span>
              </div>
              <div>
                <van-button class="order-item__footer-btn" size="small" type="primary" plain @click="clickReport(item)">上报</van-button>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="上报车辆详情" name="cars">

        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUrlQueryOfObj } from '@/utils'
import supplierApi from '../../../api/supplier'
export default {
  name: 'ContractReport',
  props: {
    show: Boolean,
    dateType: Number
  },
  data() {
    return {
      tomorrowOrder: {},
      active: 'order',
      orderList: []
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.toggleShowTabs()
            this.getDetails()
            this.detailsTomorrowOrder()
          })
        }
      }
    }
  },
  computed: {
  },
  onLoad(option) {
  },
  onShow() {

  },
  methods: {
    clickReport(item) {
      console.log(item)
      wx.navigateTo({
        url: `/pages/subpackages/supplierReport/main?${getUrlQueryOfObj(item)}`
      })
    },
    toggleShowTabs() {
      this.$root.$mp.page.selectComponent('#tabs').resize()
    },
    onChange(event) {
      const name = event.mp.detail.name
      console.log(event.mp.detail.name)
      if (name === 'order') {
        this.getDetails()
      }

      if (name === 'cars') {

      }
    },
    async getDetails () {
      let res
      if (this.dateType === 1) {
        res = await supplierApi('detailsTomorrow')
      } else {
        res = await supplierApi('detailsToday')
      }
      console.log('getDetails', res)
      if (res.success) {
        this.orderList = res.data || []
      }
    },
    async detailsTomorrowOrder() {
      let res
      if (this.dateType === 1) {
        res = await supplierApi('detailsTomorrowOrder')
      } else {
        res = await supplierApi('detailsTodayOrder')
      }
      console.log('res', res)

      if (res.success) {
        this.tomorrowOrder = res.data
      } else {
        this.tomorrowOrder = {}
      }
    }
  }

}
</script>

<style lang="scss">
.contract-report {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  overflow-x: hidden;
  .detail{
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    grid-template-rows: 1fr;
    padding: 12px 17px 8px 17px;
    background: #fff;
    .detail-label{
      color:rgba(150, 151, 153, 1);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
    }
    .detail-count{
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 500;
    }
  }
  .detail-list{
    flex: 1;
    padding-bottom: 10px;
    box-sizing: border-box;
    .order-item{
      padding: 12px 16px;
      margin: 8px;
      background: #fff;
      .order-item__header{
        display: flex;
        justify-content: space-between;
        margin-bottom: 14px;
        .order-item__title{
          color:rgba(0, 0, 0, 1);
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 700;
        }
        .order-item__label{
          color:rgba(150, 151, 153, 1);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
        }
        .order-item__count{
          color:rgba(16, 16, 16, 1);
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .order-item__footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px 8px 12px;
        border-radius: 6px;
        background-color: rgba(247, 248, 250, 1);
        .order-item__footer-btn{
          .van-button{
            color:rgba(32, 114, 237, 1); 
            border-color: rgba(32, 114, 237, 1);
            font-size: 14px;
          }
        }
     }  
    }
  }
}
</style>
