import wgAutocomplete from './src/autocomplete';

/* istanbul ignore next */
wgAutocomplete.install = function (Vue) {
  Vue.component(wgAutocomplete.name, wgAutocomplete);
};

export default wgAutocomplete;
