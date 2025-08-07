import wgPagination from './src/main';

/* istanbul ignore next */
wgPagination.install = function (Vue) {
  Vue.component(wgPagination.name, wgPagination);
};

export default wgPagination;
