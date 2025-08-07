import wgTabPane from '../tabs/src/tab-pane.vue';

/* istanbul ignore next */
wgTabPane.install = function (Vue) {
  Vue.component(wgTabPane.name, wgTabPane);
};

export default wgTabPane;
