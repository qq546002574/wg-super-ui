import wgPullSelect from './src/index.vue';
/* istanbul ignore next */
wgPullSelect.install = function (Vue) {
  Vue.component(wgPullSelect.name, wgPullSelect);
};

export default wgPullSelect;
