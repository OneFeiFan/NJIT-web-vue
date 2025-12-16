<template>
  <view class="container" :style="themeStyle+SXData">
    <material-nav-bar background-color="var(--md-sys-color-primary)" color="var(--md-sys-color-on-primary)">
      <view class="nav-bar">
        <uni-icons color="var(--md-sys-color-on-primary)" size="" type="left" @click="back"
                   class="icon-left"/>
        <text class="title">分享软件</text>
        <uni-icons class="icon-right" color="#00000000" size="" type="loop" @click=""/>
      </view>
    </material-nav-bar>

    <view class="wrap" >
    <material-card class="card" color="var(--md-sys-color-on-primary-container">
      <view class="content">
        <view class="text-area">
          觉得软件实用的话可以和同学分享一下哦。
        </view>
        <image class="share-img" mode="widthFix" src="@/static/qq.jpg"/>
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
}

.card {
  font-size: sx(5);
  box-sizing: border-box;

  .content {
    padding: sx(5);
  }
}

@media (orientation: portrait) {
  .card {
    --test: 0px;
    $width: calc((90vw + sx(90)) / 2);
    max-width: calc(100vw - sx(15) - var(--test));
    width: $width;
  }
  .share-img {
    width: 100%;
    margin-top: sx(2);
  }
}

/* 横屏适配 */
@media screen and (orientation: landscape) {
  .card {
    $height: calc((100vh - sx(30) - var(--status-bar-height) + sx(90)) / 2);
    max-width: calc(100 / 80 * #{$height});
    width: calc(100 / 80 * #{$height});

    .content {
      display: flex;
    }
  }
  .text-area {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .share-img {
    flex: 2.5;
    margin-top: 0;
  }
}
</style>