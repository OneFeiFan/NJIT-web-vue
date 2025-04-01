import Vue from 'vue'

import Component from './component.vue'

export { events } from './interface'
export { DEFAULT_CONFIG } from './config'

export const TouchRipple = Component
// export const install: Plugin = (app, defaultConfig?: Props) => {
//   app.component(Component.name, Component)
//   app.component('TouchRipple', Component)
//   injectGlobalConfig(app, defaultConfig)
// }
export const install = function (Vue, options) {
    if (options) {
        Component.props.globalOptions.default = () => options
    }
    Vue.component(Component.name, Component)
}

export default { TouchRipple, install }
