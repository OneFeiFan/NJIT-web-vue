<template>
  <view :style="[theme,SXData]">
    <material-nav-bar background-color="var(--md-sys-color-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left" @click="back"/>
        <text class="title">学业进度</text>
        <uni-icons class="icon-right" color="var(--md-sys-color-on-primary)" size="" type="loop" @click="update(true)"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-table">
      <view class="content">
        <material-card :height="mx(28)"
                       backgroundColor="var(--md-sys-color-primary-container)"
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
          <material-card backgroundColor="var(--md-sys-color-primary-container)"
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
import {http} from "@/static/util/request";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {MaterialProgress, MaterialNavBar, MaterialCard, UniIcons, UPicker},
  data() {
    return {
      theme: {},
      datas: {},
    }
  },
  onLoad() {
    this.refreshTheme()
  },
  onReady() {
    this.update(false)
  },
  onShow() {
    this.theme = getTheme()
  },
  methods: {
    mx,
    refreshTheme() {
      this.theme = getTheme()
    },
    back() {
      uni.navigateBack();
    },
    update(forceRefresh) {
      if (forceRefresh) {
        uni.showLoading({
          title: '尝试刷新'
        });
      }

      http.post("/getAcademicProgress", {forceRefresh}).then(res => {
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '成功',
              duration: 2000
            });
          }, 500)
        }
        this.datas = res.data;
      }).catch(res => {
        console.log(res)
        if (forceRefresh) {
          setTimeout(() => {
            uni.showToast({
              title: '失败',
              icon: "error",
              duration: 2000
            });
          }, 500)
        }
      }).finally(() => {
        uni.hideLoading()
      })
    },
  }
}
</script>

<style lang="scss">
.scroll-table {
  height: calc(100vh - sx(15) - var(--status-bar-height));
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