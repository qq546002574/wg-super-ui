import wgTimelineItem from '../timeline/src/item.vue';

/* istanbul ignore next */
wgTimelineItem.install = function (Vue) {
  Vue.component(wgTimelineItem.name, wgTimelineItem);
};

export default wgTimelineItem;
