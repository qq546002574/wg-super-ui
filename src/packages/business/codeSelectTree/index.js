import wgCodeSelectTree from './src/main';

wgCodeSelectTree.install = function (Vue) {
  Vue.component(wgCodeSelectTree.name, wgCodeSelectTree);
};

export default wgCodeSelectTree;
