import title from './src/main';
/* istanbul ignore next */
title.install = function (Vue) {
  Vue.component(title.name, title);
};

export default title;
