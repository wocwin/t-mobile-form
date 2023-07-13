import request from './index'

const config = {
  /**
   * 司机api
   */
  // 司机注册
  driverRegister: {
    url: `/applet/driver/personal/register`,
    method: 'post'
  },
  // 验证码
  getVerifyCode: {
    url: `/applet/common/base64`,
    method: 'get'
  }
}

export default function req(funcName, data) {
  return request(config, funcName, data)
}
