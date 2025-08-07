import wgElTabs from './src/tabs';

/* istanbul ignore next */
wgElTabs.install = function (Vue) {
  Vue.component(wgElTabs.name, wgElTabs);
};

export default wgElTabs;
