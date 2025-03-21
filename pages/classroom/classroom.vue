<template>
  <view>
    <status-bar></status-bar>
    <!-- 头部控制栏 -->
    <uni-nav-bar leftWidth="0" rightWidth="0" :border="false" background-color="rgb(248, 248, 248)">
      <view class="header">
        <uni-icons type="left" size="50rpx" @click="back" class="icon-left"/>
        <text class="title" >空教室查询</text>
        <uni-icons type="loop" size="50rpx" @click="update" class="icon-right" :class="{'rotate': loading}" />
      </view>
    </uni-nav-bar>
    <view class="select" id="select">
      <view class="group">
        <scroll-view class="select-scroll" scroll-x="true" scroll-left="0">
          <view class="select-item"
                :class="{ 'active': weeksSelected.length === weeksList.length }"
                @click="uniqueSelect(weeksSelected,weeksList)">
            <text class="text">全选</text>
          </view>
          <view v-for="(item) in weeksList" class="select-item"
                :class="{ 'active': weeksSelected.includes(item) }"
                @click="select(weeksSelected,item)">
            <text class="text">第{{ item }}周</text>
          </view>
        </scroll-view>
      </view>
      <view class="group">
        <scroll-view class="select-scroll" scroll-x="true" scroll-left="0">
          <view class="select-item"
                :class="{ 'active': coursesSelected.length === coursesList.length }"
                @click="uniqueSelect(coursesSelected,coursesList)">
            <text class="text">全选</text>
          </view>
          <view v-for="item in coursesList" class="select-item"
                :class="{ 'active': coursesSelected.includes(item) }"
                @click="select(coursesSelected,item)">
            <text class="text">第{{ item }}节</text>
          </view>
        </scroll-view>
      </view>
      <view class="group">
        <scroll-view class="select-scroll" scroll-x="true" scroll-left="0">
          <view class="select-item"
                :class="{ 'active': daysSelected.length === daysList.length }"
                @click="uniqueSelect(daysSelected,daysList)">
            <text class="text">全选</text>
          </view>
          <view v-for="item in daysList" class="select-item"
                :class="{ 'active': daysSelected.includes(item) }"
                @click="select(daysSelected,item)">
            <text class="text">周{{ num2text[item] }}</text>
          </view>
        </scroll-view>
      </view>
      <view class="group">
        <scroll-view class="select-scroll" scroll-x="true" scroll-left="0">
          <!--          <view class="select-item"-->
          <!--                :class="{ 'active': daysSelected.length === daysList.length }"-->
          <!--                @click="uniqueSelect(daysSelected,daysList)">-->
          <!--            <text class="text">全选</text>-->
          <!--          </view>-->
          <view v-for="(value,key) in buildings" class="select-item"
                :class="{ 'active': lh === value }"
                @click="selectBuilding(value)">
            <text class="text">{{ key }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
      <scroll-view scroll-y="true" class="scroll-table" :style="{'height': heigth + 'px'}">
        <uni-table ref="table" border stripe emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="1" align="center">地点</uni-th>
            <uni-th width="1" align="center">教室</uni-th>
            <uni-th width="1" align="center">座位</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in tableData" :key="index">
            <uni-td align="center">{{ item.jxlmc }}</uni-td>
            <uni-td align="center">
              {{ item.cdmc }}
            </uni-td>
            <uni-td align="center">
              {{ item.zws }}
            </uni-td>
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
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import getCurriculumByUsernameAndPassword, {getClassroom} from "@/static/util/tool";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import StatusBar from "@/components/status-bar/status-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
export default {
  components: {UniTh, UniTd, UniTr, UniTable, StatusBar, UniNavBar, UniPopup, UniEasyinput, UniIcons},
  data() {
    return {
      weeksList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      weeksSelected: [],
      coursesList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      coursesSelected: [],
      daysList: [1, 2, 3, 4, 5, 6, 7],
      daysSelected: [],
      buildings: {
        "东馆": "DG001",
        "西馆": "XG001",
        "南馆": "NG001",
        "信息楼": "XXL001",
        "经管楼": "JGL001",
        "文理楼": "WLL001",
        "设计楼": "SJl001",
        "教学楼": "JXL001",
        "北大活": "BDH001",
        "图书馆": "TSG001",
        "体育中心": "TY001",
        "体育公园": "TYG001",
        "工程中心": "GCZ001",
        "科创中心": "KC001",
        "实验楼": "SYL001",
        "基础实验楼": "JCS001",
        "江宁校区实验楼": "JN001",
        "无楼号": "wlh",
        "无": "W001"
      },
      num2text: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日'
      },
      zcd: 0,
      jcd: 0,
      xqj: '',
      lh: '',
      xnm: "",//学年，且取小的那个
      xqm: "",//哪个学期1学期3，2学期12，3学期？16
      loginPage: null,
      check: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
      loading:false,
      heigth: 0,
      tableData: []
    }
  },
  watch: {
    weeksSelected(newVal, oldVal) {
      this.zcd = 0;
      for (let newValKey in newVal) {
        this.zcd += Math.pow(2, newVal[newValKey] - 1);
      }
      console.log(this.zcd)
    },
    coursesSelected(newVal, oldVal) {
      this.jcd = 0;
      for (let newValKey in newVal) {
        this.jcd += Math.pow(2, newVal[newValKey] - 1);
      }
      console.log(this.jcd)
    },
    daysSelected(newVal, oldVal) {
      this.xqj = newVal.join(',')
      console.log(this.xqj)
    }
  },
  created() {
    // #ifdef APP-PLUS
    this.loginPage = plus.webview.getWebviewById("webviewInside");
    plus.globalEvent.addEventListener('plusMessage', this.handlePostMessage_)
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
    this.zcd = 0;
    this.jcd = 0;
    let data = this.getCurrentSchoolYear().split('-');
    this.xnm = data[0];
    this.xqm = data[2];
  },
  onReady() {
    this.update();
    const systemInfo = uni.getSystemInfoSync();
    let dom = uni.createSelectorQuery().in(this);
    dom.select("#select").boundingClientRect()

    dom.exec((data) => {
      console.log(data)
      this.heigth = systemInfo.windowHeight-data[0].bottom;
      console.log(systemInfo.statusBarHeight)
    })
  },
  methods: {
    select(arr, item) {
      if (arr.includes(item)) {
        arr.splice(arr.indexOf(item), 1)
      } else {
        arr.push(item)
      }
      this.getClassRoom();
    },
    uniqueSelect(arr, arr2) {
      if (arr.length === arr2.length) {
        arr.splice(0, arr.length)
      } else {
        arr.splice(0, arr.length)
        arr.push(...arr2)
      }
      this.getClassRoom();
    },
    selectBuilding(value) {
      this.lh = value;
      console.log(this.lh)
      this.getClassRoom();
    },
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
              type: "CAPTCHAIMAGEBASE64_",
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
      this.loginPage.onloaded = ()=>{
        this.loginPage.onloaded = () => {}
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
        },100)
      }
      this.loginPage.evalJS(
          'document.querySelector("#load").click();'
      )
      // #endif
    },
    cancel() {
      this.$refs.loginModal.close();
    },
    back(){
      uni.navigateBack();
    },
    update() {
      console.log('update')
      this.weeksSelected.splice(0, this.weeksSelected.length);
      this.coursesSelected.splice(0, this.coursesSelected.length);
      this.daysSelected.splice(0, this.daysSelected.length);
      this.lh = '';
      this.loading = true;
      uni.showToast({
        title: '验证信息',
        icon: 'loading',
        duration: 2000
      });
      this.loginPage.loadURL(`https://casb.njit.edu.cn/http/webvpnea5e00498bb033e68046c95dbdf6e09fbc127bea836184c80a0792b662ced92f/authserver/login?service=http://ehall.njit.edu.cn/login?service=http://ehall.njit.edu.cn/new/index.html&time=${Math.random()}`)
      this.loginPage.onloaded = ()=>{
        this.loginPage.onloaded = () => {}
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
        },100)
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
      },5000);
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
                      type: "jwxtOK_",
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
    getClassRoom(){
      if(this.lh === '' || this.zcd === 0 || this.jcd === 0 || this.xqj === '' || this.xnm === '' || this.xqm === ''){
        console.log('请选择完整信息')
        return;
      }
      this.loginPage.evalJS(
            `var myHeaders = new Headers();
            myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36");
            myHeaders.append("Accept", "*/*");
            myHeaders.append("Connection", "keep-alive");
            myHeaders.append("Host", "casb.njit.edu.cn");
            myHeaders.append("Connection", "keep-alive");
            myHeaders.append("Origin", "https://casb.njit.edu.cn");
            myHeaders.append("Referer", "https://casb.njit.edu.cn/http/webvpn0ce64a2014465dfe87dac723232b20edd0da6675d44948234864a5c4ff77b278/new/index.html");
            var urlencoded = new URLSearchParams();
            urlencoded.append("zcd", '${this.zcd}');
            urlencoded.append("xqj", '${this.xqj}');
            urlencoded.append("jcd", '${this.jcd}');
            urlencoded.append("cdlb_id", "");
            urlencoded.append("fwzt", "cx");
            urlencoded.append("xqh_id", "1");
            urlencoded.append("xnm", '${this.xnm}');
            urlencoded.append("xqm", '${this.xqm}');
            urlencoded.append("cdejlb_id", "");
            urlencoded.append("qszws", "");
            urlencoded.append("jszws", "");
            urlencoded.append("cdmc", "");
            urlencoded.append("lh", '${this.lh}');
            urlencoded.append("jyfs", "0");
            urlencoded.append("cdjylx", "");
            urlencoded.append("sfbhkc", "");
            urlencoded.append("_search", "false");
            urlencoded.append("nd", '${Date.now()}');
            urlencoded.append("queryModel.showCount", "100");
            urlencoded.append("queryModel.currentPage", "1");
            urlencoded.append("queryModel.sortName", "cdbh");
            urlencoded.append("queryModel.sortOrder", "asc");
            urlencoded.append("time", "1");
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: urlencoded,
              redirect: 'follow'
            };
            fetch("https://casb.njit.edu.cn/http/webvpn3e1a11b7208e283ab07ade5d2913fc13d6f6fe09d2dc7372db2a51a14aa4167a/jwglxt/cdjy/cdjy_cxKxcdlb.html?doType=query&gnmkdm=N253512&enlink-vpn=", requestOptions)
                .then(response => response.text())
                .then(result =>{
                plus.webview.postMessageToUniNView({
                  type: "CLASSROOM_",
                    args: {
                      data: result
                    }
                  }, "__uniapp__service");
                })
                .catch(error => console.log('error', error));`
    );
    },
    handlePostMessage_({data}) {
      console.log(data)
      if (data.type === "subscribeHandler") {
        return
      }
      let {args} = data;
      if (data.type === "CAPTCHAIMAGEBASE64_") {
        this.captchaImg = args.data;
      } else if (data.type === "jwxtOK_") {
        clearTimeout(this.check);
        uni.hideLoading();
        uni.showToast({
          title: '可以查询了！',
          icon: 'success',
          duration: 2000
        });
        this.loading = false;
        // this.getTimeTable();
      }else if(data.type === "CLASSROOM_"){
        this.tableData = getClassroom(JSON.parse(args.data));
      }
    },
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
</style>