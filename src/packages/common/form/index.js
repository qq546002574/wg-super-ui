import wgForm from './src/form';

/* istanbul ignore next */
wgForm.install = function (Vue) {
  Vue.component(wgForm.name, wgForm);
};

export default wgForm;
