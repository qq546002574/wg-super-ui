import wgDrawer from './src/main';

/* istanbul ignore next */
wgDrawer.install = function (Vue) {
  Vue.component(wgDrawer.name, wgDrawer);
};

export default wgDrawer;
