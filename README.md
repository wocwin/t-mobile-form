# t-mobile-form

> mpvue 中基于vant-weapp-ui二次封装微信小程序表单组件(t-mobile-form)

# 安装依赖

```
npm install
```

# 本地运行

```
npm run serve
```

# 微信运行
```
第一步：打开微信开发者工具
第二步：运行npm run serve后会生成一个dist文件夹，用微信开发者工具导入dist/wx即可预览
```

# npm 方式安装使用
```js
// 先安装
npm i t-mobile-form
// 在main.js中按下引入(全局使用)
import TMobileForm from 't-mobile-form/packages/form/src/index.vue'
Vue.component('TMobileForm', TMobileForm) // TMobileForm

```
# TMobileForm 参数配置

## 1. 简介：基于 vant-weapp 组件的二次封装，着重于数据层面，HTML 一行代码

TMobileForm 表单组件
**代码示例：**

```html
<t-mobile-form
  ref="t-form"
  :formOpts="formOpts"
  :listDefaultInfo="formOpts.listDefaultInfo"
  :listTypeInfo="formOpts.listTypeInfo"
  />
```

## 2. 配置参数

| 参数                | 说明                                                                  | 类型        | 默认值 |
| :------------------ | :-------------------------------------------------------------------- | :---------- | :----- |
| className           | 自定义类名                                                            | String      | -      |
| listTypeInfo        | 下拉选择数据源（type:'date/datetime/radio/checkbox'有效）             | Object      | {}     |
| listDefaultInfo     | 下拉选择默认值及弹窗字段（type:'date/datetime/radio/checkbox'有效）   | Object      | {}     |
| formOpts            | 表单配置项                                                            | Object      | {}     |
| ---fieldList        | form 表单每项 list (输入框继承van-field)                              | Array       | []     |
| ------slotName      | 自定义表单某一项输入框                                                | String/slot | -      |
| ------event         | type非date/datetime/radio/checkbox有效                                | String      | -      |
| ------type          | date/datetime/radio/checkbox/text/password/textarea                   | String      | -      |
| ------label         | form 表单每一项 title                                                 | String      | -      |
| ------slotLabelName | 自定义某一项 title                                                    | String/slot | -      |
| ------slotRightIcon | van-field右侧icon                                                     | Object      | -      |
| ----------name      | icon 名称                                                             | String      | -      |
| ----------fun       | 点击icon事件                                                          | funciton    | -      |
| ----------color     | icon颜色                                                              | String      | -      |
| ------slotButton    | van-field右侧按钮                                                     | Object      | -      |
| ----------name      | 插槽名                                                                | String      | -      |
| ----------fun       | 点击按钮事件                                                          | funciton    | -      |
| ----------type      | 继承van-button type                                                   | String      | -      |
| ----------size      | 继承van-button size                                                   | String      | -      |
| ------value         | form 表单每一项传给后台的参数（对应formData每一项）                   | String      | -      |
| ------required      | 是否显示红点                                                          | Boolean     | false  |
| ------list          | 下拉选择数据源（仅仅对 type:'date/datetime/radio/checkbox'有效）      | String      | -      |
| ------defaultValue  | 表单下拉选择回显界面值（type:'date/datetime/radio/checkbox'有效）     | String      | -      |
| ------defaultPopup  | 表单下拉选择弹窗字段值（type:'date/datetime/radio/checkbox'有效）     | String      | -      |
| ---formData         | 表单提交数据(对应 fieldList 每一项的 value 值)                        | Object      | -      |
| ---rules            | 三种规则校验（required(是否必填)/min：max(最小最大)/pattern(正则校验) | Object      | -      |

## 3. events

| 事件名      | 说明           | 返回值                                |
| :---------- | :------------- | :------------------------------------ |
| handleEvent | 输入框触发事件 | fieldList event 值及/输入框--输入的值 |

## 4. Methods

| 事件名        | 说明                     | 参数        |
| :------------ | :----------------------- | :---------- |
| validateField | 单个字段校验             | 传入rules值 |
| validate      | 整个表单校验成功返回true | -           |

