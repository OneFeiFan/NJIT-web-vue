<template>
  <page-meta :page-style="theme"></page-meta>
  <view class="container">
    <material-nav-bar id="nav-bar" color="var(--md-sys-color-primary-fixed)" :opacity="0.4" transition="ease-out" :duration="250"
                      backgroundColor="var(--md-sys-color-surface-container)">
      <view class="nav-bar">
        <uni-icons type="left" size="6vmin" @click="back" class="icon-left"/>
        <text class="title">设置</text>
        <uni-icons type="loop" size="6vmin" color="var(--md-sys-color-surface-container)" class="icon-right"/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <material-list>
        <material-list-cell rightIcon @click="jump(`widget`)" color="var(--md-sys-color-on-primary)"
                            :opacity="0.4" transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-primary-container)" fontColor="var(--md-sys-color-on-primary-container)">
          <text>小部件管理</text>
        </material-list-cell>
        <material-list-cell rightIcon @click="jump(`dev`)" color="var(--md-sys-color-on-primary)"
                            :opacity="0.4" transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-primary-container)" fontColor="var(--md-sys-color-on-primary-container)">
          <text>监督我开发</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`faq`)" color="var(--md-sys-color-on-primary)"
                            :opacity="0.4" transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-primary-container)" fontColor="var(--md-sys-color-on-primary-container)">
          <text>FAQ</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`privacy`)" color="var(--md-sys-color-on-primary)"
                            :opacity="0.4" transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-primary-container)" fontColor="var(--md-sys-color-on-primary-container)">
          <text>隐私政策</text>
        </material-list-cell>

        <material-list-cell rightIcon @click="jump(`about`)" color="var(--md-sys-color-on-primary)"
                            :opacity="0.4" transition="ease-out" :duration="250"
                            backgroundColor="var(--md-sys-color-primary-container)" fontColor="var(--md-sys-color-on-primary-container)">
          <text>关于</text>
        </material-list-cell>

      </material-list>
    </scroll-view>

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
    MaterialCard, UniTh, UniTd, UniTr, UniTable, StatusBar, UniNavBar, UniPopup, UniEasyinput, UniIcons},
  data() {
    return {
    }
  },
  created() {
    // #ifdef APP-PLUS

    // this.$manager.createWidget()
    // #endif
  },
  onLoad() {

  },
  onResize(){

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

  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-primary-container);
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

.scroll-table {
  height:  calc(100vh - var(--status-bar-height) - 10vmin);
  .color-red{
    color: red;
  }
}
</style>