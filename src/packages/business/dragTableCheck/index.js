import wgDragTableCheck from './src/main';

/* istanbul ignore next */
wgDragTableCheck.install = function (Vue) {
  Vue.component(wgDragTableCheck.name, wgDragTableCheck);
};

export default wgDragTableCheck;
