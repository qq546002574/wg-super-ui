import wgDatePicker from './src/picker/date-picker';

/* istanbul ignore next */
wgDatePicker.install = function install(Vue) {
  Vue.component(wgDatePicker.name, wgDatePicker);
};

export default wgDatePicker;
