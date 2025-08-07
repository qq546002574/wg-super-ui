import wgAlert from './src/main';

/* istanbul ignore next */
wgAlert.install = function (Vue) {
  Vue.component(wgAlert.name, wgAlert);
};

export default wgAlert;
