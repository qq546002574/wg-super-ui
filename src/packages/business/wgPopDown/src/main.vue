<script>
import typeConfig from "./type.js";
import ajax from "@/api/http.js";
import { isEmpty } from "@/utils/validate";
import LodashMerge from "lodash.merge";

export default {
  name: "wgPopDown",
  props: {
    tag: String,
    callBackName: [Boolean, Object],
    // api的请求参数
    queryParams: Object,
    defaultModel: {
      type: [String, Number, Array],
    },
    requestAfter: {
      type: Function,
      default: null,
    },
    eval: {
      // input初始值
      type: String,
      default: "",
    },
    placement: {
      type: String,
      default: "bottom",
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    openKeyboard: {
      type: Boolean,
      default: true,
    },
    deBonceTime: {
      type: [Number, String],
      default: 500,
    },
    noCallBack: {
      type: Boolean,
      default: false,
    },
    minSearchLen: {
      type: [Number, String],
      default: 0,
    },
    isFixHeight: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    noPage: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    autoSelectInput: {
      type: Array,
      default: () => [],
    },
    manualInput: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "defaultModel",
    event: "tagInput",
  },
  watch: {
    noPage: {
      handler(val) {
        this.initTableConfig.pageConfig.isPage = !val;
      },
      immediate: true,
    },
    tag: {
      handler(newVal) {
        // 在typeConfig 中找到对应的列名，api、查询条件等, 然后获取表格数据
        this.businessConfig = typeConfig[newVal];
      },
      immediate: true,
    },
    queryParams: {
      handler(v) {
        if (this.tag === "PERSON_TABLE4") {
          this.query = {
            areaCode: this.queryParams?.areaCode || "",
            workDept: "",
          };
        } else {
          this.query = { ...v };
        }
      },
      immediate: true,
      deep: true,
    },
    defaultModel: {
      async handler(val) {
        this.inputModel = val || [];
        if (!isEmpty(this.inputModel) && isEmpty(this.inputModel[0].label)) {
          // TODO: 当label为空，但是有label值的时候，去调用接口用作回显， 但是这种情况只能支持单选，如果是多选还需要另外处理 @by Mothpro
          const v = this.inputModel[0].value;
          console.log("this.tag", this.tag);
          if (this.tag === "PERSON_TABLE2") {
            this.radio = "0";
            this.query = {
              areaCode: this.queryParams?.areaCode || "",
              workPost: this.queryParams?.workPost || "",
            };
          } else if (this.tag === "PERSON_TABLE5") {
            this.radio = "1";
            this.query = {
              areaCode: this.queryParams?.areaCode || "",
              workPost: this.queryParams?.workPost || "",
              workDept: this.queryParams?.workDept || "",
              isDeepForWorkDept: "1",
            };
          } else if (this.tag === "PERSON_TABLE4") {
            this.radio = "0";
            this.query = {
              areaCode: this.queryParams?.areaCode || "",
              workDept: "",
            };
          } else if (this.tag === "PERSON_TABLE_RADIO") {
            this.radio = "1";
            this.query = {
              areaCode: this.queryParams?.areaCode || "",
              workDept: this.queryParams?.workDept || "",
            };
          }
          if (isEmpty(v)) return;
          this.businessConfig.searchParams[this.businessConfig.searchField] = v;
          const rsp = await this.getRequest({
            ...this.businessConfig.searchParams,
            ...this.query,
          });
          if (rsp.isSuccess) {
            const records = rsp.data?.records || [];
            if (records.length > 0) {
              const callBackName = this.callBackName
                ? this.callBackName
                : this.businessConfig.callBackName;
              this.inputModel = [
                {
                  ...this.inputModel[0],
                  label: records[0][callBackName.label],
                },
              ];
            }
          }
        }
      },
      immediate: true,
    },
    inputModel: {
      handler(val) {
        this.$emit("tagInput", val);
      },
      immediate: true,
    },
    eval: {
      handler(val) {
        this.inputVal = val;
      },
      immediate: true,
    },
    config: {
      handler(val) {
        this.initTableConfig = LodashMerge({}, this.initTableConfig, val);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      inputVal: "",
      businessConfig: {},
      // 表格数据
      tableData: [],
      // 表格参数配置
      initTableConfig: {
        isSelect: false,
        isIndex: false,
        immateShow: true,
        pageConfig: {
          isPage: true,
          total: 0,
          pageSize: 10,
          currentPage: 1,
        },
      },
      radioVal: "",
      radio: "1",
      // 请求参数
      query: {},
      inputModel: [],
      // 排序的字段名称
      columnNameForTopPrioritySort: "",
      // 排序的字段值
      columnValueForTopPrioritySort: "",
    };
  },
  created() {},
  created() {},
  methods: {
    // 获取输入框里输入的值
    getInputVal() {
      return this.$refs.inputTableCheck.inputVal;
    },
    focus() {
      this.$refs.inputTableCheck.tagsInputDivClick();
    },
    inputTableCheck() {
      this.$refs.inputTableCheck.tagsInputDivClick();
    },
    clearAutoSelectData() {
      this.columnNameForTopPrioritySort = "";
      this.columnValueForTopPrioritySort = "";
    },
    async inputSearch({ value, currentPage, pageSize, type }) {
      if (type === "entry") {
        this.radioVal = value;
        if (this.tag === "PERSON_TABLE_RADIO") {
          if (this.radio == "1") {
            // 本科室
            this.query = { ...this.queryParams };
          } else {
            this.query = {
              areaCode: this.queryParams?.areaCode || "",
              workDept: "",
            };
          }
        }
        if (!this.noPage) {
          // 分页
          this.initTableConfig.pageConfig.currentPage = currentPage;
          this.initTableConfig.pageConfig.pageSize = pageSize;
          this.businessConfig.searchParams = {
            currentPage: currentPage,
            pageSize: pageSize,
          };
        }
        this.$emit("input", value);
        // 若是需要自动匹配输入的数据
        if (!isEmpty(this.autoSelectInput) && !isEmpty(value)) {
          this.clearAutoSelectData();
        }
        await this.initTableData(value);
      } else if (type === "checked") {
        if (!isEmpty(this.autoSelectInput)) {
          const callBackName = this.callBackName
            ? this.callBackName
            : this.businessConfig.callBackName;
          this.columnNameForTopPrioritySort = callBackName.value;
          this.columnValueForTopPrioritySort =
            value[0][this.columnNameForTopPrioritySort];
          this.$emit("selectItem", value, true);
        } else {
          this.$emit("selectItem", value);
        }
      } else if (type === "clear") {
        this.$emit("tagInput", [{ label: "", value: "" }]);
        if (!isEmpty(this.autoSelectInput)) {
          this.clearAutoSelectData();
          this.$emit("selectItem", value, false);
        } else {
          this.$emit("selectItem", "");
        }
      } else if (type === "noDataMatched") {
        this.clearAutoSelectData();
        this.$emit("selectItem", "", false);
      }
    },
    popHide(v) {
      this.radioVal = "";
      this.$emit("popHide", v);
    },
    // 发起请求
    async getRequest(params) {
      const { businessConfig } = this;
      const rsp = await ajax[businessConfig.apiConfig.method](
        businessConfig.apiConfig.url,
        { ...params }
      );
      return rsp;
    },
    // 获取表格数据
    async initTableData(value) {
      const { initTableConfig } = this;
      let { pageConfig } = initTableConfig;
      this.businessConfig.searchParams[this.businessConfig.searchField] = value;
      let p = {
        ...this.businessConfig.searchParams,
        ...this.query,
      };
      if (!isEmpty(this.autoSelectInput)) {
        p = {
          ...p,
          columnNameForTopPrioritySort: this.columnNameForTopPrioritySort,
          columnValueForTopPrioritySort: this.columnValueForTopPrioritySort,
        };
      }
      if (typeof p.dynamicParam !== "string") {
        p.dynamicParam = "";
      }
      const { code, data } = await this.getRequest(p);
      if (code === "0") {
        if (this.noPage) {
          // 没有分页
          if (typeof this.requestAfter === "function") {
            this.tableData = this.requestAfter(data) || [];
          } else {
            this.tableData = data || [];
          }
          return;
        }
        // 分页情况下的数据
        this.tableData = data?.records || [];
        // 分页参数
        pageConfig.total = data?.total || 0;
        pageConfig.pageSize = data?.size || 10;
        pageConfig.currentPage = data?.current || 1;
        this.businessConfig.searchParams = {
          currentPage: data?.current || 1,
          pageSize: data?.size || 10,
        };
      }
    },
    setValue(v) {
      if (isEmpty(v))
        v = [
          {
            label: "",
            value: "",
          },
        ];
      this.$refs.inputTableCheck.setValue(v);
    },
    radioChange(v) {
      if (this.tag === "PERSON_TABLE2") {
        if (v == "1") {
          this.query = { ...this.queryParams };
        } else {
          this.query = {
            areaCode: this.queryParams?.areaCode || "",
            workPost: this.queryParams?.workPost || "",
            workDept: "", // this.queryParams?.workDept || '',
          };
        }
      } else if (this.tag === "PERSON_TABLE5") {
        if (v == "1") {
          this.query = { ...this.queryParams, isDeepForWorkDept: "1" };
        } else {
          this.query = {
            areaCode: this.queryParams?.areaCode || "",
            workPost: this.queryParams?.workPost || "",
            workDept: "", // this.queryParams?.workDept || '',
            isDeepForWorkDept: "",
          };
        }
      } else if (
        this.tag === "PERSON_TABLE4" ||
        this.tag === "PERSON_TABLE_RADIO"
      ) {
        if (v == "1") {
          // 本科室
          this.query = { ...this.queryParams };
        } else {
          this.query = {
            areaCode: this.queryParams?.areaCode || "",
            workDept: "",
          };
        }
      }
      this.$refs.inputTableCheck.tagsInputDivClick();
    },
  },
  render() {
    const { businessConfig, initTableConfig, placeholder, tag } = this;

    let { config } = this;
    config = {
      ...initTableConfig,
      tableData: this.tableData,
      tableColum: businessConfig.tableColum,
      callBackName: this.callBackName
        ? this.callBackName
        : businessConfig.callBackName,
      popWidth: businessConfig.popWidth,
    };
    const scopedSlots =
      tag === "PERSON_TABLE2" ||
      tag === "PERSON_TABLE5" ||
      this.tag === "PERSON_TABLE4" ||
      tag === "PERSON_TABLE_RADIO"
        ? {
            search: (props) => {
              return (
                <div class="flex mb8">
                  <el-radio-group
                    v-model={this.radio}
                    onChange={this.radioChange}
                  >
                    <el-radio key="pt2_0" label="0">
                      全院
                    </el-radio>
                    <el-radio key="pt2_1" label="1">
                      本科室
                    </el-radio>
                  </el-radio-group>
                </div>
              );
            },
          }
        : {};
    return (
      <div class="flex flex-column">
        <wg-input-table-check
          ref="inputTableCheck"
          height={"350px"}
          placeholder={placeholder}
          props={{
            ...this.$props,
            ...this.$attrs,
            config: { ...config },
          }}
          manualInput={this.manualInput}
          eval={this.inputVal}
          v-model={this.inputModel}
          autoSelectInput={this.autoSelectInput}
          oninputSearch={this.inputSearch}
          onPopHide={this.popHide}
          scopedSlots={scopedSlots}
        />
      </div>
    );
  },
};
</script>
<style lang="less" scoped></style>
