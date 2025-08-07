import wgCodeSelect from './src/main';
/* istanbul ignore next */
wgCodeSelect.install = function (Vue) {
  Vue.component(wgCodeSelect.name, wgCodeSelect);
};

export default wgCodeSelect;
