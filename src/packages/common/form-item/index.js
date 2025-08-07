import wgElFormItem from '../form/src/form-item';

/* istanbul ignore next */
wgElFormItem.install = function (Vue) {
  Vue.component(wgElFormItem.name, wgElFormItem);
};

export default wgElFormItem;
