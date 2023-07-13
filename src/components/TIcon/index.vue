<template>
  <img
    :style="iconstyle?iconstyle:('width:' + size + 'rpx;height:' + size + 'rpx;')"
    :src="imgurl"
    :model="model"
  />
</template>
<script>
import { Base64 } from 'js-base64'
export default {
  name: 'TIcon',
  props: {
    size: {
      type: [Number, String],
      default: 45
    },
    src: [String],
    iconstyle: [String],
    color: [String],
    stroke: [String],
    model: [String]
  },
  data() {
    return {
      imgurl: ''
    }
  },
  watch: {
    color: () => {
      this.initImage()
    },
    stroke: () => {
      this.initImage()
    }
  },
  created() {
    this.initImage()
  },
  methods: {
    initImage() {
      if (this.color || this.stroke) {
        // 先获取svg源码字符串，替换 file="#ffff" stroke='#FFFFFF' 颜色这个属性，再将这个字符串转化为base64，达到修改颜色的目的
        wx.getFileSystemManager().readFile({
          filePath: this.src,
          encoding: 'binary',
          success: res => {
            let basestr = res.data
            if (this.color) {
              const strArr = basestr.split(/fill="#?[a-zA-Z0-9]{0,6}"/g)
              const oldcolorArr = basestr.match(/fill="#?[a-zA-Z0-9]{0,6}"/g)
              const newcolorArr = this.color
              for (let i = 0; i < oldcolorArr.length; i++) {
                const color = newcolorArr
                if (color) {
                  oldcolorArr[i] = `fill="${color}"`
                }
              }
              let str = ''
              for (let i = 0; i < strArr.length; i++) {
                str += (strArr[i] + (oldcolorArr[i] ? oldcolorArr[i] : ''))
              }
              basestr = str
            }
            if (this.stroke) {
              const strArr = basestr.split(/stroke="#?[a-zA-Z0-9]{0,6}"/g)
              const oldcolorArr = basestr.match(/stroke="#?[a-zA-Z0-9]{0,6}"/g)
              const newcolorArr = this.stroke.split(',')
              for (let i = 0; i < newcolorArr.length; i++) {
                const color = newcolorArr[i]
                if (color) {
                  oldcolorArr[i] = `stroke="${color}"`
                }
              }
              let str = ''
              for (let i = 0; i < strArr.length; i++) {
                str += (strArr[i] + (oldcolorArr[i] ? oldcolorArr[i] : ''))
              }
              basestr = str
            }
            const base64 = Base64.encode(basestr)
            this.imgurl = 'data:image/svg+xml;base64,' + base64
          },
          fail: error => {
            console.log('error', error)
          }
        })
      } else {
        this.imgurl = this.src
      }
    }
  }
}
</script>
<style scoped>
img {
  display: block;
}
</style>