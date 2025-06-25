<template>
  <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition" :backgroundColor="backgroundColor">
    <status-bar :background-color="backgroundColor"/>
    <view class="nav-bar-container" :style="{'width': '100vw'}">
      <slot></slot>
    </view>
  </touch-ripple>
</template>
<script>
import TouchRipple from "../ripple/component.vue";
import StatusBar from "../status-bar/status-bar.vue";

export default {
  name: "material-nav-bar",
  components: {StatusBar, TouchRipple},
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#000'
    },
    opacity: {
      type: Number,
      default: "1"
    },
    duration: {
      type: Number,
      default: "500"
    },
    transition: {
      type: String,
      default: "ease"
    },
  },

  // data() {
  //   return {
  //     backgroundColor: this.backgroundColor
  //   }
  // }
}
</script>
<style scoped lang="scss">
.nav-bar-container {
  background-color: #ffffff00;
  height: sx(10);
}
</style>