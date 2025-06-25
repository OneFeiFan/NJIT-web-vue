<template>
  <touch-ripple
    class="md-button"
    :class="[`md-${type}`, `md-${shape}`, `md-${size}`]"
    :disabled="disabled"
    :style="{color: fontColor }"
    :color="color"
    :opacity="opacity"
    :duration="duration"
    :transition="transition"
    :background-color="backgroundColor"
    @click="handleClick"
  >
    <slot></slot>
  </touch-ripple>
</template>

<script>
import TouchRipple from "@/components/material-uni/ripple/component.vue";
import sx from "@/components/material-uni/sx.vue";

export default {
  name: "material-button",
  components: {
    sx,
    TouchRipple
  },
  props: {
    type: {
      type: String,
      default: "filled", // filled | outlined | text | elevated | tonal
      validator: (value) => ['filled', 'outlined', 'text', 'elevated', 'tonal'].includes(value)
    },
    shape: {
      type: String,
      default: "pill", // pill | square
      validator: (value) => ['pill', 'square'].includes(value)
    },
    size: {
      type: String,
      default: "medium", // small | medium | large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "#6750A4"
    },
    fontColor: {
      type: String,
      default: "#FFFFFF"
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
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        console.warn('Button is disabled, click event ignored.');
        return;
      }
      this.$emit('click');
    }
  }
}
</script>

<style scoped lang="scss">
.md-button {
  // 基础变量
  --md-primary-color: #6750A4;
  --md-on-primary: #FFFFFF;
  $md-container-height: sx(12);
  --md-state-layer-opacity: 0;

  background-color: #ffffff00;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  // 形状控制
  &.md-pill {
    border-radius: 999px;
  }
  &.md-square {
    border-radius: 8px;
  }

  // 尺寸控制
  &.md-small {
    padding: 0 sx(3);
    height: calc($md-container-height * 0.75);
    font-size: sx(4);
  }
  &.md-medium {
    padding: 0 24px;
    height: var($md-container-height);
    font-size: 16px;
  }
  &.md-large {
    padding: 0 32px;
    height: calc($md-container-height * 1.25);
    font-size: 18px;
  }

  // 按钮类型
  &.md-filled {
    // 这里可以添加特定类型的样式，如果有的话
  }

  &.md-outlined {
    background: transparent;
    border: 1px solid var(--md-outline-color, #79747E);
  }

  &.md-text {
    background: transparent;
  }

  // 禁用状态
  &[disabled] {
    opacity: 0.38;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.icon-wrapper {
  display: inline-flex;
  font-size: 1.2em;
}
</style>
