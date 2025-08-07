import wgDateTimeDialog from './src/main';

/* istanbul ignore next */
wgDateTimeDialog.install = function (Vue) {
  Vue.component(wgDateTimeDialog.name, wgDateTimeDialog);
};

export default wgDateTimeDialog;
