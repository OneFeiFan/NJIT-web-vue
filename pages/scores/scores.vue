<template>
  <view>
    <status-bar></status-bar>
    <!-- 头部控制栏 -->
    <uni-nav-bar leftWidth="0" rightWidth="0" :border="false" background-color="rgb(248, 248, 248)">
      <view class="header">
        <uni-icons type="left" size="50rpx" @click="back" class="icon-left"/>
        <text class="title">成绩查询</text>
        <uni-icons type="loop" size="50rpx" @click="update" class="icon-right" :class="{'rotate': loading}"/>
      </view>
    </uni-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <uni-table ref="table" border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="1" align="center">详情</uni-th>
          <uni-th width="1" align="center">学年</uni-th>
          <uni-th width="1" align="center">学期</uni-th>
          <uni-th width="1" align="center">课程</uni-th>
          <uni-th width="1" align="center">成绩</uni-th>
          <uni-th width="1" align="center">学分</uni-th>
          <uni-th width="1" align="center">教师</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td align="center">
            <button type="default" class="btn-evaluate" @click="getDetail(item.jxb_id,item.xnm,item.xqm,item.kcmc)">
              详情
            </button>
          </uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.xnmmc }}</uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.xqmmc }}</uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.kcmc }}</uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.cj }}</uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.xf }}</uni-td>
          <uni-td align="center" :class="{'color-red': item.jd === `0.00`}">{{ item.jsxm }}</uni-td>
        </uni-tr>
      </uni-table>
    </scroll-view>
    <uni-popup ref="loginModal" type="message" :mask-click="false">
      <view class="login-modal">
        <view class="wrap">
          <uni-easyinput class="input" v-model="username" placeholder="请输入账号"
                         @input="inputUserName"/>
          <uni-easyinput class="input" v-model="password" placeholder="请输入密码"
                         @input="inputPassWord"/>
          <view class="captcha">
            <uni-easyinput class="input" v-model="captcha" placeholder="请输入验证码" @input="inputCaptcha"/>
            <image class="captcha-img"
                   :src=captchaImg
                   mode="aspectFill" @click="updateCaptchaImg"/>
          </view>
          <view class="btn-wrap">
            <button class="login-btn" type="default" @click="cancel">取消</button>
            <button class="login-btn" type="primary" @click="login">登录</button>
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="detail">
      <view class="detail-modal" :mask-click="false">
        <view class="name">{{className}}</view>
      <uni-table border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="1" align="center">成绩分项</uni-th>
          <uni-th width="1" align="center">成绩分项比例</uni-th>
          <uni-th width="1" align="center">成绩</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in detail" :key="index">
          <uni-td align="center">{{ item.scoreItem }}</uni-td>
          <uni-td align="center">{{ item.percentage }}</uni-td>
          <uni-td align="center">{{ item.score }}</uni-td>
        </uni-tr>
      </uni-table>
        <button class="ok" type="primary" @click="cancel">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import getCurriculumByUsernameAndPassword, {getClassroom, getScores} from "@/static/util/tool";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import StatusBar from "@/components/status-bar/status-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
const parse5 = require('parse5');
const htmlparser2Adapter = require('parse5-htmlparser2-tree-adapter');
const cssSelect = require('css-select');
export default {
  components: {UniTh, UniTd, UniTr, UniTable, StatusBar, UniNavBar, UniPopup, UniEasyinput, UniIcons},
  data() {
    return {
      className:'test',
      detail: [],
      loginPage: null,
      check: null,
      wait: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
      loading: false,
      heigth: 0,
      tableData: []
    }
  },
  created() {
    // #ifdef APP-PLUS
    this.loginPage = plus.webview.getWebviewById("webviewInside");
    plus.globalEvent.addEventListener('plusMessage', this.scores_)
    // this.loginPage.setStyle({
    //   top: 550,
    //   height: "25%",
    //   width: "100%"
    // })
    // var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    // currentWebview.append(this.loginPage);

    // #endif
  },
  onLoad() {

  },
  onReady() {
    // this.$refs.detail.open("center")
    // try {
    //   let temp = uni.getStorageSync('SCOREDATA_SCORES');
    //   if (temp !== null && temp !== '') {
    //     this.tableData = temp;
    //   }else {
    //
    //   }
    // } catch (e) {
    //   console.error(e)
    //   this.update();
    // }
    this.update();
  },
  methods: {
    getCurrentSchoolYear() {
      const currentMonth = new Date().getMonth(); // 获取当前月份（1-12）
      const currentYear = new Date().getFullYear(); // 获取当前年份
      let schoolYearStart, schoolYearEnd, semester;

      if (currentMonth >= 9) { // 如果当前月份大于或等于9（或以后），则当前学年为今年的年份
        schoolYearStart = currentYear;
        schoolYearEnd = currentYear + 1;
        semester = 3
      } else { // 否则，当前学年为去年的年份
        schoolYearStart = currentYear - 1;
        schoolYearEnd = currentYear;
        semester = 12
      }

      return `${schoolYearStart}-${schoolYearEnd}-${semester}`; // 返回学年学期的字符串表示，例如 "2023-2024-12"
    },
    inputUserName(e) {
      this.loginPage.evalJS(
          `document.querySelector("#mobileUsername").value = "${e}"`
      )
    },
    inputPassWord(e) {
      this.loginPage.evalJS(
          `document.querySelector("#mobilePassword").value = "${e}"`
      )
    },
    inputCaptcha(e) {
      this.loginPage.evalJS(
          `document.querySelector("#captchaResponse").value = "${e}"`
      )
    },
    getCaptchaImg() {
      this.loginPage.evalJS(`
            function getBase64FromImg(imgElement, type = 'image/png') {
              const canvas = document.createElement('canvas');
              canvas.width = imgElement.naturalWidth;
              canvas.height = imgElement.naturalHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(imgElement, 0, 0);
              return canvas.toDataURL(type); // 返回完整的Base64字符串（包含MIME类型）
            }
            plus.webview.postMessageToUniNView({
              type: "CAPTCHAIMAGEBASE64_SCORES",
              args: {
                data: getBase64FromImg(document.querySelector("#captchaImg"))
              }
            }, "__uniapp__service");
          `)
    },
    updateCaptchaImg() {
      this.loginPage.evalJS(
          `document.querySelector("#captchaImg").click();`
      );
      setTimeout(() => {
        // this.injectJS();
        this.getCaptchaImg();
      }, 500);

      console.log("updateCaptchaImg")
    },
    login() {
      if (this.username === '' || this.password === '' || this.captcha === '') {
        uni.showToast({
          title: '输入错误',
          icon: 'error',
          duration: 1000
        });
        return;
      }
      console.log('login')
      this.$refs.loginModal.close();
      this.captchaImg = null;
      this.captcha = '';
      this.username = '';
      this.password = '';
      uni.showLoading({
        title: '登录中'
      });

      // #ifdef APP-PLUS
      this.loginPage.onloaded = () => {
        this.loginPage.onloaded = () => {
        }
        uni.hideLoading();
        this.loading = false;
        setTimeout(() => {
          if (this.loginPage.getURL() !== "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html") {
            uni.hideLoading();
            uni.showToast({
              title: '登录失败',
              icon: 'error',
              duration: 2000
            });
            return;
          }
          uni.showToast({
            title: '登录成功，现在你可以继续操作',
            icon: 'none',
            duration: 2000
          });
          this.initJWXT();
        }, 100)
      }
      this.loginPage.evalJS(
          'document.querySelector("#load").click();'
      )
      // #endif
    },
    cancel() {
      this.$refs.loginModal.close();
      this.$refs.detail.close();
    },
    back() {
      uni.navigateBack();
    },
    update() {
      console.log('update')
      this.loading = true;
      uni.showToast({
        title: '验证信息',
        icon: 'loading',
        duration: 2000
      });
      this.loginPage.loadURL(`https://casb.njit.edu.cn/http/webvpnea5e00498bb033e68046c95dbdf6e09fbc127bea836184c80a0792b662ced92f/authserver/login?service=http://ehall.njit.edu.cn/login?service=http://ehall.njit.edu.cn/new/index.html&time=${Math.random()}`)
      this.loginPage.onloaded = () => {
        this.loginPage.onloaded = () => {
        }
        setTimeout(() => {
          if (this.loginPage.getURL() === "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html") {
            this.initJWXT();
            return;
          }
          uni.showToast({
            title: '请先登录',
            icon: 'error',
            duration: 2000
          });
          this.$refs.loginModal.open('center');
          this.getCaptchaImg();
        }, 100)
      }
    },
    initJWXT() {
      uni.showLoading({
        title: '加载教务信息'
      });
      this.check = setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '加载信息失败',
          icon: 'error',
          duration: 2000
        });
      }, 5000);
      this.loginPage.evalJS(
          `var myHeaders = new Headers();
                  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
                  myHeaders.append("Accept", "*/*");
                  myHeaders.append("Host", "casb.njit.edu.cn");
                  myHeaders.append("Connection", "keep-alive");
                  var requestOptions = {
                     method: 'GET',
                     headers: myHeaders,
                     redirect: 'follow'
                  };
              fetch("https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/appShow?appId=5904538791462728", requestOptions)
                  .then(result => {
                    plus.webview.postMessageToUniNView({
                      type: "jwxtOK_SCORES",
                      args: {}
                    }, "__uniapp__service");
                  })
                  .catch(error => {
                    plus.webview.postMessageToUniNView({
                      type: "jwxtBad_",
                      args: {}
                    }, "__uniapp__service");
                  });`
      );
    },
    getScoreData() {
      uni.showLoading({
        title: '加载成绩信息'
      });
      this.wait = setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '加载成绩失败',
          icon: 'error',
          duration: 2000
        });
      }, 5000);
      this.loginPage.evalJS(
          `var myHeaders = new Headers();
              myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
              myHeaders.append("Accept", "*/*");
              myHeaders.append("Host", "casb.njit.edu.cn");
              myHeaders.append("Connection", "keep-alive");

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };

              fetch("https://casb.njit.edu.cn/http/webvpn3e1a11b7208e283ab07ade5d2913fc13d6f6fe09d2dc7372db2a51a14aa4167a/jwglxt/cjcx/cjcx_cxXsgrcj.html?doType=query&gnmkdm=N305005&enlink-vpn&xnm=&xqm=&kcbj=&_search=false&nd=${Date.now()}&queryModel.showCount=500&queryModel.currentPage=1&queryModel.sortName=+&queryModel.sortOrder=desc&time=1", requestOptions)
                  .then(response => response.text())
                  .then(result => {
                    plus.webview.postMessageToUniNView({
                      type: "SCOREDATA_SCORES",
                      args: {
                        data: result
                      }
                    }, "__uniapp__service");
                  })
                  .catch(error => console.log('error', error));`
      );
    },
    getDetail(id, xnm, xqm, kcmc) {
      uni.showLoading({
        title: '加载详细信息'
      });
      this.className = kcmc;
      this.loginPage.evalJS(
          `var myHeaders = new Headers();
              myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
              myHeaders.append("Accept", "*/*");
              myHeaders.append("Host", "casb.njit.edu.cn");
              myHeaders.append("Connection", "keep-alive");

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };

              fetch("https://casb.njit.edu.cn/http/webvpn3e1a11b7208e283ab07ade5d2913fc13d6f6fe09d2dc7372db2a51a14aa4167a/jwglxt/cjcx/cjcx_cxCjxqGjh.html?time=1742889638805&gnmkdm=N305005&enlink-vpn&jxb_id=${id}&xnm=${xnm}&xqm=${xqm}&kcmc=${kcmc}", requestOptions)
                  .then(response => response.text())
                  .then(result => {
                    plus.webview.postMessageToUniNView({
                      type: "SCOREDETAIL_SCORES",
                      args: {
                        data: result
                      }
                    }, "__uniapp__service");
                  })
                  .catch(error => console.log('error', error));`
      )
    },
    scores_({data}) {
      // console.log(data)
      if (data.type === "subscribeHandler") {
        return
      }
      let {args} = data;
      if (data.type === "CAPTCHAIMAGEBASE64_SCORES") {
        this.captchaImg = args.data;
      } else if (data.type === "jwxtOK_SCORES") {
        clearTimeout(this.check);
        this.getScoreData();
        // this.getTimeTable();
      } else if (data.type === "SCOREDATA_SCORES") {
        clearTimeout(this.wait);
        this.tableData = getScores(JSON.parse(args.data));
        // uni.setStorageSync('SCOREDATA_SCORES', this.tableData)
        uni.hideLoading();
        this.loading = false;
      } else if (data.type === "SCOREDETAIL_SCORES") {
        const dom = parse5.parse(args.data,{ treeAdapter: htmlparser2Adapter });
        const table = cssSelect.selectAll('#subtab tbody tr', dom);
        this.detail = table.map(row => {
          const tds = cssSelect.selectAll('td', row);
          let scoreItem = tds[0].childNodes[0].data;
          scoreItem = scoreItem.replace('【', '');
          scoreItem = scoreItem.replace('】', '');
          return  {
            scoreItem,
            percentage: tds[1].childNodes[0].data,
            score: tds[2].childNodes[0].data
          }
        });
        uni.hideLoading();
        this.$refs.detail.open('center');
      }
    }
  }
}
</script>

<style lang="scss">
.header {
  height: 100%;
  width: 100%;
  background: #fff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 50rpx;

    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 50rpx;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }


  .title {
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 36rpx;
    color: #333;
  }
}

.select {
  .group {
    margin-top: 40rpx;
    display: flex;

    .select-scroll {
      white-space: nowrap;
      width: 100%;
    }

    .select-item {
      display: inline-block;
      width: 150rpx;
      text-align: center;
      border-right: #3a3a3a solid 1px;

      &:first-child {
        border-left: #3a3a3a solid 1px;
      }

      .text {
        width: 100%;
        text-align: center;
        font-size: 40rpx;
        color: #959595;
      }
    }

    .active {
      background-color: #cdcfd5;

      .text {
        color: #5489f5;
      }
    }
  }
}

$modal-width: 90vw;
.login-modal {
  width: $modal-width;
  height: $modal-width * 0.75;
  border-radius: 40rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrap {
    display: flex;
    flex-direction: column;
    width: 90%;

    .input {
      margin-top: 20rpx;
    }
  }

  .captcha {
    display: flex;

    .captcha-img {
      margin-top: 20rpx;
      height: 70rpx;
      width: 200rpx;
    }
  }

  .btn-wrap {
    width: 100%;
    display: flex;

    .login-btn {
      margin-top: 20rpx;
      width: 45%;
      //height: 80rpx;
    }
  }
}

.scroll-table {
  height: 100vh;
  .color-red{
    color: red;
  }
}

.btn-evaluate {
  //width: 30rpx;
  //height: 60rpx;
  font-size: 30rpx;
}
.detail-modal{
  border-radius: 20rpx;
  border: 1px #fff solid;
  background-color: #fff;
  width: 90vw;

  .name{
    height: 50rpx;
    width: 100%;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ok{
    margin: 0 auto;
    width: 90%;
  }
}
</style>