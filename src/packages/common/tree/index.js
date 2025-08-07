import WgElTree from './src/tree.vue';

/* istanbul ignore next */
WgElTree.install = function(Vue) {
  Vue.component(WgElTree.name, WgElTree);
};

export default WgElTree;
