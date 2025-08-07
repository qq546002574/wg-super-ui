import wgNoticeDialog from './src/main';

/* istanbul ignore next */
wgNoticeDialog.install = function (Vue) {
  Vue.component(wgNoticeDialog.name, wgNoticeDialog);
};

export default wgNoticeDialog;
