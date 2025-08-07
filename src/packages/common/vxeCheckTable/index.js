import wgCheckTable from './src/main';

/* istanbul ignore next */
wgCheckTable.install = function (Vue) {
  Vue.component(wgCheckTable.name, wgCheckTable);
};

export default wgCheckTable;
