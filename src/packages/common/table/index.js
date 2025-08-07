import wgTable from './src/main';

/* istanbul ignore next */
wgTable.install = function (Vue) {
  Vue.component(wgTable.name, wgTable);
};

export default wgTable;
