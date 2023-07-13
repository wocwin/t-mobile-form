<template>
  <div v-show="show" class="tip-wrapper">{{message}}</div>
</template>

<script>
export default {
  name: 'tips',
  props: {
  },
  data () {
    return {
      message: '',
      show: false,
      timer: null
    }
  },
  mounted () {

  },
  methods: {
    showTip(msg, interval = 2000) {
      console.log('触发')
      this.show = true
      this.message = msg
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.show = false
        clearTimeout(this.timer)
        this.timer = null
      }, interval)
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
.tip-wrapper{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  min-width: 96px;
  max-width: 70vw;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color:white;
  text-align: center;
  border-radius: 8px;
  z-index: 9999;
}
</style>