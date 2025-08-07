import wgInputTable from './src/inputPopTable';

/* istanbul ignore next */
wgInputTable.install = function (Vue) {
  Vue.component(wgInputTable.name, wgInputTable);
};

export default wgInputTable;
