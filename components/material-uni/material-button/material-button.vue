<template>
  <touch-ripple
      :class="rootClasses"
      :color="effectiveRippleColor"
      :disabled="disabled"
      :style="cssVariables"
      :opacity="opacity"
      :duration="duration"
      :transition="transition"
      :background-color="backgroundColor"
      class="md-btn-host"
      @click="handleClick"
  >
    <!-- 增加 view 确保内部内容绝对居中 -->
    <view class="md-btn-content">
      <slot></slot>
    </view>
  </touch-ripple>
</template>

<script>
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";
import {mx} from "@/components/material-uni/sx";

export default {
  name: "material-button",
  components: {TouchRipple},
  props: {
    type: {
      type: String,
      default: "filled",
      validator: (v) => ['filled', 'outlined', 'text', 'elevated', 'tonal'].includes(v)
    },
    shape: {
      type: String,
      default: "pill",
      // pill: 胶囊(默认) | rounded: 圆角方(1:1,带阴影) | square: 直角/微圆角(自适应宽)
      validator: (v) => ['pill', 'rounded', 'square'].includes(v)
    },
    size: {
      type: String,
      default: "medium",
    },
    // 动态样式 Props
    backgroundColor: String,
    fontColor: {type: String, default: "#FFFFFF"},
    outlineColor: {type: String, default: '#79747E'},
    outlineWidth: {type: String, default: '1px'},
    disabled: Boolean,
    ...DEFAULT_RIPPLE_PROPS
  },
  computed: {
    rootClasses() {
      return [
        `type-${this.type}`,
        `shape-${this.shape}`,
        `size-${this.size}`,
        {'is-disabled': this.disabled}
      ];
    },
    effectiveRippleColor() {
      return this.disabled ? 'transparent' : this.color;
    },
    cssVariables() {
      const sizeMap = {
        // px仅用于非1:1的按钮(pill/square)
        small: {h: mx(8), px: mx(2.5), fz: mx(3.5)},
        medium: {h: mx(12), px: mx(5.5), fz: mx(4.5)},
        large: {h: mx(16), px: mx(7.5), fz: mx(6)}
      };

      const s = sizeMap[this.size];

      return {
        '--btn-bg-custom': this.backgroundColor,
        '--btn-color-custom': this.fontColor,
        '--btn-border-color': this.outlineColor,
        '--btn-border-width': this.outlineWidth,
        '--btn-h': s.h,
        '--btn-px': s.px,
        '--btn-fz': s.fz
      };
    }
  },
  methods: {
    handleClick(e) {
      if (!this.disabled) this.$emit('click', e);
    }
  }
}
</script>

<style scoped lang="scss">
// 1. 宿主容器
.md-btn-host {
  display: inline-flex; // 必须是 flex
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中

  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  height: var(--btn-h);
  font-size: var(--btn-fz);
  border: none;

  // 避免行高导致偏移
  line-height: 1;
}

// 2. 内容容器 (修复居中问题的关键)
.md-btn-content {
  width: 100%;
  height: 100%;

  display: flex; // 内部也必须 Flex
  align-items: center; // 垂直绝对居中
  justify-content: center; // 水平绝对居中

  gap: sx(2); // 图标和文字间距
}

// === 形状 (Shape) ===

// 1. 胶囊形 (Pill) - 宽度自适应
.shape-pill {
  border-radius: 999px;
  padding: 0 var(--btn-px);
  min-width: sx(10);
}

// 2. 直角/微圆角 (Square) - 宽度自适应 (不强制1:1)
.shape-square {
  border-radius: 4px;
  padding: 0 var(--btn-px);
  min-width: sx(10);
}

// 3. 圆角方形 (Rounded) - 强制 1:1
.shape-rounded {
  // 宽度 = 高度 = 变量
  width: var(--btn-h);
  padding: 0; // 1:1 不需要 padding

  // MD3 风格圆角
  border-radius: sx(3.5);

  // 你指定的阴影
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


// === 类型 (Type) ===
.type-filled {
  background-color: var(--btn-bg-custom, var(--md-sys-color-primary, #6750A4));
  color: var(--btn-color-custom, var(--md-sys-color-on-primary, #FFFFFF));
}

.type-outlined {
  background-color: transparent;
  color: var(--btn-color-custom, var(--btn-border-color));
  border: var(--btn-border-width) solid var(--btn-border-color);
  box-shadow: none !important;
}

.type-text {
  background-color: transparent;
  color: var(--btn-color-custom, var(--md-sys-color-primary, #6750A4));
  box-shadow: none !important;

  // 特殊处理：如果是 1:1 按钮使用 text 模式，不需要 padding，否则需要
  &:not(.shape-rounded) {
    padding: 0 calc(var(--btn-px) - 4px);
  }
}

.type-elevated {
  background-color: var(--md-surface-container-low, #F7F2FA);
  color: var(--md-primary, #6750A4);
  // 如果不是 rounded (rounded 有自己的强阴影)，则使用默认 elevated 阴影
  &:not(.shape-rounded) {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  }
}

.type-tonal {
  background-color: var(--md-secondary-container, #E8DEF8);
  color: var(--md-on-secondary-container, #1D192B);
}

// === 状态 (Disabled) ===
.is-disabled {
  opacity: 0.38;
  pointer-events: none;
  cursor: not-allowed;
  box-shadow: none !important;

  &.type-filled, &.type-tonal, &.type-elevated {
    background-color: rgba(0, 0, 0, 0.12) !important;
    color: rgba(0, 0, 0, 0.38) !important;
  }

  &.type-outlined {
    border-color: rgba(0, 0, 0, 0.12) !important;
    color: rgba(0, 0, 0, 0.38) !important;
  }
}
</style>