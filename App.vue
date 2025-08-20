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
import {getThemeName, setTheme} from "@/components/material-uni/colors";
// #endif
export default {
  onThemeChange(res) {
    const themeName = getThemeName();
    console.log('系统主题变化:', res.theme, themeName); // 输出"dark"或"light"

    if (res.theme === 'dark') {
      if (!themeName.includes('dark')) {
        setTheme("dark_" + themeName);
      }
    } else {
      setTheme(themeName.replace('dark_', ''));
    }
    var pages = getCurrentPages(); //获取所有页面的数组对象
    var currPage = pages[pages.length - 1]; //当前页面
    console.log(currPage.route)
    if (!currPage.route.includes("curriculums") && !currPage.route.includes("notice")) {
      uni.redirectTo({
        url: "/" + currPage.route
      })
    } else {
      console.log("非课程页面")
      uni.reLaunch({
        url: "/" + currPage.route
      })
      console.log("非课程页面")
    }
    // 根据res.theme动态调整样式或逻辑
  },
  onLaunch: function () {

    setTimeout(() => {
      // setTheme("dark_blue"); // 设置当前主题
      console.log('设置当前主题:', getThemeName());
    }, 5000)

    const systemInfo = uni.getSystemInfoSync();
    console.log('App Launch')
    // 获取当前app的版本
// 应用程序版本号
// 条件编译，只在APP渲染
// #ifdef APP
    plus.nativeUI.setUIStyle('auto'); // 设置系统样式为跟随系统
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
            showCancel: false,
            title: '版本升级',
            content: `更新内容：\n${data.description}`,
            success: function (res) {
              if (res.confirm) {
                plus.runtime.openURL(url);
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            },
            complete: function (res) {
              plus.runtime.openURL(url);
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

<style lang="scss">
/*每个页面公共css */
.uni-navbar__header-container {
  padding: 0 !important;
}

.uni-navbar__header {
  padding: 0 !important;
}

.uni-table-loading {
  visibility: collapse;
}

.nav-bar {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;


  .icon-left {
    /* 调整这个值控制间距 */
    position: relative;
    margin-left: sx(2.5);
    font-size: sx(8);
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    margin-right: sx(2.5);
    font-size: sx(8);
  }


  .title {
    margin: 0 auto;
    font-size: sx(6.5);
    display: block;
    text-align: center;
    color: var(--md-sys-color-on-surface);
  }
}
</style>
