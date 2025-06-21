<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <material-nav-bar id="nav-bar" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out"
                      :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="left" size="6vmin" @click="back" class="icon-left"/>
        <text class="title">小部件管理</text>
        <uni-icons type="loop" size="6vmin" color="var(--md-sys-color-surface-container)" class="icon-right"/>
      </view>
    </material-nav-bar>
    <material-list>
      <material-list-cell :rightIcon="false" :showLeftText="false" color="var(--md-sys-color-on-primary)"
                          :opacity="0.4" transition="ease-out" :duration="250"
                          backgroundColor="var(--md-sys-color-primary-container)">
        <view class="content">

          <text>开启小部件</text>
          <switch :checked="hasWidget" @change="switchChange"/>
        </view>

      </material-list-cell>
    </material-list>
    <view class="tips">
      <text>
        为什么没法自动开启小部件？
        <br>
        厂商限制，小米系统需要手动授予桌面快捷方式权限。其他系统请自行尝试。也可以在桌面手动创建小部件。
        <br>
        <uni-link href="https://www.baidu.cn" text="手动创建教程：点这儿"></uni-link>
      </text>
    </view>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import getCurriculumByUsernameAndPassword, {getClassroom, getScores} from "@/static/util/tool";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import StatusBar from "@/components/status-bar/status-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import MaterialList from "@/components/material-uni/material-list/material-list.vue";
import MaterialListCell from "@/components/material-uni/material-list-cell/material-list-cell.vue";

export default {
  components: {
    MaterialListCell, MaterialList,
    MaterialNavBar,
    MaterialCard, UniTh, UniTd, UniTr, UniTable, StatusBar, UniNavBar, UniPopup, UniEasyinput, UniIcons
  },
  data() {
    return {
      hasWidget: false,
    }
  },
  onShow() {
    // #ifdef APP-PLUS
    this.hasWidget = this.$manager.isWidgetAlreadyCreated()
    // #endif
  },
  onLoad() {

  },
  onResize() {

  },
  onReady() {

  },
  methods: {
    jump(page) {
      // this.isDrawerOpen = false;
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    },
    back() {
      uni.navigateBack();
    },
    switchChange(e) {
      console.log(e.detail.value)
      if (e.detail.value) {
        // #ifdef APP-PLUS

        let res = this.$manager.createWidget()
        let value = JSON.parse(res)
        if (value.state === "error") {
          uni.showModal({
            title: '异常',
            showCancel: false,
            content: value.message,
            success: (res) => {

            }
          });
        } else if (value.state === "success") {
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: value.message,
            success: (res) => {
              this.$manager.goHome()
            }
          });
        } else if (value.state === "need_permission") {
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: "当前系统大概率为小米系统，需要手动授予桌面快捷方式权限，请授权后重试？",
            success: (res) => {
              this.$manager.getWidgetPermission()
            }
          });
        }

        // #endif
      } else {
        uni.showModal({
          title: '提示',
          showCancel: false,
          content: "安卓没有自动删除小部件的功能，请手动删除小部件。",
          success: (res) => {
            this.$manager.goHome()
          }
        });
      }
      this.hasWidget = e.detail.value;
    }
  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-primary-container);
  height: 100vh;
}

.nav-bar {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 6vmin;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }


  .title {
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 5vmin;
    color: var(--md-sys-color-on-surface);
  }
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: 5vmin;
  margin-right: 5vmin;
  font-size: 4vmin;
  color: var(--md-sys-color-on-primary-container);
}
.tips{
  margin-top: 5vmin;
  margin-left: 5vmin;
  margin-right: 5vmin;
  font-size: 3vmin;
  color: var(--md-sys-color-on-tertiary-container);
}

</style>