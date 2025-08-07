import wgAreaCascader from './src/main';
/* istanbul ignore next */
wgAreaCascader.install = function (Vue) {
  Vue.component(wgAreaCascader.name, wgAreaCascader);
};

export default wgAreaCascader;
