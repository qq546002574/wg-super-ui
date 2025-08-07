import wgCheckEditTable from './src/main';

/* istanbul ignore next */
wgCheckEditTable.install = function (Vue) {
  Vue.component(wgCheckEditTable.name, wgCheckEditTable);
};

export default wgCheckEditTable;
