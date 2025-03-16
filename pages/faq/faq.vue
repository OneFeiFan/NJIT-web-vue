<template>
  <view class="content">
    <view class="footer">
      <zero-markdown-view :markdown="content" themeColor="#000"></zero-markdown-view>
    </view>
  </view>
</template>

<script>


export default {
  data() {
    return {
      content:  `<p align="center">不晓得为啥,没获取到数据QAQ</p>`
    }
  },
  onLoad() {
    uni.request({
      url: "https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/markdown.json",
      header: {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Accept": "*/*",
        "Host": "gitee.com",
        "Connection": "keep-alive"
      },
      success: (res) => {
        if(res.statusCode === 200){
          this.content = `${res.data.FAQ}`;
        }
      }
    });
  },
  methods: {}
}
</script>

<style lang="scss">
.content {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 60rpx;
    margin-left: auto;
    margin-right: auto;

    .headimg {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
    }

    .des {
      margin-top: 20rpx;
      font-weight: bold;
    }

    .more {
      margin-top: 20rpx;
    }
  }

  .body {
    //margin-top: 50rpx;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .sketch {
      text-align: center;
    }
  }

}
</style>
