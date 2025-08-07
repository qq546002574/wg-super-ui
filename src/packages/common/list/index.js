import wgList from './src/main';

/* istanbul ignore next */
wgList.install = function (Vue) {
  Vue.component(wgList.name, wgList);
};

export default wgList;
