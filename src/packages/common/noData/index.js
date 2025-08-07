import wgEmpty from './src/main';

/* istanbul ignore next */
wgEmpty.install = function (Vue) {
  Vue.component(wgEmpty.name, wgEmpty);
};

export default wgEmpty;
