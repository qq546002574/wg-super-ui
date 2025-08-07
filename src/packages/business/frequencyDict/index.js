import wgFrequencyDict from './src/main';
/* istanbul ignore next */
wgFrequencyDict.install = function (Vue) {
  Vue.component(wgFrequencyDict.name, wgFrequencyDict);
};

export default wgFrequencyDict;
