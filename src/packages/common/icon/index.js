import wgIcon from './src/main';
/* istanbul ignore next */
wgIcon.install = function (Vue) {
  Vue.component(wgIcon.name, wgIcon);
};

export default wgIcon;
