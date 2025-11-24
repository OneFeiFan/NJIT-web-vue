<template>
  <touch-ripple :backgroundColor="backgroundColor" :color="color" :duration="duration" :opacity="opacity"
                :transition="transition" style="position: sticky;top:0;">
    <status-bar :background-color="backgroundColor"/>
    <view class="nav-bar-container">
      <slot></slot>
    </view>
  </touch-ripple>
</template>
<script>
import TouchRipple from "../ripple/component.vue";
import StatusBar from "../status-bar/status-bar.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";

export default {
  name: "material-nav-bar",
  components: {StatusBar, TouchRipple},
  props: {...DEFAULT_RIPPLE_PROPS}
}
</script>
<style scoped lang="scss">
.nav-bar-container {
  width: 100%;
  //background-color: #ffffff00;
  height: sx(15);
}
</style>