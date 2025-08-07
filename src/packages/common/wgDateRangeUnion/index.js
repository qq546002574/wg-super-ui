import wgDateRangeUnion from './src/main';

/* istanbul ignore next */
wgDateRangeUnion.install = function (Vue) {
  Vue.component(wgDateRangeUnion.name, wgDateRangeUnion);
};

export default wgDateRangeUnion;
