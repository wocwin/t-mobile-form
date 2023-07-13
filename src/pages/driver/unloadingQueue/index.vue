<template>
  <div class="unloading-queue">
    <t-header title="卸货排队" />
    <scroll-view scroll-y class="content">内容....</scroll-view>
  </div>
</template>

<script>
export default {
  name: 'UnloadingQueue',
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
        console.log('卸货排队--调用初始化接口')
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
.unloading-queue {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  overflow-x: hidden;
}
</style>
