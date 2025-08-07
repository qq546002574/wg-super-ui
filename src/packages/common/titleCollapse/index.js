import wgTitleCollapse from './src/main';
/* istanbul ignore next */
wgTitleCollapse.install = function (Vue) {
  Vue.component(wgTitleCollapse.name, wgTitleCollapse);
};

export default wgTitleCollapse;
