<template>
  <view style="height: 0; width: 0; position: absolute;" :prop='colors'
        :change:prop="renderScript.updateBodyColor">
    </view>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      colors: {}
    }
  },
  created() {
    this.colors = this.themeColors;
  }
}
</script>
<script module="renderScript" lang="renderjs">
export default {
  methods: {
    updateBodyColor(newValue, oldValue, ownerInstance, instance) {
      if (!newValue) return;
      // 也可以修改 html 根节点背景，防止下拉回弹露馅
      document.documentElement.style.backgroundColor = newValue['--md-sys-color-surface'];
    }
  }
}
</script>