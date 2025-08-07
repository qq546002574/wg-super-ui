import wgLeftRightLayout from './src/main';

/* istanbul ignore next */
wgLeftRightLayout.install = function (Vue) {
  Vue.component(wgLeftRightLayout.name, wgLeftRightLayout);
};

export default wgLeftRightLayout;
