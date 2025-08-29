<template>
  <view :style="[theme,SXData]">
    <material-nav-bar>
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" color="var(--md-sys-color-on-secondary-container)" class="icon-left"/>
        <text class="title">学业进度</text>
        <uni-icons type="loop" size="" @click="update(true)" color="var(--md-sys-color-on-secondary-container)" class="icon-right"/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <view class="content">
      <material-card width="100%" :height="mx(28)" color="var(--md-sys-color-on-primary)"
                     :backgroundColor="'var(--md-sys-color-primary-container)'"
                     @click="">
        <view class="card-content">
          <view class="name">
            注意
          </view>
          <view class="score">
            在官方页面，学业进度数据便就是仅供参考的，有些课程不存在或者不用学习，所以某些大类进度不会到100%
          </view>
        </view>
      </material-card>
      </view>
      <slot v-for="(item, index) in datas">

        <view class="content">
          <material-card width="100%" color="var(--md-sys-color-on-primary)"
                         :backgroundColor="'var(--md-sys-color-primary-container)'"
                         @click="">
            <view class="card-content">
              <view class="name">
                {{ index }}
              </view>
              <view class="score">
                {{ Math.round(item.completed / item.total * 100) }}
              </view>
              <view class="progress">
                <material-progress type="linear" :model-value="Math.round(item.completed/item.total*100)"
                                   buffer-color="var(--md-sys-color-surface-container)"
                                   color="var(--md-sys-color-on-primary-container)"/>
              </view>

            </view>
          </material-card>
        </view>

      </slot>

    </scroll-view>
  </view>
</template>

<script>
import UPicker from "@/uni_modules/uview-ui/components/u-picker/u-picker.vue";
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {getTheme} from "@/components/material-uni/colors";
import {mx, SXData} from "@/components/material-uni/sx";
import MaterialProgress from "@/components/material-uni/material-progress/material-progress.vue";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {MaterialProgress, MaterialNavBar, MaterialCard, UniIcons, UPicker},
  data() {
    return {
      theme:{},
      datas: {},
    }
  },
  onReady() {
    this.update(false)
  },
  onShow() {
    this.theme = getTheme()
    // #ifdef H5
    this.datas = {
      "独立设课实验": {"total": 2, "name": "独立设课实验", "completed": 2},
      "跨专业选修课程": {"total": 2, "name": "跨专业选修课程", "completed": 2},
      "素质教育课程": {"total": 5, "name": "素质教育课程", "completed": 4},
      "专业选修课程": {"total": 12, "name": "专业选修课程", "completed": 3},
      "通识与公共基础课程": {"total": 24, "name": "通识与公共基础课程", "completed": 19},
      "公共基础实践": {"total": 2, "name": "公共基础实践", "completed": 1},
      "专业基础课程": {"total": 9, "name": "专业基础课程", "completed": 9},
      "课程设计": {"total": 4, "name": "课程设计", "completed": 4},
      "大学外语类课程": {"total": 6, "name": "大学外语类课程", "completed": 6},
      "毕业设计": {"total": 1, "name": "毕业设计", "completed": 0},
      "项目训练": {"total": 3, "name": "项目训练", "completed": 3},
      "实习教学": {"total": 2, "name": "实习教学", "completed": 1},
      "劳动教育课程": {"total": 2, "name": "劳动教育课程", "completed": 2},
      "专业课": {"total": 6, "name": "专业课", "completed": 6},
      "工程技术基础课程": {"total": 2, "name": "工程技术基础课程", "completed": 2},
      "公共选修课": {"total": 1, "name": "公共选修课", "completed": 1}
    }
    // #endif
  },
  methods: {
    mx,
    getTheme,
    back() {
      uni.navigateBack();
    },
    update(refresh) {
      uni.showToast({
        title: '尝试刷新',
        icon: 'loading',
        duration: 1000
      });

      this.$manager.getAcademicProgress(refresh).then(res => {
        let value = JSON.parse(res)
        console.log(value)
        this.datas = value
      }).catch(res => {
        console.log(res)
      })
    },
  }
}
</script>

<style lang="scss">
.scroll-table {
  height: calc(100vh - sx(10) - var(--status-bar-height));
}

.content {
  padding-left: sx(2.5);
  padding-right: sx(2.5);
  margin-top: sx(2.5);

  .card-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    color: var(--md-sys-color-on-primary-container);
    padding: sx(2.5);

    .time {
      display: flex;
      justify-content: space-between;
      font-size: sx(6.5);
      font-weight: bold;
    }

    .name {
      font-size: sx(4.5);
      font-weight: bold;
      //display: inline-block;
      //white-space: nowrap;
      //width: 100%;
      //overflow: hidden;
      //text-overflow: ellipsis;
    }

    .score {
      font-weight: bold;
    }

    .progress {
      display: flex;
    }

    .teacher {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>