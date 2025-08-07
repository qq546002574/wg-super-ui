import wgPriceTable from './src/main.vue';
/* istanbul ignore next */
wgPriceTable.install = function (Vue) {
  Vue.component(wgPriceTable.name, wgPriceTable);
};

export default wgPriceTable;
