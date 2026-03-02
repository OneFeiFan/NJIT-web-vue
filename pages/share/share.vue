<template>
  <view class="container" :style="themeStyle">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-primary)" size="" type="left" @click="back"
                   class="icon-left"/>
        <text class="title">分享软件</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <view class="wrap app-is-resizing">
      <material-card color="var(--md-sys-color-on-primary-container">
      <view class="content">
        <view class="text-area">
          觉得软件实用的话可以和同学分享一下
        </view>
        <image class="share-img" mode="widthFix" src="@/static/qq.png"/>
      </view>
    </material-card>
    </view>
  </view>
</template>

<script>
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {SXData} from "@/components/material-uni/sx";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialNavBar, MaterialCard
  },
  data() {
    return {
    }
  },
  onShow() {
  },
  onLoad() {
  },
  methods: {
    back() {
      uni.navigateBack();
    },
  }
}
</script>

<style lang="scss">
.container {
  background-color: var(--md-sys-color-surface);
  height: 100vh;
}

.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - var(--status-bar-height) - sx(15));

  .content {
    font-size: sx(5);
    box-sizing: border-box;
    display: flex;

  }
}

@media (orientation: portrait) {
  .content {
    width: sx(95);
    padding: sx(5);
    flex-direction: column;

    .share-img {
      width: 100%;
      margin-top: sx(2);
    }
  }
}

@media (orientation: landscape) {
    .content {
      width: sx(90);
      align-items: center;
      padding: sx(5) sx(5) sx(5) sx(0);

      .text-area {
        flex: 0.3;
        display: flex;
        justify-content: center;
        align-items: center;
        writing-mode: tb;

      }

      .share-img {
        flex: 0.7;
        //margin-left: sx(2);
      }
    }
}
</style>