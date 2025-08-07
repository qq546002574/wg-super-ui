<script>
import { getPageUsers } from '@/utils/index';
import { isEmpty } from '@/utils/validate';
export default {
  name: 'wgPersonSelect',
  props: {
    orgCode: String,
    medInstId: [String, Number],
    defaultCode: [String,Number],
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  data() {
    return {
      loading: false,
      initialCode: '',
      initialValue: '',
      config: {
        popWidth: '390',
        isIndex: false,
        immateShow: true,
        tableColum: [
          { property: 'peopleName', label: '姓名', width: '100' },
          { property: 'peopleIdentifier', label: '工号', width: '80' },
          { property: 'workDeptName', label: '科室' },
        ],
        tableData: [],
        callBackName: 'peopleName',
        isSelect: false,
        pageConfig: {
          total: 0,
        },
      },
    };
  },
  watch: {
    defaultCode(val) {
      if (isEmpty(val)) return this.initialValue = '';
      if (val === this.initialCode&&this.initialValue) return;
      this.updateInitialValueFromCode(val);
    },
  },
  async created() {
    if (isEmpty(this.defaultCode)) return;
    this.loading = true;
    this.updateInitialValueFromCode(this.defaultCode);
  },
  methods: {
    focus() {
      this.$refs.wgInputTable.tagsInputDivClick();
    },
    clear(){
      this.initialValue = '';
    },
    async updateInitialValueFromCode(code) {
      this.initialCode = code;
      await this.inputSearch({ currentPage: 1, pageSize: 10, type: 'entry', value: code });
      console.log("测试....",this.config.tableData)
      this.initialValue = this.config.tableData[0]?.peopleName || '';
      this.loading = false;
    },
    async inputSearch(params) {
      //这里是触发了inputTable的点击事件
      const { currentPage, pageSize, type, value } = params;
      const { orgCode } = this;

      // if(type === 'checked') return this.$emit('selectItem',value);
      if (type !== 'entry'){
        this.initialCode = value.peopleIdentifier;
        this.initialValue = value.peopleName;
        return this.$emit('selectItem', value);
      } 

      let reqs = {
        currentPage,
        pageSize,
        dynamicParam: value,
        workDept: orgCode,
        medInstId: this.medInstId,
      };
      const {
        data: { records = [], total = 0 },
      } = await getPageUsers(reqs);
      this.config.pageConfig = { total, currentPage, pageSize };
      this.config.tableData = records;
    },
  },
  render() {
    const { config, initialValue, placeholder, loading } = this;
    const { inputSearch } = this;
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };
    return <wg-input-table
          ref="wgInputTable"
          v-loading={loading}
          {...{ props }}
          {...{ on }}
          style="width:100%"
          placeholder={placeholder}
          config={config}
          eval={initialValue}
          oninputSearch={inputSearch}
        />
  },
};
</script>

<style lang="less" scoped>
@import './main.less';
</style>
