<script>
// #ifdef APP
import {
  initUM, UMonKillProcess,
  UMonProfileSignIn, UMonProfileSignIns, UMonPageStart, UMonPageEnd, UMuserProfileMobile,
  UMonEventObject, UMonProfileSignOff, UMuserProfileEMail, UMuserProfile
  , UMsubmitPolicyGrantResult, UMenableImsiCollection, UMenableIccidCollection,
  UMenableImeiCollection, UMenableWiFiMacCollection, onUMgetOaid,
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
    plus.webview.prefetchURLs(["https://casb.njit.edu.cn/http/webvpnea5e00498bb033e68046c95dbdf6e09fbc127bea836184c80a0792b662ced92f/authserver/login?service=http://ehall.njit.edu.cn/login?service=http://ehall.njit.edu.cn/new/index.html", "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html", "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/appShow?appId=5904538791462728"]);
    plus.webview.create("http://localhost", 'webviewInside', {
      'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
    }).onclose = (e) => {
      plus.webview.create("http://localhost", 'webviewInside', {
        'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
      })
    };
    // webviewInside.onloaded = (e)=>{
    //   try {
    //     webviewInside.evalJS(
    //         `var script = document.createElement('script');
    //          script.textContent = ${uniData.js};
    //          document.body.appendChild(script);`
    //     );
    //     console.log('webviewInside loaded')
    //   }catch(e){
    //     console.log(er)
    //   }
    // };
    initUM("67d77c8948ac1b4f87e98e5f", "android");
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
        if (version_number !== data.version) {
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
  methods:{
    test(){
      console.log('test')
    }
  }
}
</script>

<style>
/*每个页面公共css */
.uni-navbar__header-container {
  padding: 0 !important;
}

.uni-navbar__header {
  padding: 0 !important;
}
</style>
