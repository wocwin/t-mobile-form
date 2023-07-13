<template>
  <div class="steel_supplier_register">
    <van-field :value="formData.phoneNumber" label="手机号" required placeholder="请输入手机号" :error="error.phoneNumber" :error-message="errorMessage.phoneNumber" :extra-event-params="true" @change="(val)=>onFieldChange(val,'phoneNumber')" />
    <van-field :value="formData.userName" label="负责人姓名" required placeholder="请输入负责人姓名" :error="error.userName" :extra-event-params="true" @change="(val)=>onFieldChange(val,'userName')" />
    <van-field :value="formData.storeName" label="供应点名称" required placeholder="请输入供应点名称" :error="error.storeName" :extra-event-params="true" @change="(val)=>onFieldChange(val,'storeName')" />
    <van-field :value="formData.address"  readonly label="供应点地址" required placeholder="请选择供应点地址" right-icon="location-o" @click="clickChooseLocation" :error="error.address" />
    <van-field :value="formData.supplierCode" label="所属合同供应商编码" required placeholder="请输入所属合同供应商编码" :error="error.supplierCode" :extra-event-params="true" @change="(val)=>onFieldChange(val,'supplierCode')" />
    <van-field :value="formData.supplierCompany" label="所属供货公司" placeholder="请输入所属供货公司" :error="error.supplierCompany" :extra-event-params="true" @change="(val)=>onFieldChange(val,'supplierCompany',true)" />
    <van-field readonly label="门面照片" />
    <div class="uploader-list">
      <van-uploader :fileList="storeImages" preview-size="110" deletable @afterread="(file)=>afterRead(file,'storeImages')" @delete="(e)=>deleteImg(e,'storeImages')">

      </van-uploader>
    </div>
    <van-field class="verifyCode" :value="formData.captcha" label="验证码" required placeholder="请输入验证码" :error="error.captcha" :error-message="errorMessage.captcha" :extra-event-params="true" @change="(val)=>onFieldChange(val,'captcha')">
      <div slot="right-icon">
        <img class="verifyCode-img" @click.stop="getVerifyCode" :src="verfyCode.base64" />
      </div>
    </van-field>
    <div class="footer">
      <van-button class="register-btn" block type="primary" @click="registerSteelSupplier">注册</van-button>
    </div>
  </div>
</template>
<script>
import { Constant } from '@/utils/settingConfig'
import supplierApi from '../../../api/supplier'
import { mapGetters, mapMutations } from 'vuex'
import { getUrlQueryOfObj } from '@/utils'
export default {
  name: 'SteelSupplierRegister',
  components: {

  },
  data() {
    return {
      formData: {
        phoneNumber: '', // 手机号
        userName: '', // 负责人姓名
        storeName: '', // 供货点名称
        address: '', // 供货点地址
        supplierCode: '', // 所属合同供应商编码
        supplierCompany: '', // 所属供货公司
        storeImages: [], // 照片
        captcha: '',
        uuId: ''
      },
      storeImages: [],
      error: {
        phoneNumber: false, // 手机号
        userName: false, // 负责人姓名
        storeName: false, // 供货点名称
        address: false, // 供货点地址
        supplierCode: false, // 所属合同供应商编码
        supplierCompany: false, // 所属供货公司
        storeImages: false, // 照片
        captcha: false,
        uuId: false
      },
      errorMessage: {
        phoneNumber: '', // 手机号
        userName: '', // 负责人姓名
        storeName: '', // 供货点名称
        address: '', // 供货点地址
        supplierCode: '', // 所属合同供应商编码
        supplierCompany: '', // 所属供货公司
        storeImages: '', // 照片
        captcha: '',
        uuId: ''
      },
      message: {
        phoneNumber: { msg: '请输入正确的手机号码', reg: [/^1[3456789]\d{9}$/] }
      },
      verfyCode: {
        base64: '',
        redisKey: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'openId',
      'unionId'
    ])
  },
  onLoad (options) {
    if (options.type === 'edit') {
      this.getDeatail()
    }
    console.log('options', options)
    this.getVerifyCode()
  },
  methods: {
    ...mapMutations({
      setToken: 'user/SET_TOKEN'
    }),
    async getDeatail() {
      const res = await supplierApi('supplierInfo')
      console.log('getDeatail', res)
    },
    validation(callback) {
      this.$refs.form.validation((valid) => {
        callback(valid, this.form)
      })
    },
    onFieldChange (val, type, skip = false) {
      if (skip) {
        let value = val.target.value
        this.formData[type] = value
        return [type, true]
      }

      let value = val.target.value
      this.formData[type] = value
      this.$set(this.error, type, !value)
      if (type === 'storeImages') {
        if (!Array.isArray(this.formData.storeImages) || !this.formData.storeImages.length) {
          this.$set(this.error, type, true)
          console.log('123', this.error[type])
        } else {
          this.$set(this.error, type, false)
        }
      }
      if (
        ['phoneNumber'].includes(type) &&
        !this.message[type].reg.some(r => r.test(value))
      ) {
        this.$set(this.errorMessage, type, this.message[type].msg)
        this.$set(this.error, type, true)
      } else {
        this.$set(this.errorMessage, type, '')
      }
      if (this.errorMessage[type] || this.error[type]) {
        return [type, false]
      }
      return [type, true]
    },
    clickChooseLocation() {
      wx.chooseLocation({
        success: (res) => {
          console.log('res', res)
          if (!res.address) {
            wx.showToast({
              title: '请选择地址',
              icon: 'none'
            })
            return
          }
          this.formData.address = res.address
        },
        fail: (rej) => {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none'
          })
        }
      })
    },
    // 删除图片
    deleteImg (e, listName) {
      let index = e.mp.detail.index
      this[listName].splice(index, 1)
      this.formData[listName] = this[listName].map(item => item.src)
    },
    afterRead (event, fileListName) {
      console.log('afterRead', event)
      const { file } = event.mp.detail
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let url = `${Constant.BASE_URL}${Constant.UPLOAD_IMGE}`
      let tempFilePath = file.tempFilePath
      let that = this
      wx.uploadFile({
        url: url,
        filePath: file.url,
        name: 'file',
        formData: { },
        header: {},
        success (res) {
          let result = JSON.parse(res.data)
          console.log('res', result.data)
          // 上传完成需要更新 fileList
          // const { fileList = [] } = this.data
          // fileList.push({ ...file, url: res.data })
          // this.setData({ fileList })

          that[fileListName].push({
            url: tempFilePath,
            src: result.data
          })
          that.formData[fileListName] = that[fileListName].map(item => item.src)
        },
        fail (rej) {
          console.log('rej', rej)
          that[fileListName] = []
        }
      })
    },
    // 验证码
    async getVerifyCode () {
      const res = await supplierApi('getVerifyCode')
      console.log('验证码', res.data.src)
      if (res.success) {
        this.verfyCode.base64 = res.data.src
        console.log('base64', this.verfyCode.base64)
        this.formData.uuId = res.data.uuId
        this.formData.captcha = ''
      }
    },
    async registerSteelSupplier() {
      let result = []
      Object.keys(this.formData).forEach(key => {
        // console.log('key', this.formData[key])

        let val = {
          target: {
            value: this.formData[key]
          }
        }
        let skip = ['supplierCompany'].includes(key)
        // console.log('val', val)
        result.push(this.onFieldChange(val, key, skip))
      })
      console.log('result', result)

      let msg = ''
      let check = false
      result.forEach(item => {
        let key = item[0]
        let isCheck = item[1]
        if (['storeImages'].includes(key)) {
          if (!isCheck) {
            msg = '请上传门面照片'
          }
        }
        if (!isCheck) {
          check = true
        }
      })
      // console.log('msg', msg)
      if (msg) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }
      console.log('check', check)
      if (check) {
        return
      }
      let data = {
        ...this.formData,
        openId: this.openId,
        unionId: this.unionId
      }
      wx.showLoading({
        title: '注册中',
        mask: true
      })

      try {
        const res = await supplierApi('supplierRegister', data)
        console.log('res', res)
        if (res.success) {
          wx.showToast({
            title: '注册成功,请等待审核',
            icon: 'none'
          })
          this.$reLaunch(`/pages/auth/main`)
        }
      } catch (error) {
        wx.hideLoading()
      }
      // this.validation(async (valid, form) => {
      //   if (!valid) {
      //     const res = await this.$http('registerSteelSupplier', {
      //       ...form,
      //       openId: this.openId,
      //       unionId: this.unionId
      //     })
      //     console.log('废钢供应商注册', res)
      //     if (res.success) {
      //       this.setToken(res.data)
      //       this.$store.dispatch('user/getUserInfo')
      //       this.registerSuccess()
      //     } else {
      //       this.$toast(res.msg)
      //     }
      //   }
      // })
    },
    registerSuccess() {
      const query = this.$parent.$mp.query
      this.$reLaunch(`/pages/auth/main?${getUrlQueryOfObj(query)}`)
    }
  }
}
</script>
<style lang="scss">
.steel_supplier_register {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  margin-top: 10px;
  .uploader-list{
    background: #fff;
    .van-uploader__wrapper{
      padding-left: 8px;
      box-sizing: border-box;
    }
  }
  .verifyCode{
    .van-field__control{
      order: 1;
      margin-left: 10px;
      box-sizing: border-box;
    }
    .verifyCode-img{
      width: 100px;
      height: 25px;
    }
  }
  .footer{
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
    padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
    padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
    margin: 10px 0;
    box-sizing: border-box;
    background: #fff;
    .register-btn{
      width: 90%;
    }
  }
}
</style>