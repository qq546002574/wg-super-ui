import wgElSelect from './src/main';

/* istanbul ignore next */
wgElSelect.install = function (Vue) {
  Vue.component(wgElSelect.name, wgElSelect);
};

export default wgElSelect;
