<script>
export default {
  name: "sx",
  data() {
    return {
      baseRatio:1,
      styles: "--base-ratio: 1;",
    }
  },
  created() {
    uni.onWindowResize(this.refresh)
    this.refresh();
  },
  computed: {
    mx() {
      return (value) => {
        return this.baseRatio * value + 'px';
      };
    }
  },
  methods: {
    refresh() {
      const {height, width} = uni.getSystemInfoSync().safeArea;
      this.baseRatio = Math.sqrt(width + height)/10;
      this.styles = `--base-ratio:${this.baseRatio}`;
      console.log(this.styles);
    },
    handleClick(){
      this.$emit('click');
    }
  }
}
</script>

<template>
<view :style="styles" @click="handleClick">
  <slot>

  </slot>
</view>
</template>

<style lang="scss">

</style>