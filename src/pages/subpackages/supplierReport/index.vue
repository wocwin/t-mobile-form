<template>
  <div class="supplierReport">
    <t-header title="约货上报" />
    <div class="detail">
      <div class="detail-item">
        <span class="detail-label">料型:</span>
        <span class="detail-count" style="font-weight:600;">{{options.materialName || ''}}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">上报吨数:</span>
        <span class="detail-count">{{options.reported || 0}}</span>
      </div>
      <div class="detail-item" style="text-align:end;">
        <span class="detail-label">约货吨数:</span>
        <span class="detail-count">{{options.appointment || 0}}</span>
      </div>
    </div>
    <van-field :value="formData.contractNo" readonly label="合同号" required placeholder="请选择合同号" 
    right-icon="scan" @click="clickChooseContractNo" @clickIcon="scanCode" :error="error.contractNo" />
    <van-field :value="formData.shipFromLocation" readonly label="装货地点" required placeholder="请选择装货地点" 
   @click="chooseShipFromLocation" :error="error.shipFromLocation" />
    <van-field :value="formData.deliveryWeight" readonly type="digit" label="上报吨数" required placeholder="选择车辆司机后，自动计算上报吨数" :error="error.deliveryWeight" :extra-event-params="true" @change="(val)=>onFieldChange(val,'deliveryWeight')">
      <div slot="right-icon">吨</div>
    </van-field>
    <div class="select-cars">
      <div class="select-cars__header">
        <div class="select-cars__label">已选择车辆司机({{cars.length}})</div>
        <div>
          <van-button class="select-cars__btn" size="small" type="primary" plain @click="clickSelectBtn">选择车辆</van-button>
        </div>
      </div>
      <div class="currCars__list">
        <div v-for="(item,index) in cars" :key="index" class="currCars__item">
          <div>
            <div class="currCars__label">{{item.plateNumber}}</div>
            <div class="currCars__desc">载重{{item.loadWeight || 0}}吨</div>
          </div>
          <div>
            <div class="currCars__desc">{{item.driverName}}</div>
            <div class="currCars__desc">{{item.phoneNumber}}</div>
          </div>
          <div :class="['currCars__icon-wrap']" @click="clickDelete(index)">
            <van-icon name="cross" size="14" class="currCars__icon" color="white" />
          </div>
        </div>
      </div>
    </div>
    <div class="supplierReport-footer"> 
      <van-button type="primary" block @click="clickSubmit">提交</van-button>
    </div>
    <van-popup :show="showCars" position="bottom" @close="onCloseCars">
      <div class="contractNo-popup">
        <div class="contractNo-popup__header">
          <div class="contractNo-popup__label">选择车辆</div>
          <div class="contractNo-popup__btn" @click.stop="scanCode">
            <van-button type="primary" size="small" @click.stop="clickSelectCars">确定</van-button>
          </div>
        </div>
        <van-search :value="search" placeholder="请输入车牌号、司机姓名、司机电话"  @search="onSearch" />
          <div class="cars__list">
            <div v-for="(item,index) in carList" :key="index" class="cars__item">
              <div>
                <div class="cars__label">{{item.plateNumber}}</div>
                <div class="cars__desc">载重{{item.loadWeight || 0}}吨</div>
              </div>
              <div>
                <div class="cars__desc">{{item.driverName}}</div>
                <div class="cars__desc">{{item.phoneNumber}}</div>
              </div>
              <div :class="['cars__select-box',{cars__select:item.selected}]" @click="clickBox(item)">
                <van-icon v-if="item.selected" class="cars__icon" name="success" color="white" />
              </div>
            </div>
          </div>
      </div>
    </van-popup>
    <van-popup :show="showLocation" position="bottom" @close="onCloseLocation">
      <div class="contractNo-popup">
        <div class="contractNo-popup__header">
          <div class="contractNo-popup__label">装货地点</div>
          <!-- <div class="contractNo-popup__icon" @click.stop="scanCode">
            <van-icon name="scan" size="25px" />
          </div> -->
        </div>
          <div class="contractNo-popup__list">
            <div v-for="(item,index) in locationList" :key="index" :class="['contractNo-popup__item','popup-flex',{
              'popup-selected':item == selectedLocation
            }]" @click="clickLocation(item)">
              <span>{{item}}</span>
              <van-icon v-if="item == selectedLocation" name="success" />
            </div>
          </div>
          <div class="contractNo-popup__footer">
            <van-button type="primary" block @click="clickLocationConfirm">确定</van-button>
          </div>
      </div>
    </van-popup>
    <van-popup :show="showContractNo" position="bottom" @close="onCloseContractNo">
      <div class="contractNo-popup">
        <div class="contractNo-popup__header">
          <div class="contractNo-popup__label">合同号</div>
          <div class="contractNo-popup__icon" @click.stop="scanCode">
            <van-icon name="scan" size="25px" />
          </div>
        </div>
          <van-field class="contractNo-input" :value="contractNo" placeholder="请输入合同号" :border="false" @change="onChange"/>
          <div class="contractNo-popup__title">使用过的合同号</div>
          <div class="contractNo-popup__list">
            <div v-for="(item,index) in contractNoList" :key="index" class="contractNo-popup__item" @click="clickContractNo(item)">
              {{item}}
            </div>
          </div>
          <div class="contractNo-popup__footer">
            <van-button type="primary" block @click="clickContractNoConfirm">确定</van-button>
          </div>
      </div>
    </van-popup>
    <van-dialog title="确认删除此车辆？" :show="showDialog" confirm-button-text="删除" show-cancel-button @close="onCloseDialog" @confirm="onConfirmDialog">
    </van-dialog>
    <van-dialog title="确认提交？" :show="showSubmit" show-cancel-button @close="onCloseSubmit" @confirm="onConfirmSubmit">
    </van-dialog>
  </div>
</template>

<script>
import supplierApi from '../../../api/supplier'
export default {
  props: {},
  data () {
    return {
      options: {},
      formData: {
        contractNo: '',
        shipFromLocation: '',
        deliveryWeight: null
      },
      error: {
        contractNo: false,
        deliveryWeight: false,
        shipFromLocation: false
      },
      errorMessage: {
        contractNo: '请选择合同号',
        shipFromLocation: '请选择装货地点',
        deliveryWeight: '请选择车辆司机'
      },
      cars: [],
      carList: [],
      showCars: false,
      showContractNo: false,
      contractNo: '',
      contractNoList: [],
      showLocation: false,
      selectedLocation: '',
      locationList: [],
      showDialog: false,
      currIndex: null,
      showSubmit: false
    }
  },
  mounted () {

  },
  onLoad(options) {
    console.log('options', options)
    this.options = options
  },
  methods: {
    clickSubmit() {
      let checkList = this.check()
      let msg = ''
      checkList.find(item => {
        if (item[1] && !msg) {
          msg = this.errorMessage[item[0]]
        }
      })
      if (msg) {
        wx.showToast({title: msg, icon: 'none'})
        return
      }
      console.log('checkList', checkList)
      this.showSubmit = true
    },
    check() {
      return Object.keys(this.formData).map(key => {
        // this.error[key] = !this.formData[key]
        if (key === 'deliveryWeight') {
          return [key, !this.cars.length]
        }
        return [key, !this.formData[key]]
      })
    },
    onCloseSubmit() {
      this.showSubmit = false
    },
    onConfirmSubmit() {

    },
    countLoadWeight() {
      this.formData.deliveryWeight = this.cars.reduce((pre, cur) => {
        if (typeof cur.loadWeight === 'number') {
          pre += cur.loadWeight
        }
        return pre
      }, 0)
      console.log('吨数', this.formData.deliveryWeight)
    },
    onCloseDialog() {
      this.showDialog = false
      this.currIten = null
    },
    onConfirmDialog() {
      this.cars.splice(this.currIndex, 1)
      this.countLoadWeight()
    },
    clickDelete(index) {
      this.currIndex = index
      this.showDialog = true
    },
    onSearch(e) {
      console.log('onSearch', e)
      let val = e.mp.detail
      this.getCarList(val)
    },
    onCloseCars() {
      this.showCars = false
      this.carList = []
    },
    clickSelectCars() {
      console.log(this.carList)
      this.carList.forEach(item => {
        if (item.selected) {
          let find = this.cars.find(ele => ele.id === item.id)
          if (!find) {
            this.cars.push(item)
          }
        }
      })
      this.countLoadWeight()
      this.onCloseCars()
    },
    clickBox(item) {
      this.$set(item, 'selected', !item.selected)
      // item.selected = !item.selected
    },
    clickSelectBtn() {
      this.getCarList()
      this.showCars = true
    },
    onFieldChange(val, type) {
      let value = val.target.value
      this.formData[type] = value
    },
    chooseShipFromLocation() {
      this.getLocationList()
      this.showLocation = true
    },
    onCloseLocation() {
      this.showLocation = false
      this.selectedLocation = ''
      this.locationList = []
    },
    clickLocation(item) {
      this.selectedLocation = item
    },
    clickLocationConfirm(item) {
      if (!this.selectedLocation) {
        wx.showToast({
          title: '请点击选中装货地点',
          icon: 'none'
        })
        return
      }
      this.formData.shipFromLocation = this.selectedLocation
      this.onCloseLocation()
    },
    async getLocationList() {
      const res = await supplierApi('getLocationList')
      console.log('装货地点列表', res)
      if (res.success) {
        this.locationList = res.data || []
      }
    },
    onCloseContractNo() {
      this.showContractNo = false
      this.contractNo = ''
      this.contractNoList = []
    },
    clickChooseContractNo() {
      console.log('打开')
      this.getContractNoList()
      this.contractNo = this.formData.contractNo
      this.showContractNo = true
    },
    async getContractNoList() {
      const res = await supplierApi('getContractNoList')
      console.log('合同号', res)
      if (res.success) {
        this.contractNoList = res.data || []
      }
    },
    clickContractNo(item) {
      this.formData.contractNo = item
      console.log(this.formData.contractNo)
      this.onCloseContractNo()
    },
    onChange(e) {
      this.contractNo = e.mp.detail
    },
    clickContractNoConfirm() {
      if (!this.contractNo) {
        wx.showToast({
          title: '请输入合同号或扫码二维码',
          icon: 'none'
        })
        return
      }
      this.formData.contractNo = this.contractNo
      this.onCloseContractNo()
    },
    scanCode() {
      console.log('点击扫码')
      let that = this
      wx.scanCode({
        success (res) {
          console.log('扫码', res)
          that.formData.contractNo = res.result
          that.onCloseContractNo()
        },
        fail(rej) {
          // wx.showToast({
          //   title: '扫码失败',
          //   icon: 'none'
          // })
        }
      })
    },
    async getCarList (searchKey = '') {
      const res = await supplierApi('allCarList', {searchKey})
      console.log('getCarList', res)
      if (res.success) {
        // this.carList.forEach(item => {

        // })
        this.carList = res.data
      }
    }
  },
  computed: {

  }
}
</script>

<style lang="scss">
.supplierReport{
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  overflow-x: hidden;
  .detail{
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    grid-template-rows: 1fr;
    padding: 18px 30px 16px 30px;
    background: #fff;
    .detail-item{
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
    }
    .detail-label{
      color:rgba(150, 151, 153, 1);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      margin-right: 10px;
    }
    .detail-count{
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: 500;
    }
  }
  .contractNo-popup{
    .contractNo-popup__header{
      position: relative;
      margin-top: 14px;
      text-align: center;
      .contractNo-popup__label{
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 700;
      }
      .contractNo-popup__icon{
        position: absolute;
        top: 0;
        right: 10px;
        width: 30px;
        height: 30px;
      }
      .contractNo-popup__btn{
        position: absolute;
        top: 0;
        right: 10px;
      }
    }
    .contractNo-input{
      .van-field__body{
        padding: 13px 15px;
        border: 1px solid rgba(235, 237, 240, 1);
        border-radius: 8px;
      }
    }
    .contractNo-popup__title{
      padding: 0 16px;
      margin:24px 0 8px 0;
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: 700;
    }
    .contractNo-popup__list{
      min-height: 250px;
      max-height: 250px;
      overflow-y: auto;
      .contractNo-popup__item{
        padding: 10px 0;
        margin: 0 16px;
        border-bottom: 1px solid rgba(235, 237, 240, 1);
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
      }
      .popup-flex{
        display: flex;
        justify-content: space-between;
      }
      .popup-selected{
        color: rgba(53, 93, 180, 1);
      }
    }
    .cars__list{
      min-height: 400px;
      max-height: 400px;
      overflow-y: auto;
      .cars__item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 16px;
        padding: 6px 0;
        border-bottom: 1px solid rgba(235, 237, 240, 1);
        .cars__label{
          color:rgba(16, 16, 16, 1);
          font-family: PingFang SC;
          font-size: 18px;
          // font-weight: 500;
          font-weight: bold;
        }
        .cars__desc{
          color:rgba(150, 151, 153, 1);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
        }
        .cars__select-box{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          border: 1px solid rgba(200, 201, 204, 1);
          .cars__icon{

          }
          &.cars__select{
            background-color: rgba(53, 93, 180, 1);
          }
       }
      }
    }
    .contractNo-popup__footer{
      padding: 14px 16px;
      .van-button{
        width: 90%;
      }
    }
  }
  .select-cars{
    flex: 1;
    margin-top: 12px;
    padding: 16px 16px 10px 16px;
    background-color: #fff;
    box-sizing: border-box;
    .select-cars__header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .select-cars__label{
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 700;
      }
    }
    .currCars__list{
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      .currCars__item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin: 0 16px;
        padding: 6px 0;
        border-bottom: 1px solid rgba(235, 237, 240, 1);
        .currCars__label{
          color:rgba(16, 16, 16, 1);
          font-family: PingFang SC;
          font-size: 18px;
          // font-weight: 500;
          font-weight: bold;
        }
        .currCars__desc{
          color:rgba(150, 151, 153, 1);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
        }
        .currCars__icon-wrap{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 16px;
          height: 16px;
          background-color: rgba(215, 215, 215, 1);
          border-radius: 50%;
        }
      }
    }
  }
  .supplierReport-footer{
    padding: 14px 16px;
    background-color: #fff;
    .van-button{
      width: 90%;
    }
  }

}
</style>