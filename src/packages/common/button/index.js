import wgButton from './src/main';

/* istanbul ignore next */
wgButton.install = function(Vue) {
  Vue.component(wgButton.name, wgButton);
};

export default wgButton;
