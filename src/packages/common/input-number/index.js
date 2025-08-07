import wgInputNumber from './src/input-number';

/* istanbul ignore next */
wgInputNumber.install = function(Vue) {
  Vue.component(wgInputNumber.name, wgInputNumber);
};

export default wgInputNumber;
