import wgBirthAge from './src/main';

/* istanbul ignore next */
wgBirthAge.install = function (Vue) {
  Vue.component(wgBirthAge.name, wgBirthAge);
};

export default wgBirthAge;
