import wgOrgSelect from './src/main';
/* istanbul ignore next */
wgOrgSelect.install = function (Vue) {
  Vue.component(wgOrgSelect.name, wgOrgSelect);
};

export default wgOrgSelect;
