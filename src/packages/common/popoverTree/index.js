import wgPopoverTree from './src/main';

/* istanbul ignore next */
wgPopoverTree.install = function (Vue) {
  Vue.component(wgPopoverTree.name, wgPopoverTree);
};

export default wgPopoverTree;
