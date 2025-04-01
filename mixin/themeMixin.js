import {
  mapState,
  mapGetters
} from 'vuex'
export default {
  install(Vue) {
    Vue.mixin({
      computed: {
        ...mapState({
          currentTheme: 'currentTheme'
        }),
        ...mapGetters({
          theme: "theme",
          tabInactiveColor: "tabInactiveColor",
          tabActiveColor: "tabActiveColor"
        })
      }
    })
  }
}
