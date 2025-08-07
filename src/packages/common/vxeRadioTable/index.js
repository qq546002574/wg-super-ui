import wgRadioTable from './src/main';

/* istanbul ignore next */
wgRadioTable.install = function (Vue) {
  Vue.component(wgRadioTable.name, wgRadioTable);
};

export default wgRadioTable;
