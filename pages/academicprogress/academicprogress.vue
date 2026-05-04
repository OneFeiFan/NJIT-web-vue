<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons class="icon-left" color="var(--md-sys-color-on-primary)" size="" type="left" @click="back"/>
        <text class="title">学业进度</text>
        <uni-icons class="icon-right" color="var(--md-sys-color-on-primary)" size="" type="loop" @click="update(true)"/>
      </view>
    </material-nav-bar>

    <scroll-view scroll-y="true" class="scroll-table">
      <view class="content">
        <material-card :height="mx(28)"
                       color="var(--md-sys-color-on-primary-container)"
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
          <material-card
              color="var(--md-sys-color-on-primary-container)"
              backgroundColor="var(--md-sys-color-primary-container)"
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
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import MaterialProgress from "@/components/material-uni/material-progress/material-progress.vue";
// #ifdef H5
import {http} from "@/static/util/request";
// #endif

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {MaterialProgress, MaterialNavBar, MaterialCard},
  data() {
    return {
      datas: {},
    }
  },
  onShow() {
	  this.update(false)
  },
  methods: {
    mx,
    back() {
      uni.navigateBack();
    },
    update(forceRefresh) {
      if (forceRefresh) {
        uni.showLoading({
          title: '尝试刷新'
        });
      }
      // #ifdef APP-PLUS
      this.$manager.getAcademicProgress(forceRefresh).then(res => {
		  if(res.code == 200){
			  if (forceRefresh) {
			    setTimeout(() => {
			      uni.showToast({
			        title: '成功',
			        duration: 2000
			      });
			    }, 500)
			  }
			  this.datas = res.data;
		  }else{
        console.log(res)
			  setTimeout(() => {
			    uni.showToast({
			      title: '失败',
			      icon: "error",
			      duration: 2000
			    });
			  }, 500)
		  }
      }).catch(res => {
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
      // #endif
      // #ifdef H5
      http.post("/getAcademicProgress", {forceRefresh}).then(res => {
		  if(res.code == 200){
			  if (forceRefresh) {
			    setTimeout(() => {
			      uni.showToast({
			        title: '成功',
			        duration: 2000
			      });
			    }, 500)
			  }
			  this.datas = res.data;
		  }else{
			  setTimeout(() => {
			    uni.showToast({
			      title: '失败',
			      icon: "error",
			      duration: 2000
			    });
			  }, 500)
		  }
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
      //#endif
    },
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  background-color: var(--md-sys-color-surface);
}
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