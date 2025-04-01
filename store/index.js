import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import themes from './theme.js'
import {tabActiveColor, tabInactiveColor} from "@/store/first_blue_light";
const store = new Vuex.Store({
  state: {
    currentTheme: "defaultTheme",
    themes: themes
  },
  getters: {
    theme(state) {
      return state.themes[state.currentTheme].style
    },
	currentTheme: state => state.currentTheme,
    tabInactiveColor: state => state.themes[state.currentTheme].tabInactiveColor,
    tabActiveColor: state => state.themes[state.currentTheme].tabActiveColor
  },
  mutations: {
    changeTheme(state, themeName = "defaultTheme") {
      state.currentTheme = themeName
	  // 保存当前主题到本地存储
	  uni.setStorageSync('currentTheme', themeName);  
    }
  }
})

export default store
