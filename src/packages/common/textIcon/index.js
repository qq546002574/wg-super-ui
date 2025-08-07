import main from './src/main';
/* istanbul ignore next */
main.install = function (Vue) {
  Vue.component(main.name, main);
};

export default main;
