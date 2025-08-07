import wgTransfer from './src/main';

/* istanbul ignore next */
wgTransfer.install = function (Vue) {
  Vue.component(wgTransfer.name, wgTransfer);
};

export default wgTransfer;
