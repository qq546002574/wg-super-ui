import wgDragContainer from './src/main';

/* istanbul ignore next */
wgDragContainer.install = function (Vue) {
  Vue.component(wgDragContainer.name, wgDragContainer);
};

export default wgDragContainer;
