import wgExtendSelect from './src/main';

/* istanbul ignore next */
wgExtendSelect.install = function (Vue) {
  Vue.component(wgExtendSelect.name, wgExtendSelect);
};

export default wgExtendSelect;
