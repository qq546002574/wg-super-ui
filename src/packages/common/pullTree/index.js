import wgPullTree from './src/main';
/* istanbul ignore next */
wgPullTree.install = function (Vue) {
  Vue.component(wgPullTree.name, wgPullTree);
};

export default wgPullTree;
