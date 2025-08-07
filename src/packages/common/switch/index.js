import wgSwitch from "./src/component";

/* istanbul ignore next */
wgSwitch.install = function (Vue) {
  Vue.component(wgSwitch.name, wgSwitch);
};

export default wgSwitch;
