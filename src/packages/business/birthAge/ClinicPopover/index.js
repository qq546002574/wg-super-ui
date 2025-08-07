import ClinicPopover from './src/main';
/* istanbul ignore next */
ClinicPopover.install = function (Vue) {
  Vue.component(ClinicPopover.name, ClinicPopover);
};

export default ClinicPopover;
