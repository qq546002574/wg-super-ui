import wgCodeEdit from './src/main';

/* istanbul ignore next */
wgCodeEdit.install = function (Vue) {
  Vue.component(wgCodeEdit.name, wgCodeEdit);
};

export default wgCodeEdit;
