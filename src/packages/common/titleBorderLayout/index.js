import wgTitleBorderLayout from './src/main';
/* istanbul ignore next */
wgTitleBorderLayout.install = function (Vue) {
  Vue.component(wgTitleBorderLayout.name, wgTitleBorderLayout);
};

export default wgTitleBorderLayout;
