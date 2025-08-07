import wgSectionGraph from './src/main';
/* istanbul ignore next */
wgSectionGraph.install = function (Vue) {
  Vue.component(wgSectionGraph.name, wgSectionGraph);
};

export default wgSectionGraph;
