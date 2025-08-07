import wgElOption from './src/main';

/* istanbul ignore next */
wgElOption.install = function (Vue) {
  Vue.component(wgElOption.name, wgElOption);
};

export default wgElOption;
