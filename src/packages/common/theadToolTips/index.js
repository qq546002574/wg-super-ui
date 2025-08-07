import wgTheadTooltips from './src/main';

/* istanbul ignore next */
wgTheadTooltips.install = function (Vue) {
  Vue.component(wgTheadTooltips.name, wgTheadTooltips);
};

export default wgTheadTooltips;
