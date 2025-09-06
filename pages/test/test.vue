<template>
  <view>
    <ad-interstitial ref="adInterstitial" adpid="1565280816" :loadnext="false" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
      <view v-if="error">{{error}}</view>
    </ad-interstitial>
    <button type="primary" :disabled="isLoading" :loading="isLoading" @click="showAd">显示广告</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    showAd() {
      this.isLoading = true;
      this.$refs.adInterstitial.show();
    },
    onadload(e) {
      this.isLoading = false;
      console.log('广告数据加载成功');
    },
    onadclose(e) {
      // 用户点击了关闭广告
      console.log("onadclose",e);
    },
    onaderror(e) {
      // 广告加载失败
      console.log("onaderror: ", e.detail);
    }
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