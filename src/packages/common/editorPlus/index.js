import wgEditorPlus from './src/main';

/* istanbul ignore next */
wgEditorPlus.install = function(Vue) {
  Vue.component(wgEditorPlus.name, wgEditorPlus);
};

export default wgEditorPlus;
