import Vue from 'vue'

export const props = {
  color: {
    type: String,
    default: undefined
  },
  opacity: {
    type: Number,
    default: undefined
  },
  duration: {
    type: Number,
    default: undefined
  },
  transition: {
    type: String,
    default: undefined
  },
  keepLastRipple: {
    type: Boolean,
    default: undefined
  },
  globalOptions: {
    type: Object,
    default: () => ({
      color: '#fff',
      opacity: 0.3,
      duration: 380,
      transition: 'ease-out',
      keepLastRipple: true
    })
  },
}

export const EventKey = {
  Touch: 'touch',
  Click: 'click',
  Start: 'start',
  End: 'end'
}

export const events = {
  [EventKey.Touch]: (event) => true,
  [EventKey.Click]: (event) => true,
  [EventKey.Start]: (id) => true,
  [EventKey.End]: (id) => true
}

// 在Vue 2.7中，我们通常不需要定义Props类型，因为Vue.extend会自动推断类型。
// 但是，如果您需要在JavaScript中使用Props类型，通常不需要显式定义类型。
// 您可以直接将props传递给Vue.extend或Vue.component来定义组件
