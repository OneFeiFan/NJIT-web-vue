<template>
  <view class="my-swipe-item">
    <!-- 懒加载控制：只渲染当前页及左右各一页 -->
    <view v-if="shouldRender" class="my-swipe-item__content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-swipe-item',
  data() {
    return {
      shouldRender: false,
      parent: null
    };
  },
  mounted() {
    // 向上查找 my-swipe 父组件
    this.parent = this.findParent('my-swipe');
    if (this.parent) {
      this.parent.bind(this);
      this.checkRender();
    }
  },
  beforeDestroy() {
    if (this.parent) {
      this.parent.unbind(this);
    }
  },
  methods: {
    findParent(name) {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === name) return parent;
        parent = parent.$parent;
      }
      return null;
    },

    // 检查当前是否应该渲染内容
    checkRender() {
      if (!this.parent) return;

      const { active, items, loop } = this.parent;
      const count = items.length;
      const index = items.indexOf(this);

      // 异常保护：未找到索引或只有1张图时，直接渲染
      if (index < 0 || count <= 1) {
        this.shouldRender = true;
        return;
      }

      // 计算当前 item 距离 active item 的距离
      let distance = index - active;

      // 循环模式下的距离校正（例如：总数5，0到4的距离应该是-1，而不是-4）
      if (loop) {
        const half = count / 2;
        if (distance > half) distance -= count;
        if (distance < -half) distance += count;
      }

      // 策略：只保留当前页(0)和左右邻居(1, -1)
      this.shouldRender = Math.abs(distance) <= 1;
    }
  }
}
</script>

<style scoped>
.my-swipe-item {
  width: 100%;
  display: block;
}
.my-swipe-item__content {
  width: 100%;
  overflow: hidden; /* 防止内容溢出影响定位 */
}
</style>