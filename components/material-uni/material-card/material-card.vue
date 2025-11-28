<template>
  <touch-ripple
      class="card"
      :color="color"
      :opacity="opacity"
      :duration="duration"
      :transition="transition"
      :backgroundColor="backgroundColor"
  >
    <slot></slot>
  </touch-ripple>
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
  },
  methods: {
    // handleClick(e) {
    //   this.$emit('click', e);
    // }
  }
}

</script>

<style scoped lang="scss">
.card {
  width: 100%;
  //background-color: #ffffff00;
  border-radius: sx(2);
  box-shadow: 0 3px 5px -1px color-mix(in srgb, var(--md-sys-color-outline), transparent 80%),
  0 6px 10px 0 color-mix(in srgb, var(--md-sys-color-outline), transparent 86%),
  0 1px 18px 0 color-mix(in srgb, var(--md-sys-color-outline), transparent 88%);
}
</style>