<template>
  <div class="driver_register">
    <van-cell-group>
      <van-field :value="driverInfo.phoneNumber" label="手机号" required placeholder="请输入手机号" :error="error.phoneNumber" :error-message="errorMessage.phoneNumber" :extra-event-params="true" @change="(val)=>onFieldChange(val,'phoneNumber')" />
      <van-field :value="driverInfo.driverName" label="司机姓名" required placeholder="请输入司机姓名" :error="error.driverName" :error-message="errorMessage.driverName" :extra-event-params="true" @change="(val)=>onFieldChange(val,'driverName')" />
      <van-field :value="driverInfo.idCardNo" label="身份证号" required placeholder="请输入身份证号码" :error="error.idCardNo" :error-message="errorMessage.idCardNo" :extra-event-params="true" @change="(val)=>onFieldChange(val,'idCardNo')" />
      <van-field :value="driverInfo.certificateNo" label="从业资格证号" placeholder="请输入从业资格证号" :extra-event-params="true" @change="(val)=>onFieldChange(val,'certificateNo',true)" />
      <van-field readonly label="驾驶证" />
      <div class="uploader-list">
        <van-uploader :fileList="driverFrontImage" preview-size="110" :max-count="1" :show-upload="false" deletable @afterread="(file)=>afterRead(file,'driverFrontImage')" @delete="(e)=>deleteImg(e,'driverFrontImage')">
          <div v-if="!driverFrontImage.length" class="uploader-item">
            <img src="../../../static/images/driver_page.png" style="width: 100%;height: 100%;object-fit: contain;" alt="">
          </div>
        </van-uploader>
        <van-uploader :file-list="driverBackendImage" :show-upload="false" deletable @afterread="(file)=>afterRead(file,'driverBackendImage')" @delete="(e)=>deleteImg(e,'driverBackendImage')">
          <div v-if="!driverBackendImage.length" class="uploader-item">
            <img src="../../../static/images/driver_copy.png" style="width: 100%;height: 100%;object-fit: contain;" alt="">
          </div>
        </van-uploader>
      </div>
      <van-field readonly :value="driverInfo.plateNumber" label="车牌号" required placeholder="请输入车牌号" :error="error.plateNumber" :error-message="errorMessage.plateNumber" :extra-event-params="true" @click="onInputFocus" @change="(val)=>onFieldChange(val,'plateNumber')" />
      <van-field class="color-list-field" readonly required label="车牌颜色">
        <div slot="input">
          <div class="color-list">
            <van-button v-for="(item,index) in plateColorList" :type="driverInfo.plateColour == item.value ? 'primary':'default'" round size="small" :key="index" @click="clickColor(item)">{{item.label}}</van-button>
          </div>
        </div>
      </van-field>
      <van-field :value="driverInfo.loadWeight" label="载重吨数" required placeholder="请输入载重吨数" :error="error.loadWeight" :error-message="errorMessage.loadWeight" :extra-event-params="true" @change="(val)=>onFieldChange(val,'loadWeight')">
        <div slot="right-icon">吨</div>
      </van-field>
      <van-field :value="driverInfo.roadTransportNo" label="道路运输证" placeholder="请输入道路运输证" :extra-event-params="true" @change="(val)=>onFieldChange(val,'roadTransportNo',true)" />
      <van-field readonly label="行驶证" />
      <div class="uploader-list">
        <van-uploader :file-list="drivingFrontImage" preview-size="110" :max-count="1" :show-upload="false" deletable @afterread="(file)=>afterRead(file,'drivingFrontImage')" @delete="(e)=>deleteImg(e,'drivingFrontImage')">
          <div v-if="!drivingFrontImage.length" class="uploader-item">
            <img src="../../../static/images/license_front.png" style="width: 100%;height: 100%;object-fit: contain;" alt="">
          </div>
        </van-uploader>
        <van-uploader :file-list="drivingBackendImage" preview-size="110" :max-count="1" :show-upload="false" deletable @afterread="(file)=>afterRead(file,'drivingBackendImage')" @delete="(e)=>deleteImg(e,'drivingBackendImage')" >
          <div v-if="!drivingBackendImage.length" class="uploader-item">
            <img src="../../../static/images/license_reverse.png" style="width: 100%;height: 100%;object-fit: contain;" alt="">
          </div>
        </van-uploader>
      </div>
      <van-field class="verifyCode" :value="driverInfo.captcha" label="验证码" required placeholder="请输入验证码" :error="error.captcha" :error-message="errorMessage.captcha" :extra-event-params="true" @change="(val)=>onFieldChange(val,'captcha')">
        <div slot="right-icon">
          <img class="verifyCode-img" @click.stop="getVerifyCode" :src="verfyCode.base64" />
        </div>
      </van-field>
    </van-cell-group>
          <!-- <van-image width="100" height="100" :src="verfyCode.base64" /> -->

    <dh-keyword :isShow="isShow" @ok="ok" @cancel="ok" @inputchange="inputchange" />
  </div>
</template>
<script>
import driverApi from '../../../api/driver'
import { Constant, PLATE_TYPES } from '@/utils/settingConfig'
import DhKeyword from '@/components/DhKeyword'
export default {
  name: 'DriverRegister',
  components: {
    DhKeyword
  },
  data () {
    return {
      isShow: false,
      // 上传文件
      driverFrontImage: [],
      driverBackendImage: [],
      drivingFrontImage: [],
      drivingBackendImage: [],
      plateColorList: PLATE_TYPES,
      driverInfo: {
        phoneNumber: '', // 手机号
        driverName: '', // 账号或司机姓名
        idCardNo: '', // 身份证
        certificateNo: '', // 从业资格证
        driverFrontImage: '', // 驾驶证正页
        driverBackendImage: '', // 驾驶证副页
        plateNumber: '', // 车牌号
        loadWeight: '', // 吨数
        plateColour: '', // 车牌颜色
        roadTransportNo: '', // 道路运输证
        drivingFrontImage: '', // 行驶证正面
        drivingBackendImage: '', // 行驶证反面
        captcha: '', // 客户端输入的验证码
        uuId: ''
      },
      error: {
        driverName: false,
        phoneNumber: false,
        idCardNo: false,
        certificateNo: false,
        driverFrontImage: false,
        driverBackendImage: false,
        plateNumber: false,
        loadWeight: false,
        plateColour: false,
        roadTransportNo: false,
        drivingFrontImage: false,
        drivingBackendImage: false,
        captcha: false,
        uuId: false
      },
      errorMessage: {
        driverName: '',
        phoneNumber: '',
        idCardNo: '',
        certificateNo: '',
        driverFrontImage: '',
        driverBackendImage: '',
        plateNumber: '',
        loadWeight: '',
        plateColour: '',
        roadTransportNo: '',
        drivingFrontImage: '',
        drivingBackendImage: '',
        captcha: '',
        uuId: ''
      },
      message: {
        phoneNumber: { msg: '请输入正确的手机号码', reg: [/^1[3456789]\d{9}$/] },
        idCardNo: {
          msg: '请输入正确的身份证号码',
          reg: [
            /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
          ]
        },
        plateNumber: {
          msg: '请输入正确的车牌号码',
          reg: [
            /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3,4}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5,6})$/
          ]
        }
      },
      imgFileArr: [], // 预览图片地址集合
      verfyCode: {
        base64: '',
        redisKey: ''
      },
      predivImage: ''
    }
  },
  onLoad () {
    // Object.assign(this.$data, this.$options.data())
    this.getVerifyCode()
  },
  methods: {
    onInputFocus(e) {
      console.log(e)
      // this.$refs.plateNumber.blur()
      // document.activeElement.blur()
      this.isShow = true
    },
    clickColor(item) {
      console.log('item', item)
      this.driverInfo.plateColour = item.value
    },
    // 删除图片
    deleteImg (e, listName) {
      let index = e.mp.detail.index
      this[listName].splice(index, 1)
      console.log('e', e)
    },
    // 上传文件
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
            url: tempFilePath
          })
          that.driverInfo[fileListName] = result.data
        },
        fail (rej) {
          console.log('rej', rej)
          that[fileListName] = []
        }
      })
    },
    checkForm () {
      let result = []
      Object.keys(this.driverInfo).forEach(key => {
        // console.log('key', this.driverInfo[key])

        let val = {
          target: {
            value: this.driverInfo[key]
          }
        }
        let skip = ['certificateNo', 'roadTransportNo'].includes(key)
        // console.log('val', val)
        result.push(this.onFieldChange(val, key, skip))
      })
      return result
      // this.onFieldChange({target: {value: ''}}, 'phoneNumber')
    },
    onFieldChange (val, type, skip = false) {
      console.log('onFieldChange')
      if (skip) {
        let value = val.target.value
        this.driverInfo[type] = value
        return [type, true]
      }

      let value = val.target.value
      this.driverInfo[type] = value
      // console.log('type', type)
      // console.log('val', val)
      this.$set(this.error, type, !value)
      // this.error[type] = !value
      // console.log('error', this.error[type])
      // this.phoneNumber[type]
      if (
        ['phoneNumber', 'idCardNo', 'plateNumber'].includes(type) &&
        !this.message[type].reg.some(r => r.test(value))
      ) {
        this.$set(this.errorMessage, type, this.message[type].msg)
        // this.errorMessage[type] = this.message[type].msg
        this.$set(this.error, type, true)

        // console.log('message', this.errorMessage[type])
      } else {
        this.$set(this.errorMessage, type, '')
        // this.errorMessage[type] = ''
      }
      if (this.errorMessage[type] || this.error[type]) {
        console.log(type, this.error[type], this.errorMessage[type])
        return [type, false]
      }
      return [type, true]
    },
    // 验证码
    async getVerifyCode () {
      const res = await driverApi('getVerifyCode')
      console.log('验证码', res.data.src)
      if (res.success) {
        this.verfyCode.base64 = res.data.src
        console.log('base64', this.verfyCode.base64)
        this.driverInfo.uuId = res.data.uuId
        this.driverInfo.captcha = ''
      }
    },
    // 打开车牌键盘
    plateInput () {
      this.isShow = true
    },
    // 隐藏车牌键盘
    cancel () {
      this.isShow = false
    },
    // 点击确定
    ok () {
      console.log('点击确定')
      this.isShow = false
    },
    // 输入键盘
    inputchange (val) {
      console.log(val)
      if (val === 'delete') {
        this.driverInfo.plateNumber = this.driverInfo.plateNumber.slice(0, -1)
      } else {
        this.driverInfo.plateNumber += val
      }
      this.onFieldChange({
        target: {value: this.driverInfo.plateNumber}
      }, 'plateNumber')
      console.log('车牌号', this.driverInfo.plateNumber)
      // if (this.driverRegisterInfo.plateNum.length >= 8 && val !== 'delete') {
      //   return false
      // }
      // if (val === 'delete') {
      //   this.driverRegisterInfo.plateNum = this.driverRegisterInfo.plateNum.slice(0, this.driverRegisterInfo.plateNum.length - 1)
      // } else {
      //   this.driverRegisterInfo.plateNum += val
      // }
      // console.log(777, val, this.driverRegisterInfo.plateNum)
      // this.plateColor = ''
    },
    // 校验姓名和账号手机号码
    checkVerify (event, type, val) {
      let value = (event.mp && event.mp.detail.value) || val
      let reg = /[^]/
      let msg = ''
      switch (type) {
        case 'phoneNum': // 手机号码
          reg = /^1[3456789]\d{9}$/
          msg = !value ? '请输入手机号码' : '请输入正确的手机号码'
          break
        case 'plateNum': // 车牌号码
          value = value.toUpperCase()
          reg = /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3,4}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5,6})$/
          msg = !value ? '请输入车牌号码' : '请输入正确的车牌号码'
          break
        case 'userName': // 账号或司机姓名
          reg = /^[\s\S]{1,10}$/
          msg = !value ? '司机姓名不能为空' : '司机姓名不能超过10个字符'
          break
        case 'certificate': // 从业资格证
          msg = !value ? '从业资格证不能为空' : ''
          break
        case 'transportCertificate': // 道路运输证
          msg = !value ? '道路运输证不能为空' : ''
          break
        case 'verifyCode':
          msg = !value ? '验证码不能为空' : ''
          break
        default:
          break
      }
      this.driverRegisterInfo[type] = value
      // console.log('车牌号', value)
      if (!reg.test(value)) {
        this.$toast(msg)
        // this.driverRegisterInfo[type] = ''
        switch (type) {
          case 'phoneNum': // 手机号码
            if (this.driverRegisterInfo[type]) {
              this.isError = true
            } else {
              this.isError = false
            }
            break
          case 'code': // 身份证
            if (this.driverRegisterInfo[type]) {
              this.isError3 = true
            } else {
              this.isError3 = false
            }
            break
          case 'plateNum': // 车牌号码
            if (this.driverRegisterInfo[type]) {
              this.isError2 = true
            } else {
              this.isError2 = false
            }
            break
          case 'userName': // 账号或司机姓名
            if (this.driverRegisterInfo[type]) {
              this.isError1 = true
            } else {
              this.isError1 = false
            }
            break
          case 'certificate': // 从业资格证
            if (this.driverRegisterInfo[type]) {
              this.isError6 = true
            } else {
              this.isError6 = false
            }
            break
          case 'transportCertificate': // 道路运输证
            if (this.driverRegisterInfo[type]) {
              this.isError5 = true
            } else {
              this.isError5 = false
            }
            break
          case 'verifyCode': // 验证码
            if (this.driverRegisterInfo[type]) {
              this.isError4 = true
            } else {
              this.isError4 = false
            }
            break
          default:
            break
        }
      } else {
        this.checkError(type)
      }
    },
    // 清空输入框
    clearAll (type) {
      this.checkError(type)
      this.driverRegisterInfo[type] = ''
    },
    // 输入框错误
    checkError (type) {
      switch (type) {
        case 'phoneNum': // 手机号码
          this.isError = false
          break
        case 'plateNum': // 车牌号码
          this.isError2 = false
          break
        case 'code': // 身份证
          this.isError3 = false
          break
        case 'userName': // 司机姓名
          this.isError1 = false
          break
        case 'certificate': // 道路运输证
          this.isError6 = false
          break
        case 'transportCertificate': // 道路运输证
          this.isError5 = false
          break
        case 'verifyCode': // 验证码
          this.isError4 = false
          break
        default:
          break
      }
    },
    // 上传照片
    chooseImage () {
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // console.log('图片', res)
          // this.predivImage = res.tempFilePaths[0]
          wx.showLoading({
            title: '图片上传中',
            mask: true
          })
          let url = `${Constant.BASE_URL}${Constant.UPLOAD_IMGE}`
          wx.uploadFile({
            url: url, // 服务器地址
            method: 'POST',
            filePath: res.tempFilePaths[0],
            name: 'file', // 服务器定义的Key值
            header: {
              // 'content-type': 'multipart/form-data;charset=UTF-8',
              // 'Accept': 'application/json;charset=UTF-8'
            },
            // formData: { user: 'test' },
            success: (val) => {
              // 上传完成需要更新 fileList
              console.log('wx上传success返回值', val)
              let jsonObj = val.data && JSON.parse(val.data)
              // let image = jsonObj.data.replace(new RegExp('http://172.16.70.132:99', 'gm'), 'https://ii.donghaigangtie.com')
              // console.log('wx上传data', jsonObj, image)
              if (jsonObj.success) {
                this.predivImage = jsonObj.data
                // this.predivImage = image
                this.driverRegisterInfo.license = jsonObj.data
                wx.hideLoading()
                this.$toast('上传成功', 'success')
              } else {
                wx.hideLoading()
                this.predivImage = ''
                this.$toast('上传失败', 'error')
              }
            },
            fail: (val) => {
              console.log('wx上传fail返回值', val)
              wx.hideLoading()
              let jsonObj = JSON.parse(val.data)
              wx.showToast({
                title: jsonObj.msg || val.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      })
    },
    // 预览图片
    previewImg (e) {
      let url = e.mp.currentTarget.dataset.url
      this.imgFileArr.push(url)
      let urlsImg = this.predivImage
      if (urlsImg) {
        wx.previewImage({
          current: e.mp.currentTarget.dataset.eventid, // 当前显示图片的http链接
          urls: this.imgFileArr // 需要预览的图片http链接列表
        })
      }
    },
    // 清除图片
    delImg () {
      this.predivImage = ''
      this.driverRegisterInfo.license = ''
      this.imgFileArr = []
    },
    // 车牌颜色选择
    plateColorSelect (key) {
      if (key === 2 && this.driverRegisterInfo.plateNum.length < 8) {
        return
      }
      this.plateColor = key
      this.driverRegisterInfo.plateColor = this.plateColorList[key].value
    },
    // 司机注册
    async validation (validCallback) {
      console.log('司机注册', this.driverRegisterInfo)
      if (this.isError || this.isError1 || this.isError2 || this.isError3 || this.isError4 || this.isError5 || this.isError6) {
        this.$toast('请正确输入注册信息', 'none')
        return
      }
      let msg = ''
      for (let key in this.driverRegisterInfo) {
        if (!this.driverRegisterInfo[key]) {
          switch (key) {
            case 'phoneNum':
              msg = '请输入手机号码'
              break
            case 'code':
              msg = '请输入身份证'
              break
            case 'userName':
              msg = '请输入司机姓名'
              break
            case 'plateNum':
              msg = '请输入车牌号码'
              break
            case 'plateColor':
              msg = '请选择车牌颜色'
              break
            case 'license':
              msg = '请上传行驶证'
              break
            case 'transportCertificate':
              msg = '请输入道路运输证'
              break
            case 'certificate':
              msg = '请输入从业资格证'
              break
            case 'verifyCode':
              msg = '请输入验证码'
              break
            default:
              break
          }
          this.$toast(msg)
          return false
        }
      }
      let driverParams = {
        phoneNum: this.driverRegisterInfo.phoneNum, // 手机号
        code: this.driverRegisterInfo.code, // 手机号
        plateColor: this.driverRegisterInfo.plateColor,
        license: this.driverRegisterInfo.license,
        plateNum: this.driverRegisterInfo.plateNum,
        userName: this.driverRegisterInfo.userName, // 用户名
        transportCertificate: this.driverRegisterInfo.transportCertificate, // 道路运输证
        certificate: this.driverRegisterInfo.certificate, // 从业资格证证
        redisKey: this.driverRegisterInfo.redisKey, // 用户名
        verifyCode: this.driverRegisterInfo.verifyCode // 用户名
      }
      validCallback(driverParams)
    },
    filterEmoji ({ mp }) {
      let { value } = mp.detail
      /* eslint-disable */
      this.driverRegisterInfo.userName = value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    }
  }
}
</script>
<style lang="scss">
.driver_register {
  flex: 1;
  width: 100%;
  padding: 0 16px;
  margin-top: 10px;
  // .required .van-cell__title{
  //   position: relative;
  // }
  // .required .van-cell__title::after {
  //   position: absolute;
  //   right: 8px;
  //   color: #ee0a24;
  //   font-size: 14px;
  //   content: '*';
  // }
  .field-index--van-field{
    height: 52px;
    display: flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }
  .uploader-list {
    display: flex;
    ._van-uploader {
      flex: 1;
      width: 100%;
      max-width: 100%;
      // padding:0 10px;
      box-sizing: border-box;
      background: #fff;
      .van-uploader {
        width: 100%;
        .van-uploader__wrapper {
          width: 100%;
          .van-uploader__preview {
            margin: 0;
            width: 100%;
            margin: 0 10px;
            box-sizing: border-box;
            .van-uploader__preview-image {
              width: 100% !important;
              height: 110px !important;
              // padding: 0 10px;
              // box-sizing: border-box;
            }
          }
        }
      }
      .uploader-item {
        width: 50vw;
        max-width: 50vw;
        height: 110px;
        padding: 0 10px;
        background: #fff;
        box-sizing: border-box;
      }
    }
  }
  .color-list-field{
    .van-field__body {
      height: 52px;
    }
    .color-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 52px;
    padding: 0 20px 0 20px;
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
}
</style>