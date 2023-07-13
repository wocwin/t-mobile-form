import request from './index'

const config = {
  /**
   * 供应点api
   */
  // 供应点注册
  supplierRegister: {
    url: `/applet/supplier/personal/register`,
    method: 'post'
  },
  // 审核进度
  registerProgress: {
    url: `/applet/supplier/personal/progress`,
    method: 'get'
  },
  // 供应点信息
  supplierInfo: {
    url: `/applet/supplier/personal/info`,
    method: 'get'
  },
  // 验证码
  getVerifyCode: {
    url: `/applet/common/base64`,
    method: 'get'
  },
  // 明天约货吨数and已报明天吨数
  supplierCount: {
    url: `/applet/supplier/home`,
    method: 'get'
  },
  // 明天约货统计
  detailsTomorrowOrder: {
    url: `/applet/supplier/appoint/overview`,
    method: 'get'
  },
  // 明天约货详情
  detailsTomorrow: {
    url: `/applet/supplier/appoint/tomorrow`,
    method: 'get'
  },
  // 明天上报车辆详情
  carsTomorrow: {
    url: `/applet/supplier/appoint/cars`,
    method: 'get'
  },
  // 今天约货统计
  detailsTodayOrder: {
    url: `/applet/supplier/duty/overview`,
    method: 'get'
  },
  // 今天约货详情
  detailsToday: {
    url: `/applet/supplier/duty/list`,
    method: 'get'
  },
  // 今天上报车辆详情
  carsToday: {
    url: `/applet/supplier/duty/cars`,
    method: 'get'
  },
  // 确定上报
  confirm: {
    url: `/applet/supplier/appoint/confirm`,
    method: 'POST'
  },
  // 获取合同列表
  getContractNoList: {
    url: `/applet/supplier/appoint/contracts`,
    method: 'get'
  },
  // 装货地点列表
  getLocationList: {
    url: `/applet/supplier/appoint/sites`,
    method: 'get'
  },
  // 所有车辆
  allCarList: {
    url: `/applet/supplier/personal/all-cars`,
    method: 'get'
  },
  // 我的车辆
  myCarList: {
    url: `/applet/supplier/personal/my-cars`,
    method: 'get'
  }
}

export default function req(funcName, data) {
  return request(config, funcName, data)
}
