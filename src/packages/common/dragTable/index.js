import wgDragTable from './src/main';

/* istanbul ignore next */
wgDragTable.install = function (Vue) {
  Vue.component(wgDragTable.name, wgDragTable);
};

export default wgDragTable;
