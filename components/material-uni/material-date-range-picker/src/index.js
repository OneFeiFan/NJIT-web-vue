// import "./styles/index.scss";

import VMdDateRangePicker from '../components/Picker.vue';

const install = function (Vue) {
  Vue.component(VMdDateRangePicker.name, VMdDateRangePicker);
};



export default {
  install,
  VMdDateRangePicker,
};
