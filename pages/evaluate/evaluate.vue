<template>
  <view>
    <status-bar></status-bar>
    <!-- 头部控制栏 -->
    <uni-nav-bar leftWidth="0" rightWidth="0" :border="false" background-color="rgb(248, 248, 248)">
      <view class="header">
        <uni-icons type="left" size="50rpx" @click="back" class="icon-left"/>
        <text class="title" >快速评价</text>
        <uni-icons type="loop" size="50rpx" @click="update" class="icon-right" :class="{'rotate': loading}" />
      </view>
    </uni-nav-bar>

    <scroll-view scroll-y="true" class="scroll-table">
      <uni-table ref="table" border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th width="1" align="center">课程</uni-th>
          <uni-th width="1" align="center">教师</uni-th>
          <uni-th width="1" align="center">状态</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td align="center">{{ item.course }}</uni-td>
          <uni-td align="center">
            {{ item.teacher }}
          </uni-td>
          <uni-td align="center">
            {{ item.complete ? "已完成":"未完成" }}
<!--            <button v-if ="!item.complete" type="default" class="btn-evaluate" @click="dotask(item.course)">评价</button>-->
          </uni-td>
        </uni-tr>
      </uni-table>
      <button class="dotask" type="primary" @click="dotask">快速评价</button>
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
      loginPage: null,
      check: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
      loading:false,
      tableData: [],
      index:0
    }
  },
  created() {
    // #ifdef APP-PLUS
    this.loginPage = plus.webview.getWebviewById("webviewInside");
    plus.globalEvent.addEventListener('plusMessage', this.evaluate_)
    // this.loginPage.setStyle({
    //   top: 0,
    //   height: "100%",
    //   width: "100%"
    // })
    // this.loginPage.hide();
    // var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    // currentWebview.append(this.loginPage);
    // #endif
  },
  onLoad() {
  },
  onReady() {
    this.update();
  },
  methods: {
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
              type: "CAPTCHAIMAGEBASE64_EVALUATES",
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
                      type: "jwxtOK_EVALUATES",
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
    getEvaluateData(){
      this.index = 0;
      this.loginPage.loadURL(`https://casb.njit.edu.cn/http/webvpn3e1a11b7208e283ab07ade5d2913fc13d6f6fe09d2dc7372db2a51a14aa4167a/jwglxt/xspjgl/kcgcpj_cxKcgcpjxxIndex.html?gnmkdm=N401650&layout=default#&time=${Math.random()}`)
      this.loginPage.onloaded = ()=>{
        this.loginPage.onloaded = () => {}
        setTimeout(() => {
          this.loginPage.evalJS(
          `
          var yes = [
            '课程内容设计严谨，理论与实践结合紧密，收获远超预期！',
            '教师授课深入浅出，课堂互动活跃，学习兴趣大幅提升。',
            '知识点覆盖全面，案例贴近实际，有效提升了专业能力。',
            '课程节奏张弛有度，作业反馈及时，学习效果显著增强。',
            '教师讲解逻辑清晰，重点难点剖析透彻，理解毫无障碍。',
            '课程资源丰富多样，拓展资料实用性强，助力深度学习。',
            '课堂讨论激发思考，多元观点碰撞，拓宽了学科视野。',
            '教学方式创新灵活，线上线下结合，适应不同学习需求。',
            '教师耐心解答疑问，注重学生反馈，课堂氛围轻松融洽。',
            '课程目标明确，每节课都有清晰收获，充实感满满！',
            '实践环节设计巧妙，动手操作中巩固理论，学以致用。',
            '教师语言生动幽默，抽象概念形象化，记忆深刻持久。',
            '课程结构层次分明，知识体系完整，学习路径清晰高效。',
            '小组合作任务合理，团队协作能力与专业知识同步提升。',
            '教师专业素养极高，前沿动态融入教学，紧跟学科发展。',
            '课后习题难度适中，针对性强化训练，夯实学习成果。',
            '课程考核方式科学，过程性评价全面反映真实水平。',
            '案例教学贯穿始终，真实场景模拟，实战能力显著提高。',
            '教师注重思维引导，鼓励创新观点，培养独立研究能力。',
            '课程整体体验极佳，内容实用性强，强烈推荐他人选修！'
          ]

          var suggestions = [
            '课程节奏稍快，部分章节可适当放慢便于消化。',
            '理论讲解偏多，或可增加实操环节强化应用能力。',
            '课后作业难度跨度较大，建议提供阶梯式引导。',
            '部分案例稍显陈旧，希望更新行业前沿实例。',
            '课堂互动参与不均，可设计更多分组协作任务。',
            '课程资料分散，建议整合为系统化学习手册。',
            '线上平台功能单一，可补充互动问答模块。',
            '部分知识点重复讲解，建议优化内容衔接逻辑。',
            '随堂测验时间紧张，延长作答时长会更合理。',
            '教师反馈较简略，希望增加个性化改进建议。',
            '课程初期目标不够明确，建议增设导学说明。',
            '小组任务分工模糊，需明确角色与评分标准。',
            '课程与先修知识关联度高，建议补充基础回顾。',
            '理论到实践的过渡稍显生硬，可穿插过渡案例。',
            '期末考核占比过高，建议增加过程性评价比例。',
            '部分课件排版密集，文字精简结合图表更清晰。',
            '课堂讨论时间有限，或可预留课后延伸思考题。',
            '跨学科内容较少，建议引入相关领域拓展视角。',
            '课程时间安排紧凑，适当增加休息间隔更合理。',
            '技术设备偶有故障，建议提前调试确保稳定性。'
          ]
          var evaluates = [], tasks = {};

          let evaluates_w = document.querySelector("#wpjkc"), evaluates_w_List;

          let evaluates_y = document.querySelector("#ypjkc"), evaluates_y_List;
          if (evaluates_w !== null) {
            evaluates_w_List = evaluates_w.querySelectorAll(".mui-table-view-cell");
          }

          if (evaluates_y !== null) {
            evaluates_y_List = evaluates_y.querySelectorAll(".mui-table-view-cell");
          }

          if (evaluates_w_List.length > 0) {
            for (let i = 0; i < evaluates_w_List.length; ++i) {
              tasks[evaluates_w_List[i].querySelector(".jxb").innerText] = evaluates_w_List[i];
              evaluates.push({
                course: evaluates_w_List[i].querySelector(".jxb").innerText,
                teacher: evaluates_w_List[i].querySelector(".teacher").innerText,
                complete: false
              })
            }
          }

          if (evaluates_y_List.length > 0) {
            for (let i = 0; i < evaluates_y_List.length; ++i) {
              evaluates.push({
                course: evaluates_y_List[i].querySelector(".jxb").innerText,
                teacher: evaluates_y_List[i].querySelector(".teacher").innerText,
                complete: true
              })
            }
          }

          if (evaluates.length > 0) {
            plus.webview.postMessageToUniNView({
              type: "EVALUATES",
              args: {
                data:evaluates
              }
            }, "__uniapp__service");
          }`
          );
        },100);
      }
    },
    dotask(){
      if(this.tableData.length<1){
        uni.showToast({
          title: `没有数据！`,
          icon: 'error',
          duration: 2000
        });
      }

      let value = this.tableData[this.index];
      if(this.index>=this.tableData.length){
        uni.showToast({
          title: `全部评价结束`,
          icon: 'success',
          duration: 2000
        });
        // setTimeout(()=>{
        //   this.update();
        // },2000);
        return;
      }

      if(value.complete){
        ++this.index;
        this.dotask();
        return;
      }
      let course = value.course;
      // this.loginPage.show();
      uni.showToast({
        title: `尝试评价:${course}`,
        icon: 'none',
        duration:5000
      });
      this.loginPage.evalJS(
      `
      //document.querySelector(".col-md-5.col-sm-5").style.display = "none";
      //document.querySelectorAll(".panel-heading")[1].style.display = "none";
      //document.querySelectorAll(".mui-slider-group")[1].style.height = "100vh";
      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      function doTasks(key) {
        let id1 = null,id2 = null;
        let wait = setTimeout(()=>{
          if(id1!== null){
            clearInterval(id1);
          }
          if(id2!== null){
            clearInterval(id2);
          }
          plus.webview.postMessageToUniNView({
            type: "EVALUATES_RESULT",
            args: {
              data:{
                course:key,
                status:false
              }
            }
          }, "__uniapp__service");
        },10000);
        tasks[key].click();
        id1 = setInterval(() => {
          let textAreas = document.getElementsByName("zgpj");
          let pjfs = document.getElementsByName("pjf");
          for (let i = 0; i < pjfs.length; ++i) {
              pjfs[i].value = 0;
            }
          if (textAreas.length > 0) {
            clearInterval(id1);
            for (let i = 0; i < textAreas.length; ++i) {
            if(textAreas[i].value === ""){
              textAreas[i].value = "无";
              }
            }
            //let score = document.querySelectorAll('.dp.mui-clearfix')[0].parentNode.parentNode.querySelector('input[name="pjf"]').value;
            //if(score !== null&&score !== undefined&&score.value !== ''&&score.value !== 0&&score.value !== '0'){

              //document.querySelector("#submit").click();
            //}
           var muiscroll=document.querySelectorAll('.dp.mui-clearfix');
           for (let item of muiscroll) {
               var blockdiv=item.querySelector('div');
               blockdiv.click();
           }
            setTimeout(() => {
            document.querySelector("#submit").click();
            }, 2000);
            id2 = setInterval(()=>{
              if(document.querySelector(".modal-title")){
                if(document.querySelector(".modal-title").innerHTML === "成功提示"){
                  clearInterval(id2);
                  clearTimeout(wait);
                  plus.webview.postMessageToUniNView({
                    type: "EVALUATES_RESULT",
                    args: {
                      data:{
                        course:key,
                        status:true
                      }
                    }
                   }, "__uniapp__service");
                }
              }
            },200);
          }
        }, 200);
      }
      doTasks('${course}')`
      )

    },
    evaluate_({data}) {
      // console.log(data)
      if (data.type === "subscribeHandler") {
        return
      }
      let {args} = data;
      if (data.type === "CAPTCHAIMAGEBASE64_EVALUATES") {
        this.captchaImg = args.data;
      } else if (data.type === "jwxtOK_EVALUATES") {
        clearTimeout(this.check);
        uni.hideLoading();
        this.getEvaluateData()
        // uni.showToast({
        //   title: '可以查询了！',
        //   icon: 'success',
        //   duration: 2000
        // });
        this.loading = false;
        // this.getTimeTable();
      }else if(data.type === "EVALUATES"){
        this.tableData = args.data
      }else if(data.type === "EVALUATES_RESULT"){
        uni.hideLoading();
        let result = args.data;
        if (result.status){
          uni.showToast({
            title: `${result.course}:评价成功`,
            icon: 'none',
            duration: 2000
          });
        }else{
          uni.showToast({
            title: `${result.course}:评价失败`,
            icon: 'none',
            duration: 2000
          });
        }
        // this.loginPage.hide();
        // console.log(this.loginPage)
        setTimeout(()=>{
          console.log(this.index,this.tableData.length)
          if(this.index>=this.tableData.length){
            uni.showToast({
              title: `全部评价结束`,
              icon: 'success',
              duration: 2000
            });
            setTimeout(()=>{
              this.update();
            },2000);
          }else{
            ++this.index;
            this.dotask();
          }
        },2000)
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
.scroll-table{
  height: calc(100vh - var(--status-bar-height) - 44px);
}
.dotask{
  width: 60%;
  //height: ;
}
</style>