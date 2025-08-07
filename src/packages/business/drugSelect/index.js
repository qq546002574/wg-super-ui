import wgDrugSelect from './src/main';
/* istanbul ignore next */
wgDrugSelect.install = function (Vue) {
  Vue.component(wgDrugSelect.name, wgDrugSelect);
};

export default wgDrugSelect;
