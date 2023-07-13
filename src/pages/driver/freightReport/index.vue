<template>
  <div class="freight-report">
    <t-header title="货运上报" />
    <scroll-view scroll-y class="content">内容....</scroll-view>
  </div>
</template>

<script>
export default {
  name: 'FreightReport',
  props: {
    show: Boolean
  },
  data() {
    return {
    }
  },
  watch: {
    show: (n) => {
      if (n) {
        console.log('货运上报--调用初始化接口')
      }
    }
  },
  computed: {
  },
  onLoad(option) {
  },
  onShow() {
  },
  methods: {
  }

}
</script>

<style lang="scss">
.freight-report {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  overflow-x: hidden;
}
</style>
