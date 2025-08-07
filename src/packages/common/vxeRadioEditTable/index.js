import wgRadioEditTable from './src/main';

/* istanbul ignore next */
wgRadioEditTable.install = function (Vue) {
  Vue.component(wgRadioEditTable.name, wgRadioEditTable);
};

export default wgRadioEditTable;
