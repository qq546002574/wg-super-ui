import wgFormDialog from './src/main';

/* istanbul ignore next */
wgFormDialog.install = function (Vue) {
  Vue.component(wgFormDialog.name, wgFormDialog);
};

export default wgFormDialog;
