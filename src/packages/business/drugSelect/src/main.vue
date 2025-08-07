<script>
import { findDrugBaseInfoByPage } from "@/utils";
export default {
  name: "wgDrugSelect",
  props: {
    defaultValue: String,
    immateShow: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    drugTypeCodes: {
      type: String,
      default: "",
    },
    // value: String,
  },
  model: {
    // 实现v-model
    prop: "defaultValue",
  },
  data() {
    return {
      initialValue: "",
      config: {
        popWidth: "800",
        isIndex: false,
        immateShow: this.immateShow,
        tableColum: [
          { property: "drugFactCode", label: "药品编码", width: "90" },
          { property: "drugName", label: "名称", width: "150" },
          { property: "drugSpec", label: "规格", minWidth: "120" },
          {
            property: "pharmacyFactoryName",
            minWidth: "90",
            label: "厂家／产地",
          },
          { property: "tradePrice", label: "批发价", width: "93", digit: true },
          {
            property: "retailPrice",
            label: "零售价",
            width: "93",
            digit: true,
          },
          { property: "stockNumStr", label: "可用库存", width: "85" },
        ],
        tableData: [],
        callBackName: "drugName",
        isSelect: false,
        pageConfig: {
          total: 0,
          pageSize: 50,
        },
      },
    };
  },
  created() {
    this.initialValue = this.defaultValue;
  },
  watch: {
    defaultValue(val) {
      if (val === this.initialValue) return;
      this.initialValue = val;
    },
  },
  methods: {
    focus() {
      this.$refs.wgInputTable.$refs.inputRef.focus();
    },
    clear() {
      this.initialValue = "";
    },
    async inputSearch(params) {
      const { currentPage, pageSize, type, value } = params;
      const { orgCode } = this;
      // this.$emit("input", value.drugName);

      // if(type === 'checked') return this.$emit('selectItem',value);
      if (type !== "entry")
        return this.$emit("selectItem", value, value.drugName);

      let reqs = {
        currentPage,
        pageSize,
        queryStr: value,
        drugTypeCodes: this.drugTypeCodes,
        // workDept: orgCode,
      };
      const {
        data: { records = [], total = 0 },
      } = await findDrugBaseInfoByPage(reqs);
      this.config.pageConfig = { total, currentPage, pageSize };
      this.config.tableData = records;

      // console.log(params);
      // const { currentPage, pageSize, type, value } = params;
      // if (type !== 'checked') {
      //   const {
      //     data: { records = [], total = 0 },
      //   } = await findDrugBaseInfoByPage({
      //     currentPage,
      //     pageSize,
      //     queryStr: value,
      //   });
      //   this.config.pageConfig = { total };
      //   this.config.tableData = records;
      // } else if (type === 'checked') {
      //   this.$emit("selectItem",value);
      // }
    },
  },
  render() {
    const { config, placeholder } = this;
    const { inputSearch } = this;
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };
    return (
      <wg-input-table
        ref="wgInputTable"
        placeholder={placeholder}
        {...{ props }}
        {...{ on }}
        style="width:100%"
        config={config}
        eval={this.initialValue}
        oninputSearch={inputSearch}
      />
    );
  },
};
</script>

<style lang="less">
@import "./main.less";
</style>
