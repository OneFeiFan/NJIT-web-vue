<template>
  <view :style="{'background-color': '#ffffff00','width': '100vw','height': 'var(--status-bar-height)'}">
    <!-- 这里是状态栏占位 -->
  </view>
</template>
<script>
export default {
  name: "status-bar",
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    }
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