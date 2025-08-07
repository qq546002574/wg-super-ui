import wgAreaCascaderCheck from './src/main';
/* istanbul ignore next */
wgAreaCascaderCheck.install = function (Vue) {
  Vue.component(wgAreaCascaderCheck.name, wgAreaCascaderCheck);
};

export default wgAreaCascaderCheck;
