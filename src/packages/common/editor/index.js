import wgEditor from './src/main';

/* istanbul ignore next */
wgEditor.install = function(Vue) {
  Vue.component(wgEditor.name, wgEditor);
};

export default wgEditor;
