<template>
  <div class="t-slide" @touchstart="touchS" @touchmove="touchM">
    <div class="contents_wrapper" :style="{right:del+'px'}">
      <div class="car-info flex-box">
        <div>{{plateNumObj.plateNum}}</div>
        <div>{{plateNumObj.plateColor===1?'蓝牌':'黄牌'}}</div>
        <div class="flex-box flex-ver" @click.stop="QrCode(plateNumObj)">
          <div>二维码</div>
        </div>
      </div>
    </div>
    <div class="delete" @click.stop="delt">删除</div>
  </div>
</template>
<script>
export default {
  name: 'DhSlideDel', // 左滑删除
  data () {
    return {
      clientX1: '', // 滑动开始位置
      clientX2: '',
      del: 0, // 内容初始的right距离
      btnWidth: 80// 删除按钮宽度
    }
  },
  props: {
    plateNumObj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    touchS (e) {
      this.clientX1 = e.clientX
    },
    touchM (e) {
      this.clientX2 = e.clientX
      let disX = this.clientX1 - this.clientX2
      // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
      if (disX === 0 || disX < 0) {
        this.del = 0
      }
      if (disX >= this.btnWidth) {
        // 控制手指移动距离最大值为删除按钮的宽度
        this.del = this.btnWidth
      }
    },
    // 取消删除按钮复原
    cancel () {
      this.del = 0
    },
    // 点击二维码显示
    QrCode (item) {
      this.$emit('qr-code', item)
    },
    // 点击删除按钮
    delt () {
      console.log(8888)
      this.$emit('click-del')
    }
  }
}
</script>
<style lang="scss" scoped>
.t-slide {
  width: 100%;
  position: relative;
  height: 60px;
  .contents_wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: right 0.3s ease-in-out;
    z-index: 99;
    background: #fff;
    .car-info {
      padding-left: 24px;
      color: #000;
      font-size: 16px;
      div {
        height: 60px;
        line-height: 60px;
        text-align: center;
        &:nth-of-type(1) {
          min-width: 100px;
        }
        &:nth-of-type(2) {
          margin-left: 20px;
        }
        & {
          div {
            margin-left: 25px;
            width: 74px;
            height: 22px;
            border: 1px solid #355db4;
            border-radius: 13px;
            color: #355db4;
            font-size: 12px;
            line-height: 22px;
          }
        }
        &:nth-of-type(4) {
          margin-left: 30px;
          justify-content: flex-end;
        }
      }
    }
  }
  .delete {
    color: #fff;
    height: 100%;
    text-align: center;
    width: 80px;
    background: red;
    line-height: 60px;
    position: absolute;
    right: 0;
  }
}
</style>
