import wgInputTableCheck from './src/inputPopTable';

/* istanbul ignore next */
wgInputTableCheck.install = function (Vue) {
  Vue.component(wgInputTableCheck.name, wgInputTableCheck);
};

export default wgInputTableCheck;
