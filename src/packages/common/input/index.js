import wgElInput from './src/input';

/* istanbul ignore next */
wgElInput.install = function (Vue) {
  Vue.component(wgElInput.name, wgElInput);
};

export default wgElInput;
