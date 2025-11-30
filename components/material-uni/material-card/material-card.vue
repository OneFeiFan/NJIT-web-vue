<template>
  <view class="card-wrapper">
    <view class="physical-shadow shadow-1"/>
    <view class="physical-shadow shadow-2"/>
    <view class="physical-shadow shadow-3"/>
    <touch-ripple
        class="card-content"
        :color="color"
        :opacity="opacity"
        :duration="duration"
        :transition="transition"
        :backgroundColor="backgroundColor"
    >
      <slot></slot>
    </touch-ripple>
  </view>
</template>

<script>
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";

export default {
  name: "material-card",
  components: {
    TouchRipple
  },
  props: {
    width: {
      type: String,
      default: "100%"
    },
    ...DEFAULT_RIPPLE_PROPS
  }
}
</script>

<style scoped lang="scss">
.card-wrapper {
  position: relative;
}

.physical-shadow {
  position: absolute;
  inset: 0; // 替代 width/height: 100%
  border-radius: sx(2);
  background: var(--md-sys-color-outline);
  pointer-events: none;
  z-index: 0;
}

.shadow-1 {
  opacity: 0.25;
  filter: blur(sx(0.75));
  transform: translate(sx(0.25), sx(0.75));
}

.shadow-2 {
  opacity: 0.14;
  filter: blur(sx(2));
  transform: translate(sx(0.5), sx(1.7));
}

.shadow-3 {
  opacity: 0.12;
  filter: blur(sx(3.5));
  transform: translate(sx(0.5), sx(1.7));
}

.card-content {
  width: 100%;
  border-radius: sx(2);
  z-index: 1; // 放在上层
}
</style>