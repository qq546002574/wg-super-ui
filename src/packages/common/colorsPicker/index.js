import wgColorsPicker from './src/main';

/* istanbul ignore next */
wgColorsPicker.install = function(Vue) {
  Vue.component(wgColorsPicker.name, wgColorsPicker);
};

export default wgColorsPicker;
