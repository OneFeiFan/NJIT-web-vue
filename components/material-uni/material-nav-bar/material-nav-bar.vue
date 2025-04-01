<template>
    <touch-ripple :color="color" :opacity="opacity" :duration="duration" :transition="transition">
      <status-bar :background-color="backgroundColor"/>
      <view class="nav-bar" :style="{'background-color': backgroundColor,'width': '100vw','height': '88rpx'}">
        <slot></slot>
      </view>
    </touch-ripple>
</template>
<script>
import TouchRipple from "../ripple/component.vue";
import StatusBar from "../status-bar/status-bar.vue";
export default {
  name: "material-nav-bar",
  components: {StatusBar,TouchRipple},
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
</style>