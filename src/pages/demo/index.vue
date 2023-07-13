<template>
  <div class="demo_form">
    <t-header title="表单组件示例" />
    <t-mobile-form
      ref="t-form"
      :formOpts="formOpts"
      :listDefaultInfo="formOpts.listDefaultInfo"
      :listTypeInfo="formOpts.listTypeInfo"
    ></t-mobile-form>
    <van-button block type="primary" @click="formCom">表单组件</van-button>
  </div>
</template>
<script>
// import TMobileForm from '@/components/TForm/index.vue'
export default {
  name: 'DemoForm',
  components: {
    // TMobileForm
  },
  data() {
    return {
      formOpts: {
        formData: {
          account: '', // *用户账号
          password: '', // *用户密码
          name: '', // *用户昵称
          email: '', // 邮箱
          desc: '', // 描述
          sex: '', // *性别: 0:男 1:女
          status: '', // *状态: 停用，启用',
          hobby: '', // *爱好:多选
          creatDate: '', // 出生日期
          date: '', // 出生日期---时分秒
          phone: '' // 手机号码
        },
        // 下拉选择默认值
        listDefaultInfo: {
          statusDefault: '',
          statusPopup: false,
          sexDefault: '',
          sexPopup: false,
          showDatePopup: false, // 日期弹窗
          showDatetimePopup: false, // 日期弹窗(含时分秒)
          dateDefault: '', // 默认日期-- 年月日
          datetimeDefault: '', // 默认日期--含时分秒
          hobbyPopup: false, // 爱好弹窗
          hobbyDefault: [] // 爱好
        },
        fieldList: [
          { label: '账号', value: 'account', type: 'text', placeholder: '请输入账号', required: true },
          { label: '', value: 'password', type: 'password', placeholder: '请输入密码', required: true, labelCustom: '自定义label', labelNameStyle: 'color:red', slotRightIcon: { name: 'location-o', fun: this.clickIcon } },
          { label: '昵称', value: 'name', type: 'text', placeholder: '请输入昵称', required: true, slotButton: { name: '发送验证码', size: 'small', type: 'primary', fun: this.test } },
          { label: '邮箱', value: 'email', type: 'text', placeholder: '请输入邮箱', required: true },
          { label: '出生日期', value: 'creatDate', type: 'date', placeholder: '请选择出生日期', defaultValue: 'dateDefault', defaultPopup: 'showDatePopup' },
          { label: '日期时分秒', value: 'date', type: 'datetime', placeholder: '请选择日期时分秒', defaultValue: 'datetimeDefault', defaultPopup: 'showDatetimePopup' },
          { label: '性别', value: 'sex', type: 'radio', list: 'sexList', placeholder: '请选择性别', defaultValue: 'sexDefault', defaultPopup: 'sexPopup' },
          { label: '爱好', value: 'hobby', type: 'checkbox', list: 'hobbyList', placeholder: '请选择爱好(多选)', required: true, defaultValue: 'hobbyDefault', defaultPopup: 'hobbyPopup' },
          { label: '状态', value: 'status', type: 'radio', list: 'statusList', placeholder: '请选择状态', defaultValue: 'statusDefault', defaultPopup: 'statusPopup' },
          { label: '手机号码', value: 'phone', type: 'text', maxlength: 11, placeholder: '请输入手机号码', required: true },
          { label: '描述', value: 'desc', type: 'textarea', placeholder: '请输入描述', autosize: { maxHeight: 80, minHeight: 50 } }
        ],
        rules: {
          account: [
            { required: true, message: '请输入账号' },
            { min: 2, max: 4, message: '账号只能大于2个字符小于4个字符' }
          ],
          password: [{ required: true, message: '请输入密码' }],
          name: [{ required: true, message: '请输入昵称' }],
          email: [
            { required: true, message: '请输入邮箱' },
            { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '请输入正确的邮箱' }
          ],
          hobby: [{ required: true, message: '请至少选择一个爱好' }],
          phone: [
            { required: true, message: '请输入手机号码' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
          ]
        },
        // 相关列表
        listTypeInfo: {
          hobbyList: [
            { label: '吉他', value: '0' },
            { label: '看书', value: '1' },
            { label: '美剧', value: '2' },
            { label: '旅游', value: '3' },
            { label: '音乐', value: '4' }
          ],
          sexList: ['女', '男'],
          statusList: ['启用', '停用']
        }
      }
    }
  },
  methods: {
    // TForm表单提交
    formCom() {
      console.log('form组件点击提交--数据', this.formOpts.formData)
      let res = this.$refs['t-form'].validate()
      console.log('规则校验是否全部通过', res)
      if (!res) return
      console.log('全部校验通过--最终数据', this.formOpts.formData)
    },
    test(val) {
      console.log('测试点击右侧按钮---', val)
    },
    clickIcon(val) {
      console.log('点击图标', val)
    }
  }
}
</script>
<style lang="scss">
.demo_form {
  width: 100%;
}
</style>