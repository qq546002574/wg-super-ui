import wgButtonGroup from './src/main';

/* istanbul ignore next */
wgButtonGroup.install = function (Vue) {
  Vue.component(wgButtonGroup.name, wgButtonGroup);
};

export default wgButtonGroup;
