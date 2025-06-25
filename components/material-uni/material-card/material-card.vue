<template>
  <touch-ripple
      class="card"
      :style="{ 'background-color': backgroundColor, height: height, width: width }"
      :color="color"
      :opacity="opacity"
      :duration="duration"
      :transition="transition"
      @click="handleClick"
  >
    <slot></slot>
    <!-- <span class="icon-wrapper" v-if="$slots.iconRight">
      <slot name="iconRight"/>
    </span> -->
  </touch-ripple>
</template>

<script>
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import sx from "@/components/material-uni/sx.vue"

export default {
  mixins: [sx],
  name: "material-card",
  components: {
    sx,
    TouchRipple
  },
  props: {
    height: {
      type: String,
      default: "76px"
    },
    width: {
      type: String,
      default: "100vw"
    },
    backgroundColor: {
      type: String,
      default: "#fff"
    },
    color: {
      type: String,
      default: '#000'
    },
    opacity: {
      type: Number,
      default: 1
    },
    duration: {
      type: Number,
      default: 500
    },
    transition: {
      type: String,
      default: "ease"
    }
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