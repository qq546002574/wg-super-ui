export default {
  props: {
    _dataForm: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.init();
  },
  data() {
    return {
      type: 'add',
    };
  },
  methods: {
    init() {
      if (Object.keys(this._dataForm).length === Object.keys(this.formData).length) {
        this.formData = Object.assign(this.formData, this._dataForm);
        this.type = 'edit';
      }
    },
  },
};
