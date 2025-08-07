import wgPersonSelect from './src/main';
/* istanbul ignore next */
wgPersonSelect.install = function (Vue) {
  Vue.component(wgPersonSelect.name, wgPersonSelect);
};

export default wgPersonSelect;
