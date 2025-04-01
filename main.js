import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from './store';
import mixin from '@/mixin/themeMixin.js'
import materialTabBar from '@/components/material-uni/material-tab-bar/material-tab-bar.vue'
Vue.prototype.$store = store;

Vue.use(materialTabBar,[
  {
    icon:'md-event_note',
    name:"课表",
    page: "pages/curriculums/curriculums",
  },
  {
    icon:'md-report',
    name:"通知",
    page: "pages/index/index",
  }
])
Vue.use(mixin)

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