<template>
  <div class="dh-keyword">
    <view class="mask no-bg" v-if="masker && show" @click="_onHide"></view>
    <view class="popup" :class="[show? 'popup-enter' : '']">
      <!-- 车牌键盘start -->
      <view v-if="kbType == 'plate'">
        <view class="kb-pro" v-if="!str">
          <view class="vw">
            <block v-for="(item,index) in provArr" :key="index">
              <button
                class="btn"
                :data-i="item"
                @click="_onKey"
                v-if="index <= 9"
                hover-class="hover-class"
              >{{item}}</button>
            </block>
          </view>
          <view class="vw">
            <block v-for="(item,index) in provArr" :key="index">
              <button
                class="btn"
                :data-i="item"
                @click="_onKey"
                v-if="index >= 10 && index <= 18"
                hover-class="hover-class"
              >{{item}}</button>
            </block>
          </view>
          <view class="vw">
            <block v-for="(item,index) in provArr" :key="index">
              <button
                class="btn"
                :data-i="item"
                @click="_onKey"
                v-if="index >= 19 && index <= 26"
                hover-class="hover-class"
              >{{item}}</button>
            </block>
          </view>
          <view class="vw">
            <block v-for="(item,index) in provArr" :key="index">
              <button
                class="btn"
                :data-i="item"
                @click="_onKey"
                v-if="index > 26"
                hover-class="hover-class"
              >{{item}}</button>
            </block>
          </view>
        </view>
        <view class="fx fw kb" v-else>
          <block v-for="(item,index) in numArr" :key="index">
            <button
              class="btn"
              :data-i="item"
              :disabled="str.length < 2"
              @click="_onKey"
              hover-class="hover-class"
            >{{item}}</button>
          </block>
          <block v-for="(item,index) in lettArr" :key="index">
            <button
              class="btn"
              :data-i="item"
              :disabled="(index == 25 || index == 26) && (str[0] + str[1] != '粤Z')"
              @click="_onKey"
              hover-class="hover-class"
            >{{item}}</button>
          </block>
        </view>
        <button class="fx jc-cnt btn-del ab" data-i="-1" @click="_onKey" hover-class="hover-class">
          <van-icon class="vehicle-en-button-delete" name="close" />
        </button>
      </view>
      <!-- 车牌键盘end -->

      <!-- 纯数字键盘start -->
      <view class="fx jc-fe fw kb num-only" v-if="kbType == 'num' || kbType == 'num_dot'">
        <block v-for="(item,index) in numArr" :key="index">
          <button class="btn" :data-i="item" @click="_onKey" hover-class="hover-class">{{item}}</button>
        </block>
        <button class="fx jc-cnt btn bg-ad" data-i="-1" @click="_onKey" hover-class="hover-class"></button>
      </view>
      <!-- 纯数字键盘end -->
    </view>
  </div>
</template>
<script>
// import variables from '@/static/styles/variables.scss'
export default {
  name: 'DhKeyword',
  props: {
    // 参数
    param: {
      type: Object,
      default () {
        return {}
      }
    }
    // // 取消字体颜色
    // cancelColor: {
    //   type: String,
    //   default: `${variables.mainTxt}`
    // },
    // // 确认背景颜色
    // confirmColor: {
    //   type: String,
    //   default: `${variables.mainTxt}`
    // },
    // // 最终显示的值
    // finalValue: {
    //   type: String
    // }
  },
  data () {
    return {
      show: false,
      masker: true,
      kbType: 'num', // 纯数字: num; 车牌: plate; 支付: pay
      max: 8,
      str: '',
      numArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      lettArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '学', '港', '澳'],
      provArr: ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '川', '贵', '云', '渝', '藏', '陕', '甘', '青', '宁', '新']
    }
  },
  methods: {
    toggle (elem) {
      let elm = this[elem]
      this[elem] = !elm
    },
    showKeyword () {
      this.init()
    },
    hide () {
      this.show = false
    },
    init () {
      let param = this.param || {}
      let provArr = this.provArr
      let numArr = this.numArr
      this.show = true
      this.masker = param.masker !== undefined ? param.masker : true
      this.kbType = param.kbType || 'num'
      this.max = param.max || 8
      this.str = (param.str + '') || ''
      if (param.kbType === 'park' && provArr.indexOf('临') === -1) {
        provArr.push('临')
        this.provArr = provArr
      }
      if ((param.kbType === 'pay' || param.kbType.indexOf('dot') !== -1) && numArr.indexOf('.') === -1) {
        numArr.push('.')
        this.numArr = numArr
      }
    },
    inpValid (val, cb) {
      let str = this.str || ''
      let list = str.split('.') || []
      if (val === '.' && !str) {
        this.$toast('输入框为空，不能输入.', 'warn')
      } else if (val === '.' && str.indexOf('.') !== -1) {
        this.$toast('输入框内容已含有.，不能再输入.', 'warn')
      } else if (val !== -1 && typeof list[1] !== 'undefined' && list[1].length > 1) {
        this.$toast('小数点已有后两位，则不能输入', 'warn')
      } else if (val !== -1 && !isNaN(val) && str === '0') {
        this.$toast('已输入0，则不能再连续输入数字，只能输入.小数点', 'warn')
      } else {
        cb && cb()
      }
    },
    _onKey (e) {
      let str = this.str || ''
      let max = this.max || 8
      let i = e.currentTarget.dataset.i
      if (i === 'cfm') {
        this.hide()
        return
      }
      this.inpValid(i, () => {
        if (i === '-1') {
          this.str = str.substr(0, str.length - 1)
          str = this.str
        } else if (str.length < max) {
          this.str = str + i
          str = this.str
        }
        this.$emit('keyEvt', str)
      })
    },
    _onHide () {
      this.hide()
      this.$emit('hideEvt')
    }
  }
}
</script>

<style lang="scss">
.dh-keyword {
  .popup {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
    position: fixed;
    left: 0;
    bottom: -500rpx;
    z-index: 999;
    transform: rotate(0deg) scale(1) translate(0%, 0%);
    -webkit-transform: rotate(0deg) scale(1) translate(0%, 0%);
    transition: All 0.4s ease;
    -webkit-transition: All 0.4s ease;
  }
  .popup-enter {
    transform: rotate(0deg) scale(1) translate(0%, -500rpx);
    -webkit-transform: rotate(0deg) scale(1) translate(0%, -500rpx);
  }
  .kb,
  .kb-pro,
  .kb-pay {
    background: #f2f2f5;
    padding: 16rpx 14rpx 12rpx;
    font-size: 32rpx;
    text-align: center;
  }
  .kb .btn,
  .kb-pro .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9%;
    height: 86rpx;
    line-height: 86rpx;
    color: #393b3f;
    background: #fff;
    border: 0;
    margin: 0 0.5% 10rpx;
    padding-left: 0;
    padding-right: 0;
  }
  .kb-pro > .vw {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kb-pay .btn {
    width: 168rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #393b3f;
    background-color: #fff;
    margin: 16rpx 16rpx 0 0;
    border-radius: 6rpx;
  }
  .kb-pay .btn.cfm {
    height: 290rpx;
    line-height: 290rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #4d6aff;
  }
  .kb-pay .btn:nth-of-type(10) {
    width: 352rpx;
  }
  .kb-pay .icon-del {
    width: 36rpx;
    height: 30rpx;
  }
  .hover-class {
    background: rgba(70, 48, 48, 0.5) !important;
  }
  .btn-del {
    width: 130rpx;
    height: 86rpx;
    background: #adb4bd !important;
  }
  .btn-del.ab {
    position: absolute;
    right: 14rpx;
    bottom: 20rpx;
  }
  .btn-del.hover-class {
    background: rgba(173, 180, 189, 0.5) !important;
  }
  .icon-del {
    width: 50rpx;
    height: 34rpx;
  }
  /* 纯数字键盘 */
  .num-only {
    height: 400rpx;
  }
  .num-only > .btn {
    width: 31%;
    margin-left: 1%;
    margin-right: 1%;
  }
  /* flex */
  .fx {
    display: flex !important;
    align-items: center;
  }
  .fx-one > .vw {
    flex: 1;
  }
  .jc-sb {
    justify-content: space-between !important;
  }
  .jc-sr {
    justify-content: space-around !important;
  }
  .jc-cnt {
    justify-content: center !important;
  }
  .jc-fs {
    justify-content: flex-start !important;
  }
  .jc-fe {
    justify-content: flex-end !important;
  }
  .ai-fs {
    align-items: flex-start !important;
  }
  .ai-fe {
    align-items: flex-end !important;
  }
  .fd-cl {
    flex-direction: column !important;
  }
  .fw {
    flex-wrap: wrap !important;
  }
  /* 遮罩 */
  .mask {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 600;
    left: 0;
    top: 0;
  }
  .mask {
    background: rgba(0, 0, 0, 0.6);
  }
  .mask.no-bg {
    background: none;
  }
}
</style>