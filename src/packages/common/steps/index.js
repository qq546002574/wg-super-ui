import wgSteps from "./src/main";

/* istanbul ignore next */
wgSteps.install = function (Vue) {
  Vue.component(wgSteps.name, wgSteps);
};

export default wgSteps;
