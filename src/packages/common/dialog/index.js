import wgDialog from './src/main';

/* istanbul ignore next */
wgDialog.install = function (Vue) {
  Vue.component(wgDialog.name, wgDialog);
};

export default wgDialog;
