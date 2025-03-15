<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 获取当前app的版本
    const systemInfo = uni.getSystemInfoSync();
// 应用程序版本号
// 条件编译，只在APP渲染
// #ifdef APP
    let version_number = systemInfo.appWgtVersion;
    uni.request({
      url: 'https://gitee.com/OneFeiFan/fxxking-NJIT/raw/master/version.json',
      header: {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Accept": "*/*",
        "Host": "gitee.com",
        "Connection": "keep-alive"
      },
      success: (res) => {
        let data = res.data;
        if(version_number !== data.version){
          let url = `https://gitee.com/OneFeiFan/fxxking-NJIT/releases/download/v${data.version}/${data.version}.apk`
          console.log(data)
          uni.showModal({
            title: '版本升级',
            content: `更新内容：\n${data.description}`,
            success: function (res) {
              if (res.confirm) {
                plus.runtime.openURL(url);
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
      }
    });
    // #endif
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
</style>
