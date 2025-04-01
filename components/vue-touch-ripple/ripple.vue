<template>
  <view
    class="ripple-item"
    @transitionstart="handleTransitionStart"
    @transitionend="handleTransitionEnd"
    :style="{
      opacity: opacity,
      top: `${top}px`,
      left: `${left}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: `scale(${scale})`,
      'z-index': 999,
      'background-color': color,
      'transition-property': 'transform, opacity',
      'transition-duration': `${duration}ms, 300ms`,
      'transition-timing-function': `${transition}, linear`
    }"
  ></view>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'RippleItem',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    opacity: {
      type: Number,
      required: true
    },
    transition: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      scale: 0,
      scaleTimer: null
    };
  },
  created() {
    console.log('created');
  },
  mounted() {
    console.log(this.id,this.size,this.top,this.left,this.color,this.opacity,this.transition,this.duration);
    this.scaleTimer = setTimeout(() => {
      this.scale = 1;
    }, 0);
  },
  beforeDestroy() {
    if (this.scaleTimer) {
      clearTimeout(this.scaleTimer);
      this.scaleTimer = null;
    }
  },
  methods: {
    handleTransitionStart() {
      console.log('transition start');
      this.$emit('start', this.id);
    },
    handleTransitionEnd() {
      console.log('transition end');
      this.$emit('end', this.id);
    }
  }
};
</script>

<style scoped>
/* 添加样式相关代码，如果有的话 */
.animation {
  animation: ripple 0.6s linear;
}

@keyframes ripple {
  from {
    transform: scale(0.0);
    opacity: 1;
  }

  to {
    transform: scale(2);
    /*因为涟漪的大小为标签的最长边，为了保证点击标签边缘时，涟漪也能覆盖整个标签，scale值最小应为2*/
    opacity: 0;
  }
}
</style>
