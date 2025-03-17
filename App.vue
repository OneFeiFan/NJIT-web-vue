<script>
	// #ifdef APP
	import {
	initUM,UMonKillProcess,
	UMonProfileSignIn,UMonProfileSignIns,UMonPageStart,UMonPageEnd,UMuserProfileMobile,
	UMonEventObject,UMonProfileSignOff,UMuserProfileEMail,UMuserProfile
	,UMsubmitPolicyGrantResult,UMenableImsiCollection,UMenableIccidCollection,
	UMenableImeiCollection,UMenableWiFiMacCollection,onUMgetOaid,
	getUMIDString
	} from "@/uni_modules/xtf-umeng"
	// #endif
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 获取当前app的版本
    const systemInfo = uni.getSystemInfoSync();
// 应用程序版本号
// 条件编译，只在APP渲染
// #ifdef APP
	initUM("67d77c8948ac1b4f87e98e5f","android");
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
  },
  beforeDestroy: function () {
    console.log('App Before Destroy')
  },
  destroyed: function () {
    console.log('App Destroyed')
  }
}
</script>

<style>
/*每个页面公共css */
.uni-navbar__header-container{
  padding: 0 !important;
}
.uni-navbar__header{
  padding: 0 !important;
}
</style>
