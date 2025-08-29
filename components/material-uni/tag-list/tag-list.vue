<template>
  <view class="tag-layout">
    <scroll-view scroll-x="true" :class="{'scroll': row}">
      <materialButton
          :color="color" :opacity="opacity" :transition="transition" :duration="duration" :backgroundColor="BackgroundColor(item)" :fontColor="fontColor"
          size="small"
          v-for="(item, index) in options"
          :key="index"
          class="box"
          :style="[tagStatus(item),{margin: `0 ${mx(6.5)} 0 ${index === 0 ? mx(6.5) : 0}`}]"
          :class="[item.disabled ? 'disabled-item' : '']"
          @click="onChange(item)"
      >
        <slot :item="item">
          {{ item.label }}
        </slot>
      </materialButton>
    </scroll-view>
  </view>
</template>

<script>
import materialButton from "@/components/material-uni/material-button/material-button.vue";
import {mx} from "@/components/material-uni/sx";
import {DEFAULT_RIPPLE_PROPS} from "@/components/material-uni/ripple/config";
export default {
  name: 'tag-list',
  components: {
    materialButton
  },
  props: {
    mult: {
      type: Boolean,
      default: false
    },
    row: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => [
        {
          label: '标签一',
          value: 0
        },
        {
          label: '标签三',
          value: 2
        },
        {
          label: '标签五',
          value: 4,
          disabled: true
        },
        {
          label: '标签六',
          value: 5
        },
      ]
    },
    activateStyle: {
      type: Object,
      default: () => ({
        background: '#3370FF',
        color: '#fff',
      })
    },
    initStyle: {
      type: Object,
      default: () => ({
        border: '0.25vmin solid #ffffff',
        background: '#ffffff',
        color: '#333333',
        borderRadius: '1vmin',
        padding: '1vmin 2vmin'
      })
    },
    limit: {
      type: Number,
      default: undefined
    },
    fontColor:{
      type: String,
      default: '#000'
    },
    ...DEFAULT_RIPPLE_PROPS
  },
  data() {
    return {
      selectedTagList: this.defaultValue,
    };
  },
  watch: {
    defaultValue(value) {
      this.selectedTagList = value;
    }
  },
  computed: {
    BackgroundColor() {
      return (item) => {
        return this.selectedTagList.includes(item.value) ? this.activateStyle.background : this.backgroundColor;
      }
    },
    tagStatus() {
      return (item) => {
        return this.selectedTagList.includes(item.value) ? this.activateStyle : '';
      };
    }
  },
  methods: {
    mx,
    onChange(data) {
      if (data.disabled) return;
      if (this.mult) {
        if (this.selectedTagList.some(elemt => elemt === data.value)) {
          const targetIndex = this.selectedTagList.findIndex((item) => item === data.value);
          this.selectedTagList.splice(targetIndex, 1);
        } else {
          if (this.selectedTagList.length >= this.limit) return;
          this.selectedTagList.push(data.value);
        }
      } else {
        this.selectedTagList = [data.value];
      }
      const res = this.options.filter((item) => this.selectedTagList.includes(item.value));
      this.$emit('changeSelect', res);
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll {
  white-space: nowrap;
  width: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tag-layout {
  display: flex;
  flex-wrap: wrap;

  .box {
    //&:first-child {
    //  margin-left: 5vmin;
    //}
  }
  .disabled-item {
    color: #999 !important;
  }
}
</style>
