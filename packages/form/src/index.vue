<template>
  <div :class="['t_form',className]">
    <div v-for="(item, index) in formOpts.fieldList" :key="index">
      <!-- 日期年月日 -->
      <van-cell-group v-if="item.type === 'date'">
        <van-cell
          :title="item.label"
          :required="item.required"
          input-align="right"
          is-link
          :value-class="listDefaultInfo[item.defaultValue]?'van-cell_date_select':'van-cell_date'"
          :arrow-direction="listDefaultInfo[item.defaultPopup]?'down':''"
          :value="listDefaultInfo[item.defaultValue] || item.placeholder"
          @click="listDefaultInfo[item.defaultPopup] = true"
        />
        <van-popup :show="listDefaultInfo[item.defaultPopup]" position="bottom" round>
          <div class="popup_wrap">
            <van-datetime-picker
              :type="item.type||'date'"
              :value="formOpts.formData[item.value]"
              @cancel="listDefaultInfo[item.defaultPopup] = false"
              @confirm="(e) => {listDefaultInfo[item.defaultValue] = dayjs(e.mp.detail).format('YYYY-MM-DD'),formOpts.formData[item.value] = dayjs(e.mp.detail).format('YYYY-MM-DD'),listDefaultInfo[item.defaultPopup] = false}"
            />
          </div>
        </van-popup>
      </van-cell-group>
      <!-- 日期年月日时分秒 -->
      <van-cell-group v-else-if="item.type === 'datetime'">
        <van-cell
          :title="item.label"
          input-align="right"
          :required="item.required"
          is-link
          :value="listDefaultInfo[item.defaultValue] || item.placeholder"
          :arrow-direction="listDefaultInfo[item.defaultPopup]?'down':''"
          :value-class="listDefaultInfo[item.defaultValue]?'van-cell_date_select':'van-cell_date'"
          @click="listDefaultInfo[item.defaultPopup] = true"
        />
        <van-popup :show="listDefaultInfo[item.defaultPopup]" position="bottom" round>
          <div class="popup_wrap">
            <van-datetime-picker
              :type="item.type||'datetime'"
              :value="formOpts.formData[item.value]"
              @cancel="listDefaultInfo[item.defaultPopup] = false"
              @confirm="(e) => {listDefaultInfo[item.defaultValue] = dayjs(e.mp.detail).format('YYYY-MM-DD HH:mm:ss'),formOpts.formData[item.value] = dayjs(e.mp.detail).format('YYYY-MM-DD HH:mm:ss'),listDefaultInfo[item.defaultPopup] = false}"
            />
          </div>
        </van-popup>
      </van-cell-group>
      <!-- 下拉单选框 -->
      <van-cell-group v-else-if="item.type === 'radio'">
        <van-cell
          :title="item.label"
          input-align="right"
          :required="item.required"
          is-link
          :value="listDefaultInfo[item.defaultValue] || item.placeholder"
          :arrow-direction="listDefaultInfo[item.defaultPopup]?'down':''"
          :value-class="listDefaultInfo[item.defaultValue]?'van-cell_date_select':'van-cell_date'"
          @click="listDefaultInfo[item.defaultPopup] = true"
        />
        <van-popup :show="listDefaultInfo[item.defaultPopup]" position="bottom" round>
          <van-picker
            show-toolbar
            :title="item.label"
            :columns="listTypeInfo[item.list]"
            @cancel="listDefaultInfo[item.defaultPopup] = false"
            @confirm="(e) => {listDefaultInfo[item.defaultValue] = e.mp.detail.value,formOpts.formData[item.value] = e.mp.detail.value,listDefaultInfo[item.defaultPopup] = false}"
          />
        </van-popup>
      </van-cell-group>
      <!-- 下拉复选框 -->
      <van-cell-group v-else-if="item.type === 'checkbox'">
        <van-cell
          :title="item.label"
          input-align="right"
          :required="item.required"
          is-link
          :value="listDefaultInfo[item.defaultValue].length>0?listDefaultInfo[item.defaultValue]:listDefaultInfo[item.defaultValue].length || item.placeholder"
          :arrow-direction="listDefaultInfo[item.defaultPopup]?'down':''"
          :value-class="listDefaultInfo[item.defaultValue].length?'van-cell_date_select':'van-cell_date'"
          @click="listDefaultInfo[item.defaultPopup] = true"
        />
        <van-popup
          :show="listDefaultInfo[item.defaultPopup]"
          custom-class="t_checkbox_picker"
          position="bottom"
          round
        >
          <div class="t_checkbox_picker__toolbar">
            <div
              class="t_checkbox_picker__cancel"
              @click="listDefaultInfo[item.defaultPopup] = false"
            >取消</div>
            <div class="t_checkbox_picker__title t-oneline-overflow-hidden">{{item.label}}</div>
            <div
              class="t_checkbox_picker__confirm"
              @click="() => {formOpts.formData[item.value] = listDefaultInfo[item.defaultValue],listDefaultInfo[item.defaultPopup] = false}"
            >确认</div>
          </div>
          <van-checkbox-group
            :value="listDefaultInfo[item.defaultValue]"
            @change="(event)=>listDefaultInfo[item.defaultValue] = event.mp.detail"
          >
            <div
              v-for="(value,key) in listTypeInfo[item.list]"
              :key="key"
              class="t_checkbox_content"
            >
              <van-checkbox
                custom-class="t_checkbox"
                :name="value[arrLabel || 'label']"
                :disabled="value.disabled||false"
                shape="square"
              >{{value[arrLabel || 'label']}}</van-checkbox>
            </div>
          </van-checkbox-group>
        </van-popup>
      </van-cell-group>
      <!-- 自定义插槽 -->
      <template v-else-if="item.slotName">
        <slot :name="item.slotName"></slot>
      </template>
      <!-- 输入框 -->
      <van-cell-group v-else>
        <van-field
          :name="item.value"
          v-model="formOpts.formData[item.value]"
          :placeholder="item.placeholder||''"
          :label="item.label"
          :type="item.type"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :required="item.required"
          :title-width="item.titleWidth||'6.2em'"
          :maxlength="item.maxlength||-1"
          :cursor="item.cursor||0"
          :show-word-limit="item.showWordLimit"
          :is-link="item.isLink"
          :input-align="item.inputAlign||'right'"
          :autosize="item.autosize||item.type==='textarea'"
          :left-icon="item.leftIcon||''"
          :right-icon="item.rightIcon||''"
          clearable
          @change="e => formOpts.formData[item.value] = e.mp.detail"
          @click="() =>$emit('handleEvent',item.event,formOpts.formData[item.value])"
        >
          <div
            v-if="!item.label"
            :class="item.labelNameClass"
            :style="item.labelNameStyle"
            slot="label"
          >{{item.labelCustom}}</div>
          <van-icon
            v-if="item.slotLeftIcon"
            :class="item.slotLeftIcon.class"
            :color="item.slotLeftIcon.color||'inherit'"
            @click="item.slotLeftIcon.fun"
            :name="item.slotLeftIcon.name"
            slot="left-icon"
          />
          <van-icon
            v-if="item.slotRightIcon"
            :class="item.slotRightIcon.class"
            :color="item.slotRightIcon.color||'inherit'"
            :name="item.slotRightIcon.name"
            @click="item.slotRightIcon.fun"
            slot="right-icon"
          />
          <van-button
            v-if="item.slotButton&&item.slotButton.name"
            :class="item.slotButton.class"
            :style="item.slotButton.style"
            :size="item.slotButton.size"
            :type="item.slotButton.type"
            @click="item.slotButton.fun"
            slot="button"
          >
             {{item.slotButton.name}}
          </van-button>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'TMobileForm',
  components: {},
  props: {
    /** 表单配置项说明
     * formData object 表单提交数据
     * rules object 验证规则
     * fieldList Array 表单渲染数据
     */
    formOpts: {
      type: Object,
      default: () => ({})
    },
    // 下拉选项数据
    listTypeInfo: {
      type: Object,
      default: () => ({})
    },
    // 下拉选择默认值
    listDefaultInfo: {
      type: Object,
      default: () => ({})
    },
    className: String
  },
  computed: {
    dayjs() {
      return dayjs
    }
  },
  watch: {
    // 'formOpts.fieldList': {
    //   handler(val) {
    //     console.log('fieldList---watch', val)
    //     console.log('fieldList---slots', this.$slots)
    //     val.map(item => {
    //       // 插槽提示
    //       setTimeout(() => {
    //         if (item.slotButton && item.slotButton.name) {
    //           !Object.keys(this.$slots).includes(item.slotButton.name) && this.$toast(`请在表单组件添加${item.slotButton.name}插槽！`)
    //         }
    //       }, 2000)
    //       setTimeout(() => {
    //         if (item.slotName) {
    //           !Object.keys(this.$slots).includes(item.slotName) && this.$toast(`请在表单组件添加${item.slotName}插槽！`)
    //         }
    //       }, 3000)
    //     })
    //   },
    //   immediate: true,
    //   deep: true // 深度监听
    // }
  },
  data() {
    return {
      ...this.listDefaultInfo
    }
  },
  methods: {
    // 单个字段校验
    validateField(key) {
      let value = this.formOpts.formData[key]
      if (this.formOpts.rules[key] && this.formOpts.rules[key].length) {
        for (let i = 0; i < this.formOpts.rules[key].length; i++) {
          let rule = this.formOpts.rules[key][i]
          if (rule.required) {
            // 必填校验
            if (!value) {
              return {
                valid: false,
                msg: rule.message
              }
            }
          } else if (rule.max || rule.min) {
            // 最大最小长度校验
            if (value && (value.length > rule.max || value.length < rule.min)) {
              return {
                valid: false,
                msg: rule.message
              }
            }
          } else if (rule.pattern && value) {
            // 正则校验
            let reg = new RegExp(rule.pattern)
            if (!reg.test(value)) {
              return {
                valid: false,
                msg: rule.message
              }
            }
          }
        }
      }
      return {
        valid: true
      }
    },
    // 全部校验
    validate() {
      let res = []
      Object.keys(this.formOpts.rules).forEach(key => {
        res.push(this.validateField(key))
      })
      for (let i = 0; i < res.length; i++) {
        if (!res[i].valid) {
          wx.showToast({
            title: res[i].msg,
            icon: 'none'
          })
          return false
        }
      }
      return true
    }
  }
}
</script>
<style lang="css">
.t_form .van-cell_date {
  color: var(--cell-value-color, #c8c9cc);
}
.t_form .van-cell_date_select {
  color: var(--cell-value-color, #000);
}
.t_form .t_checkbox_picker {
  min-height: 260px;
  padding: 10px 15px;
}
.t_form .t_checkbox_picker .t_checkbox_picker__toolbar {
  display: flex;
  height: var(--picker-toolbar-height, 44px);
  justify-content: space-between;
  line-height: var(--picker-toolbar-height, 44px);
}
.t_form
  .t_checkbox_picker
  .t_checkbox_picker__toolbar
  .t_checkbox_picker__cancel {
  color: var(--picker-cancel-action-color, #969799);
  font-size: var(--picker-action-font-size, 14px);
  padding: var(--picker-action-padding, 0 16px);
}

.t_form
  .t_checkbox_picker
  .t_checkbox_picker__toolbar
  .t_checkbox_picker__confirm {
  font-size: var(--picker-action-font-size, 14px);
  padding: var(--picker-action-padding, 0 16px);
  color: var(--picker-confirm-action-color, #576b95);
}
.t_form
  .t_checkbox_picker
  .t_checkbox_picker__toolbar
  .t_checkbox_picker__title {
  font-size: var(--picker-option-font-size, 16px);
  font-weight: var(--font-weight-bold, 500);
  max-width: 50%;
  text-align: center;
}
.t_form .t_checkbox_picker ._van-checkbox-group .t_checkbox_content {
  margin: 10px;
}
</style>