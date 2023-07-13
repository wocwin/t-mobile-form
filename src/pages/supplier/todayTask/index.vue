<template>
  <div class="today-task">
    <t-header title="今天任务" />
    <scroll-view scroll-y class="content">内容....</scroll-view>
  </div>
</template>

<script>
export default {
  name: 'TodayTask',
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
        console.log('今天任务--调用初始化接口')
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
.today-task {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  overflow-x: hidden;
}
</style>
