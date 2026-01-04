<template>
  <touch-ripple :backgroundColor="backgroundColor" :color="color" :duration="duration" :opacity="opacity"
                :transition="transition" style="position: sticky;top:0; z-index: 5">
    <status-bar/>
    <App></App>
    <view class="nav-bar-container">
      <slot></slot>
    </view>
  </touch-ripple>
</template>
<script>
import TouchRipple from "../ripple/component.vue";
import StatusBar from "../status-bar/status-bar.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";
import App from "@/components/material-uni/material-test.vue";

export default {
  name: "material-nav-bar",
  components: {App, StatusBar, TouchRipple},
  props: {...DEFAULT_RIPPLE_PROPS}
}
</script>
<style scoped lang="scss">
.nav-bar-container {
  width: 100%;
  height: sx(15);
}
</style>