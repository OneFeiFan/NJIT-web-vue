<script>
import {themeLogic } from "@/components/material-uni/colors";
export default {
  onThemeChange(res) {
    themeLogic.handleSystemChange(res.theme);
  },
  onLaunch: function () {
    // 初始化主题
    themeLogic.init();
    this.$manager.requestKeepAliveNormalPermissions().then(res=>{
      console.log(res);
    })
    // #ifdef APP-PLUS
    const style = plus.navigator.getUIStyle();
    themeLogic.handleSystemChange(style);

    // 重写openWeb方法
    plus.runtime.openWeb = function(options) {
      // 提取URL参数（兼容字符串和对象传参）
      var url = (typeof options === 'string') ? options : (options && options.url);

      if (url) {
        // 核心：调用openURL实现外部浏览器打开
        plus.runtime.openURL(url);
      } else {
        console.error("Hook failed: Invalid URL provided to openWeb");
      }
    };
    // #endif
    const systemInfo = uni.getSystemInfoSync();
    console.log('App Launch')
// #ifdef APP
    plus.nativeUI.setUIStyle('auto'); // 设置系统样式为跟随系统
    if (this.$manager.isSmartUpdate() && !this.$manager.checkInstallPackagePermission()) {
      uni.showModal({
        title: '增量更新启用提示',
        content: "增量更新功能可以加快更新速度并减少流量消耗。\n如需开启增量更新，请点击“确认”授予安装包权限。否则，请点击“取消”永久关闭此功能。\n如果后续更新异常，可以去设置中关闭增量更新功能。",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.$manager.requestInstallPackage()
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
    // 获取当前app的版本
    let version_number = systemInfo.appWgtVersion;
    uni.request({
      url: 'https://raw.giteeusercontent.com/OneFeiFan/fxxking-NJIT/raw/master/version.json',
      header: {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Accept": "*/*",
        "Host": "raw.giteeusercontent.com",
        "Connection": "keep-alive"
      },
      success: (res) => {
        const data = res.data;
        // console.log(data)
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
    // #ifdef APP-PLUS
    console.log('app onReady')
    plus.navigator.closeSplashscreen()
    // #endif
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
.uni-table-loading {
  visibility: collapse;
}

.nav-bar {
  height: 100%;
  width: 100%;
  //background-color: var(--md-sys-color-primary);
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
