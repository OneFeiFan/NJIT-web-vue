<template>
  <touch-ripple
      class="card"
      :style="{height: height, width: width }"
      :color="color"
      :opacity="opacity"
      :duration="duration"
      :transition="transition"
      @click="handleClick"
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
    height: {
      type: String,
      default: "76px"
    },
    width: {
      type: String,
      default: "100%"
    },
    ...DEFAULT_RIPPLE_PROPS
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}

</script>

<style scoped lang="scss">
.card {
  background-color: #ffffff00;
  border-radius: sx(2);
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2),
  0 1px 18px rgba(0, 0, 0, 0.2),
  0 6px 10px rgba(0, 0, 0, 0.2);
}
</style>