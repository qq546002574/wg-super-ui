import wgSuperTree from './src/main';

/* istanbul ignore next */
wgSuperTree.install = function (Vue) {
  Vue.component(wgSuperTree.name, wgSuperTree);
};

export default wgSuperTree;
