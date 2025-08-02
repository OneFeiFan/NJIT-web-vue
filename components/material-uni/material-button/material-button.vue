<template>
  <touch-ripple
      class="md-button"
      :class="[`md-${type}`, `md-${shape}`, `md-${size}`]"
      :disabled="disabled"
      :style="dynamicStyle"
      :color="effectiveColor"
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
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";
import {mx} from "@/components/material-uni/sx";

export default {
  name: "material-button",
  components: {
    TouchRipple
  },
  props: {
    type: {
      type: String,
      default: "filled",
      validator: (value) => ['filled', 'outlined', 'text', 'elevated', 'tonal'].includes(value)
    },
    shape: {
      type: String,
      default: "pill",
      validator: (value) => ['pill', 'square'].includes(value)
    },
    size: {
      type: String,
      default: "medium",
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    outlineColor: {
      type: String,
      default: '#79747E'
    },
    outlineWidth: {
      type: String,
      default: '1px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fontColor: {
      type: String,
      default: "#FFFFFF"
    },
    ...DEFAULT_RIPPLE_PROPS
  },
  computed: {
    effectiveColor() {
      return this.disabled ? 'rgba(0,0,0,0)' : this.color;
    },
    dynamicStyle() {
      const baseStyle = {
        color: this.fontColor,
        '--md-primary-color': this.backgroundColor,
        '--md-on-primary': '#FFFFFF',
        '--md-state-layer-opacity': 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
      };

      // 形状样式
      const shapeStyle = this.shape === 'pill'
          ? { borderRadius: '999px' }
          : { borderRadius: '8px' };

      // 尺寸样式
      const sizeStyle = {
        small: {
          padding: `0 ${mx(3)}`,
          height: `calc(${mx(12)} * 0.75)`,
          fontSize: mx(4)
        },
        medium: {
          padding: `0 ${mx(5)}`,
          height: mx(12),
          fontSize: mx(6)
        },
        large: {
          padding: `0 ${mx(7)}`,
          height: `calc(${mx(12)} * 1.25)`,
          fontSize: mx(8)
        }
      }[this.size];

      // 按钮类型样式
      const typeStyle = {
        filled: {
          backgroundColor: this.backgroundColor,
          color: this.fontColor,
          // boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
        },
        outlined: {
          background: 'transparent',
          border: `${this.outlineWidth} solid ${this.outlineColor}`,
          color: this.fontColor
        },
        text: {
          background: 'transparent',
          color: this.fontColor
        },
        elevated: {
          backgroundColor: 'var(--md-surface-container-low)',
          color: 'var(--md-primary)',
          // boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
        },
        tonal: {
          backgroundColor: 'var(--md-secondary-container)',
          color: 'var(--md-on-secondary-container)'
        }
      }[this.type];

      // 禁用状态
      const disabledStyle = this.disabled ? {
        opacity: 0.38,
        cursor: 'not-allowed',
        boxShadow: 'none'
      } : {};

      return {
        ...baseStyle,
        ...shapeStyle,
        ...sizeStyle,
        ...typeStyle,
        ...disabledStyle
      };
    }
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
</style>
