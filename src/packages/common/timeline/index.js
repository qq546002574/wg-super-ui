import wgTimeline from './src/main';

/* istanbul ignore next */
wgTimeline.install = function (Vue) {
  Vue.component(wgTimeline.name, wgTimeline);
};

export default wgTimeline;
