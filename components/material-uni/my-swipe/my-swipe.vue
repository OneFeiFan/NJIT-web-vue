<template>
  <view class="my-swipe"
        :prop="wxsState"
        :change:prop="ui.updateState"
        @touchstart="ui.onTouchStart"
        @touchmove="ui.onTouchMove"
        @touchend="ui.onTouchEnd">
    <view class="my-swipe__track">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-swipe',
  props: {
    defaultIndex: { type: Number, default: 0 },
    duration: {type: Number, default: 300},
    loop: {type: Boolean, default: true}
  },
  data() {
    return {
      active: 0,
      count: 0
    };
  },
  computed: {
    wxsState() {
      return {active: this.active, count: this.count, loop: this.loop, duration: this.duration};
    }
  },
  watch: {
    defaultIndex: {
      immediate: true,
      handler(val) {
        this.active = val;
      }
    }
  },
  methods: {
    bind() {
      this.count++;
    },
    unbind() {
      this.count--;
    },
    onRenderChange(index) {
      this.active = index;
      this.$emit('change', index);
    }
  }
}
</script>

<script module="ui" lang="renderjs">
export default {
  data() {
    return {
      state: {},
      containerWidth: 0,
      startX: 0, startY: 0, deltaX: 0,
      swiping: false,
      cachedChildren: null
    }
  },
  methods: {
    updateState(newValue, oldValue) {
      if (oldValue && newValue.active === this.state.active && newValue.count === oldValue.count) return;
      if (!oldValue || newValue.count !== oldValue.count) this.cachedChildren = null;

      this.state = newValue;
      if (!this.containerWidth) this.containerWidth = this.$el.getBoundingClientRect().width || 0;
      this.renderItems(true);
    },

    renderItems(allowAnimation) {
      const { active, count, loop, duration } = this.state;
      if (!count || !this.containerWidth) return;

      if (!this.cachedChildren) {
        const track = this.$el.querySelector('.my-swipe__track');
        if (track) this.cachedChildren = track.children;
      }
      const children = this.cachedChildren;
      if (!children || children.length === 0) return;

      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        const isCurrent = (i === active);

        let offset = (i - active) * this.containerWidth;
        if (loop && count > 1) {
          const halfTotalWidth = (count / 2) * this.containerWidth;
          if (offset > halfTotalWidth) offset -= count * this.containerWidth;
          else if (offset < -halfTotalWidth) offset += count * this.containerWidth;
        }

        const x = offset + (this.swiping ? this.deltaX : 0);

        if (!this.swiping) {
          item.style.position = isCurrent ? 'relative' : 'absolute';
          item.style.zIndex = isCurrent ? 1 : 0;
        }

        item.style.transition = (this.swiping || !allowAnimation) ? 'none' : `transform ${duration}ms ease-out`;
        item.style.transform = `translate3d(${x}px, 0, 0)`;
        item.style.visibility = Math.abs(x) <= this.containerWidth ? 'visible' : 'hidden';
      }
    },

    onTouchStart(event) {
      if (this.state.count <= 1) return;
      this.swiping = true;
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.containerWidth = this.$el.getBoundingClientRect().width;
      this.deltaX = 0;
      this.renderItems(false);
    },

    onTouchMove(event) {
      if (!this.swiping) return;
      const dx = event.touches[0].clientX - this.startX;
      if (Math.abs(event.touches[0].clientY - this.startY) > Math.abs(dx)) return;

      event.preventDefault();
      this.deltaX = dx;
      this.renderItems(false);
    },

    onTouchEnd(event, ownerInstance) {
      if (!this.swiping) return;
      this.swiping = false;

      const dx = event.changedTouches[0].clientX - this.startX;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.changedTouches[0].clientY - this.startY)) {
        let nextIndex = this.state.active + (dx > 0 ? -1 : 1);
        const max = this.state.count - 1;

        if (this.state.loop) nextIndex = nextIndex < 0 ? max : (nextIndex > max ? 0 : nextIndex);
        else nextIndex = Math.max(0, Math.min(next, max));

        this.state.active = nextIndex;
        ownerInstance.callMethod('onRenderChange', nextIndex);
      }

      this.deltaX = 0;
      this.renderItems(true);
    }
  }
}
</script>

<style scoped>
.my-swipe {
  display: flex;
  position: relative;
  width: 100%;
  transition: height 0.3s ease-out;
  overflow: hidden;
}
.my-swipe__track {
  display: flex;
  width: 100%;
  position: relative;
}
</style>