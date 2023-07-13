<template>
  <div class="t_header">
    <div class="place-holder" :style="{ height: menuSettings.navBarHeight + 'px'}"></div>
    <nav-bar v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
import NavBar from './navigationBar'
export default {
  name: 'THeader',
  components: { NavBar },
  computed: {
    menuSettings() {
      return this.$store.getters.menuSettings
    }
  }
}
</script>

