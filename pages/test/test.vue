<template>
  <view style="height: 0;width: 0;position: absolute" :prop='themeColors'
        :change:prop="renderScript.updateBodyColor"/>
</template>
<script></script>
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