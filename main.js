import App from './App'
import uView from '@/uni_modules/uview-ui'
// import store from './store';
import {updateRippleConfig} from "@/components/material-uni/ripple/config";
import {getThemeName, setTheme} from "@/components/material-uni/colors";
import {SvgIconLib} from "@/static/svg-icons-lib";
import {SvgIconLib as MaterialFilled} from "@/uni_modules/zui-material-icons/static/material-filled";
import materialTabBar from '@/components/material-uni/material-tab-bar/material-tab-bar.vue'
import moment from "moment";

moment.locale('zh-cn');
// Vue.prototype.$store = store;
// #ifdef APP-PLUS
import {Core} from "@/uni_modules/fuckingNJIT"
Vue.prototype.$manager = new Core();
// #endif

SvgIconLib.registerCollection("material-filled", MaterialFilled);

Vue.use(materialTabBar,[
  {
    icon:'event_note',
    name:"课表",
    page: "pages/curriculums/curriculums",
  },
  {
    icon:'report',
    name:"通知",
    page: "pages/notice/notice",
  }
])

setTheme(getThemeName())
updateRippleConfig({
  color: "var(--md-sys-color-on-surface)",
  opacity: 0.4,
  transition: "ease-out",
  duration: 250,
  backgroundColor: "var(--md-sys-color-surface)"
})

//初始化主题，从本地存储中获取之前保存的主题
const savedTheme = uni.getStorageSync('currentTheme');
if (savedTheme && store.state.themes[savedTheme]) {
  store.commit('changeTheme', savedTheme);
}
Vue.use(uView)
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif