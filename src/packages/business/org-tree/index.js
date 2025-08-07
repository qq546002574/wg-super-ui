import orgTree from './src/orgTree.vue';
orgTree.install = function (Vue) {
  Vue.component(orgTree.name, orgTree);
};
export default orgTree;
