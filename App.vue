<script>
import {getThemeName, setTheme} from "@/components/material-uni/colors";
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
    pages.forEach(page => {
      console.log(page.route)
      if (page.$vm && page.$vm.refreshTheme) {
        page.$vm.refreshTheme();
      }
    });
    uni.$emit('ThemeUpdate')
    // console.log(currPage.$vm.test())
    // if (!currPage.route.includes("curriculums") && !currPage.route.includes("notice")) {
    //   uni.redirectTo({
    //     url: "/" + currPage.route
    //   })
    // } else {
    //   console.log("非课程页面")
    //   uni.reLaunch({
    //     url: "/" + currPage.route
    //   })
    //   console.log("非课程页面")
    // }
    // 根据res.theme动态调整样式或逻辑
  },
  onLaunch: function () {
    const themeName = getThemeName();
    var style = "light";
    if (style === 'dark') {
      if (!themeName.includes('dark')) {
        setTheme("dark_" + themeName);
      }
    } else {
      setTheme(themeName.replace('dark_', ''));
    }

    const systemInfo = uni.getSystemInfoSync();
    console.log('App Launch')
    // 获取当前app的版本
// 应用程序版本号
// 条件编译，只在APP渲染
// #ifdef APP
    plus.nativeUI.setUIStyle('auto'); // 设置系统样式为跟随系统
    if (this.$manager.isSmartUpdate() && !this.$manager.checkRequestInstallPackagePermission()) {
      uni.showModal({
        title: '增量更新启用提示',
        content: "增量更新功能可以加快更新速度并减少流量消耗。\n如需开启增量更新，请点击“确认”授予安装包权限。否则，请点击“取消”永久关闭此功能。\n如果后续更新异常，可以去设置中关闭增量更新功能。",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.$manager.requestRequestInstallPackagePermission()
          } else {
            uni.showToast({
              title: '后续可以在设置中重新开启增量更新功能。',
              icon: 'none'
            })
            this.$manager.setSmartUpdate(false);
          }
        }
      })
    }
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
        const data = res.data;
        // console.log(data.version)
        if (data.version !== undefined && version_number !== data.version) {
          const url = `https://gitee.com/OneFeiFan/fxxking-NJIT/releases/download/v${data.version}/${data.version}.apk`;
          // console.log('发现新版本', data.version, data.description);
          uni.showModal({
            showCancel: false,
            title: "版本升级",
            content: `更新内容：\n${data.description}`,
            complete: () => {
              if (data[version_number] && this.$manager.checkRequestInstallPackagePermission()) {
                const bin = `https://gitee.com/OneFeiFan/fxxking-NJIT/releases/download/v${data.version}/${data[version_number]}`;
                console.log('增量更新', bin);
                this.$manager.updateApp(bin)
                    .then((res) => {
                      if (!res) {
                        plus.runtime.openURL(url);
                      }
                    })
                    .catch(() => {
                      plus.runtime.openURL(url);
                    });
              } else {
                plus.runtime.openURL(url);
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
  // methods: {
  //   showUpdateModal(title, content, url) {
  //     uni.showModal({
  //       showCancel: false,
  //       title: title,
  //       content: content,
  //       success: function (res) {
  //         if (res.confirm) {
  //           plus.runtime.openURL(url);
  //         }
  //       },
  //       complete: function (res) {
  //         plus.runtime.openURL(url);
  //       }
  //     });
  //
  //   }
  // }
}
</script>

<style lang="scss">
/*每个页面公共css */
//.uni-navbar__header-container {
//  padding: 0 !important;
//}
//
//.uni-navbar__header {
//  padding: 0 !important;
//}
//
.uni-table-loading {
  visibility: collapse;
}

.nav-bar {
  height: 100%;
  width: 100%;
  //background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
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
    margin: 0 auto 0 sx(8);
    font-size: sx(6.5);
    display: block;
    text-align: center;
  }
}
</style>
