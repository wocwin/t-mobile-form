<template>
  <div class="pathway" :class="customClass" :style="customStyle" @touchend="onEnd" id="pathway">
    <div class="tips">
      <div v-if="isOk" style="color: #FFFFFF;">验证通过</div>
      <div v-else>拖动滑块验证</div>
    </div>
    <div class="track" :style="trackStyle"></div>
    <!-- <movable-area>
      <movable-view
        :x="x"
        direction="horizontal"
        @touchend="onEnd"
        @change="onChange"
        :class="[isOk ? 'active':'']"
        id="track"
        :style="trackStyle"
      ></movable-view>
    </movable-area>-->
    <div class="movable-area" @touchstart="touchS" @touchmove="touchM">
      <div class="movable-view" :style="{left:del+'px'}" :class="[isOk ? 'active':'']" id="track"></div>
    </div>
    <div class="disabled" v-if="isOk"></div>
  </div>
</template>
<script>
export default {
  name: 'DhVerify',
  props: {
    customClass: {
      type: String,
      default: ''
    },
    customStyle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      clientX1: '', // 滑动开始位置
      clientX2: '',
      del: 0, // 内容初始的left距离
      // x: 0,
      // oldx: 0,
      isOk: false,
      size: {}
    }
  },
  computed: {
    trackStyle () {
      return `transform:translateX(${this.del}px)`
    }
  },
  mounted () {
    const query = wx.createSelectorQuery()
    query.select('#pathway').boundingClientRect()
    query.select('#track').boundingClientRect()
    query.exec((res) => {
      console.log(777, res)
      res.map(val => {
        if (val.id && val.id === 'pathway') {
          this.size.pathway = val.width
        }
        if (val.id && val.id === 'track') {
          this.size.track = val.width
        }
      })
    })
  },
  methods: {
    reset () {
      this.isOk = false
      this.del = 0
      // this.x = 0
    },
    touchS (e) {
      this.clientX1 = e.clientX
      // console.log('clientX1', this.clientX1)
    },
    touchM (e) {
      this.clientX2 = e.clientX
      // console.log('clientX2', this.clientX2)
      let disX = this.clientX2 - this.clientX1
      // console.log('disX', disX)
      // this.del = disX
      // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
      if (disX === 0 || disX < 0) {
        this.del = 0
      }
      if (disX <= (this.size.pathway - this.size.track)) {
        this.del = disX
      }
    },
    onChange (e) {
      // console.log(3333, e)
      // this.oldx = e.mp.detail.x
      // this.x = e.mp.detail.x
      // console.log(6666, e, this.oldx, this.x)
    },
    onEnd (e) {
      // console.log('停止', this.del, (this.size.pathway - this.size.track))
      if (this.isOk) {
        return
      }
      if ((this.del + 6) > (this.size.pathway - this.size.track)) {
        this.isOk = true
        this.$emit('result')
      } else {
        // this.x = 0
        this.del = 0
      }
    }
  }
}
</script>
<style lang="scss">
.pathway {
  height: 100rpx;
  width: 260px;
  background-color: #7ac23c;
  position: relative;
  overflow: hidden;
  .tips {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 100rpx;
    text-align: center;
    color: #666;
    font-size: 32rpx;
    z-index: 3;
  }
  .track {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #eee;
    width: 100%;
    height: 100%;
    padding-left: 0;
    box-sizing: content-box;
    transform: translateX(0);
  }
  .movable-area {
    position: relative;
    height: 50px;
    // position: absolute;
    // top: 0;
    // left: 0;
    // height: 100%;
    width: 100%;
    // background: none;
    z-index: 5;
    .movable-view {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100rpx;
      transition: left 0.3s ease-in-out;
      box-sizing: border-box;
      background-color: #fff;
      border: #ddd solid 1px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: auto 32rpx;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==');
      &.active {
        border: #7ac23c solid 1px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==');
      }
    }
  }
  .disabled {
    position: absolute;
    z-index: 10;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>