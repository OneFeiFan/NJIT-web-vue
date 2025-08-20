<template>
  <view class="material-progress" :style="{
        '--primary-color': color,
        '--buffer-color': bufferColor}">
    <!-- 线性进度条保持不变 -->
    <view
        v-if="type === 'linear'"
        class="progress-linear"
        :class="{ indeterminate }"
        :style="{
          height: `${strokeWidth}px`
        }"
    >
      <view class="progress-linear__bar-container">
        <view
            class="progress-linear__bar"
            :class="{ 'progress-linear__primary-bar': indeterminate }"
            :style="!indeterminate && { transform: `scaleX(${modelValue / 100})` }"
        />
        <view class="progress-linear__buffer"/>
      </view>
    </view>

    <!-- 统一后的圆形进度条 -->
    <view
        v-else-if="type === 'circular'"
        class="progress-circular"
        :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
    >
      <svg
          class="progress-circular__svg"
          :class="{ indeterminate }"
          viewBox="0 0 100 100"
      >
        <circle
            class="progress-circular__track"
            cx="50"
            cy="50"
            :r="radius"
            fill="none"
            :stroke-width="strokeWidth"
        />
        <circle
            class="progress-circular__fill"
            :class="{ indeterminate }"
            cx="50"
            cy="50"
            :r="radius"
            fill="none"
            :stroke-width="strokeWidth"
            :stroke-dasharray="dashArray"
            :stroke-dashoffset="dashOffset"
            stroke-linecap="round"
        />
      </svg>
      <view v-if="showValue && !indeterminate" class="progress-circular__value">
        {{ modelValue }}%
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MaterialProgress',
  props: {
    type: {type: String, default: 'linear', validator: v => ['linear', 'circular'].includes(v)},
    modelValue: {type: Number, default: 0, validator: v => v >= 0 && v <= 100},
    indeterminate: {type: Boolean, default: false},
    color: {type: String, default: '#6200ee'},
    bufferColor: {type: String, default: '#e0e0e0'},
    strokeWidth: {type: Number, default: 4},
    size: {type: Number, default: 48},
    showValue: {type: Boolean, default: false}
  },
  computed: {
    radius() {
      return 50 - this.strokeWidth / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    dashOffset() {
      return this.indeterminate ? '' : this.circumference * (1 - this.modelValue / 100);
    },
    dashArray() {
      return this.indeterminate ? '' : this.circumference;
    }
  }
}
</script>

<style scoped lang="scss">
.material-progress {
  width: 100%;
}

/* 线性进度条样式保持不变 */
.progress-linear {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.progress-linear__bar-container {
  position: absolute;
  inset: 0;
}

.progress-linear__buffer {
  position: absolute;
  inset: 0;
  background-color: var(--buffer-color);
}

.progress-linear__bar {
  z-index: 1;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background-color: var(--primary-color);
  transition: transform 0.2s ease-out;
}

.progress-linear.indeterminate .progress-linear__primary-bar {
  animation: linear-indeterminate-primary 2s infinite linear;
}

@keyframes linear-indeterminate-primary {
  0% {
    transform: translateX(-100%) scaleX(0.4);
  }
  25% {
    transform: translateX(-50%) scaleX(0.6);
  }
  50% {
    transform: translateX(0%) scaleX(0.8);
  }
  60% {
    transform: translateX(50%) scaleX(0.4);
  }
  80% {
    transform: translateX(100%) scaleX(0.1);
  }
  100% {
    transform: translateX(140%) scaleX(0.05);
  }
}
/* 统一后的圆形进度条样式 */
.progress-circular {
  position: relative;
}

.progress-circular__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* 从12点方向开始 */
}

.progress-circular__track {
  stroke: var(--buffer-color);
}

.progress-circular__fill {
  stroke: var(--primary-color);
  transition: 0.3s ease;
}

.progress-circular__value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: var(--primary-color);
  font-weight: bold;
}



.progress-circular__svg.indeterminate {
  animation: circular-rotate 1.4s linear infinite;
}

.progress-circular__svg.indeterminate .progress-circular__fill {
  animation: circular-dash 1.4s ease-in-out infinite;

}

@keyframes circular-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes circular-dash {
  0% {
    stroke-dasharray: 0, 300; /* 起始点：短线段 */
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 180, 300; /* 中点：长线段 */
    stroke-dashoffset: -40; /* 调整偏移量 */
  }
  100% {
    stroke-dasharray: 180, 300; /* 保持长线段 */
    stroke-dashoffset: -288; /* 周长(2πr=301.6)减去dasharray总和(480)的负值 */
  }
}
</style>

