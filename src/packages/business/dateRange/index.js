import wgDateRange from './src/main';

wgDateRange.install = function (Vue) {
  Vue.component(wgDateRange.name, wgDateRange);
};

export default wgDateRange;
