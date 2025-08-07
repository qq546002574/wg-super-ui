import wgPullDown from './src/index.vue';
/* istanbul ignore next */
wgPullDown.install = function (Vue) {
  Vue.component(wgPullDown.name, wgPullDown);
};

export default wgPullDown;
