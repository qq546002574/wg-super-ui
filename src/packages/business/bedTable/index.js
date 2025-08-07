import wgBedTable from './src/main';
/* istanbul ignore next */
wgBedTable.install = function (Vue) {
  Vue.component(wgBedTable.name, wgBedTable);
};

export default wgBedTable;
