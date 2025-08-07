<script>
import {
  getPageOrg,
  getPageMedInst,
  getPageHospitalArea,
  queryRoadAreaCodeByAreaCode,
  queryRoadOrgCodeByAreaCode,
} from "@/utils/index";
import { getHaveRuleUserHavePermissionOrgPage, queryAuthOrgBySys } from "./api";
import { isEmpty } from "@/utils/validate";
//zzjg 组织机构（科室、病区、药库、药房……） 、 yq 院区 、 yljg 医疗机构、authOrgBySys 工作站授权科室
const CUSTOM_MODE = ["zzjg", "yljg", "yq", "ruleOrg", "authOrgBySys"];
export default {
  name: "wgOrgSelect",
  props: {
    select: Boolean, //是否下拉框模式
    authFlag: Boolean, //是否权限控制(1=是,0=否)，默认为0非权限控制
    isAllSystemUri: Boolean, //是否查询所有工作站权限控制(1=是,0=否)，默认为0 即只查询当前工作站，必须配合 authFlag 参数使用
    inoutCode: String, //来往院区模式的必传字段
    medInstId: String, //医疗机构的id，专门给院区模式使用的，查指定该机构下的所有院区
    clicDetailTypes: String, //细别分类 科室、病区、药房、药库……
    areaCode: String, //院区code
    pid: [String, Number],
    defaultCode: [String, Number],
    value: [String, Number, Array],
    excludeOrgCodes: String,
    includeOrgCodes: String,
    placeholder: {
      type: String,
      default: "请选择",
    },
    immateShow: {
      type: Boolean,
      default: true,
    },
    otherQuery: {
      type: Object,
      default: () => {},
    },

    noPage: {
      //是否需要分页 如果不需要分页，传true
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: CUSTOM_MODE[0],
    },
    multi: {
      // 是否多选
      type: Boolean,
      default: false,
    },
    onlyShowLeaf: {
      type: Boolean,
      default: false,
    },
    multiple: {
      // 下拉模式是否多选
      type: Boolean,
      default: false,
    },
    filterable: {
      // 下拉模式搜索
      type: Boolean,
      default: false,
    },
  },
  // model: {
  //   prop: 'defaultCode',
  //   event: 'input'
  // },
  data() {
    return {
      initialCode: "",
      initialValue: "",
      dataSource: [], //下拉框模式下的数据源，这是非分页的数据
      loading: false, //下拉框模式下的加载状态
      dataSourceTmp: [], //下拉框模式下，用来缓存DataSource的筛选值
      config: {
        tableData: [],
        popWidth: "430",
        isIndex: false,
        immateShow: this.immateShow,
        isSelect: false,
        pageConfig: {
          total: 0,
        },
      },
    };
  },
  watch: {
    clicDetailTypes(newv) {
      //当前是下拉框模式
      this.loading = true;
      this.getRsp(1, 3000, "", "").then((res) => {
        if (res.code === "0") {
          let { data } = res;
          this.loading = false;
          this.dataSource = data?.records || data;
          this.dataSourceTmp = this.dataSourceM;
        }
      });
    },
    areaCode: {
      handler(v) {
        //当前是下拉框模式
        this.loading = true;
        this.getRsp(1, 3000, "", "").then((res) => {
          if (res.code === "0") {
            let { data } = res;
            this.loading = false;
            this.dataSource = data?.records || data;
            this.dataSourceTmp = this.dataSourceM;
          }
        });
      },
    },
    multi: {
      handler(v) {
        this.config.isSelect = v;
      },
      immediate: true,
    },
    defaultCode: {
      handler(val) {
        if (isEmpty(val)) {
          this.initialValue = "";
          this.initialCode = "";
          return;
        }
        if (val === this.initialCode) return;
        this.updateInitialValueFromCode(val);
      },
      immediate: true,
    },
    value: {
      handler(val) {
        if (isEmpty(this.initialValue)) this.initialValue = val;
        if (isEmpty(val)) return (this.initialValue = "");
      },
      immediate: true,
    },
  },
  async created() {
    if (this.select) {
      //当前是下拉框模式
      this.loading = true;
      const { data } = await this.getRsp(1, 3000, "", "");
      this.loading = false;
      this.dataSource = data?.records || data;
      this.dataSourceTmp = this.dataSourceM;
      // console.log(this.dataSourceTmp);
      return;
    }
    if (isEmpty(this.defaultCode)) return;
    await this.updateInitialValueFromCode(this.defaultCode);
  },
  computed: {
    dataSourceM() {
      // console.log('========================:orgSelect========mode:',this);
      switch (this.mode) {
        case CUSTOM_MODE[0]:
        case CUSTOM_MODE[3]:
        case CUSTOM_MODE[4]: {
          return (
            this.dataSource?.map((c) => {
              return this.inoutCode
                ? {
                    itemValue: c.roadOrgCode,
                    itemName: c.roadOrgCodeStr,
                  }
                : {
                    itemValue: c.orgCode,
                    itemName: c.orgName,
                  };
            }) || []
          );
        }
        case CUSTOM_MODE[1]: {
          return this.dataSource.map((c) => {
            return {
              itemValue: c.medInstCode,
              itemName: c.medInstName,
            };
          });
        }
        case CUSTOM_MODE[2]: {
          return this.dataSource.map((c) => {
            return this.inoutCode
              ? {
                  itemValue: c.roadAreaCode,
                  itemName: c.roadAreaCodeStr,
                }
              : {
                  itemValue: c.areaCode,
                  itemName: c.areaName,
                };
          });
        }
      }
    },
    tableConfig() {
      switch (this.mode) {
        case CUSTOM_MODE[0]:
        case CUSTOM_MODE[3]: {
          this.config = {
            ...this.config,
            tableColum: [
              { property: "orgCode", label: "编码" },
              { property: "orgName", label: "名称", width: "150" },
              { property: "clicDetailTypeStr", label: "分类" }, //其实就是细分累呗
              { property: "areaName", label: "院区" },
            ],
            popWidth: this.multi ? "500" : "430",
            callBackName: "orgName",
          };
          if (this.inoutCode) {
            this.config = {
              ...this.config,
              popWidth: "350",
              tableColum: [
                { property: "roadOrgCode", label: "编码", width: "120" },
                { property: "roadOrgCodeStr", label: "科室" },
              ],
              callBackName: "roadOrgCodeStr",
              pageConfig: { currentPage: 1, pageSize: 3000, isPage: false },
            };
          }
          if (this.noPage)
            this.config.pageConfig = {
              currentPage: 1,
              pageSize: 3000,
              isPage: false,
            };
          return this.config;
        }
        case CUSTOM_MODE[1]: {
          this.config = {
            ...this.config,
            popWidth: "350",
            tableColum: [
              { property: "medInstCode", label: "医疗机构编码", width: "110" },
              { property: "medInstName", label: "医疗机构名称名称" },
            ],
            callBackName: "medInstName",
          };
          if (this.noPage) {
            this.config.pageConfig = {
              currentPage: 1,
              pageSize: 3000,
              isPage: false,
            };
            this.config.popWidth = "280";
          }
          return this.config;
        }
        case CUSTOM_MODE[2]: {
          this.config = {
            ...this.config,
            popWidth: "350",
            tableColum: [
              { property: "areaCode", label: "编码", width: "120" },
              { property: "areaName", label: "院区" },
            ],
            callBackName: "areaName",
          };
          if (this.inoutCode) {
            this.config = {
              ...this.config,
              tableColum: [
                { property: "roadAreaCode", label: "编码", width: "120" },
                { property: "roadAreaCodeStr", label: "院区" },
              ],
              callBackName: "roadAreaCodeStr",
              pageConfig: { currentPage: 1, pageSize: 3000, isPage: false },
            };
          }
          if (this.noPage) {
            this.config.pageConfig = {
              currentPage: 1,
              pageSize: 3000,
              isPage: false,
            };
            this.config.popWidth = "240";
          }
          return this.config;
        }
        case CUSTOM_MODE[4]: {
          this.config = {
            ...this.config,
            tableColum: [
              { property: "orgCode", label: "编码", width: "150" },
              { property: "orgName", label: "名称" },
            ],
            popWidth: this.multi ? "500" : "430",
            callBackName: "orgName",
          };
          if (this.inoutCode) {
            this.config = {
              ...this.config,
              popWidth: "350",
              tableColum: [
                { property: "roadOrgCode", label: "编码", width: "120" },
                { property: "roadOrgCodeStr", label: "科室" },
              ],
              callBackName: "roadOrgCodeStr",
              pageConfig: { currentPage: 1, pageSize: 3000, isPage: false },
            };
          }
          if (this.noPage)
            this.config.pageConfig = {
              currentPage: 1,
              pageSize: 3000,
              isPage: false,
            };
          return this.config;
        }
      }
    },
  },
  methods: {
    focus() {
      this.$refs.wgInputTable.$refs.inputRef.focus();
    },
    async updateInitialValueFromCode(code) {
      this.initialCode = code;
      const { data } = await this.getRsp(1, 300, "", this.initialCode);
      const records = data?.records || data;
      // const total = records

      switch (this.mode) {
        case CUSTOM_MODE[0]:
        case CUSTOM_MODE[3]:
        case CUSTOM_MODE[4]: {
          // this.initialValue = records[0]?.orgName || '';
          if (this.multi) {
            // 多选
            let str = [];
            records.filter((item) => {
              str.push(item.orgName);
            });
            this.initialValue = str.toString();
          } else {
            // 单选
            this.initialValue = records[0]?.orgName || "";
          }
          break;
        }
        case CUSTOM_MODE[1]: {
          this.initialValue = records[0]?.medInstName || "";
          break;
        }
        case CUSTOM_MODE[2]: {
          // 当院区配置 inoutCode 情况下，初始化时取 roadAreaCodeStr
          if (this.inoutCode) {
            this.initialValue = records[0]?.roadAreaCodeStr || "";
          } else {
            this.initialValue = records[0]?.areaName || "";
          }
          break;
        }
      }
      // console.log(this.initialValue);
    },
    async getRsp(currentPage, pageSize, value, code = "") {
      const {
        clicDetailTypes,
        areaCode,
        pid,
        mode,
        medInstId,
        inoutCode,
        authFlag,
        isAllSystemUri,
        excludeOrgCodes,
        onlyShowLeaf,
      } = this;

      let reqs = {
        currentPage,
        pageSize,
      };

      let rsp = {};
      switch (mode) {
        case CUSTOM_MODE[0]: {
          //组织机构
          reqs.queryParam = value;
          reqs.clicDetailTypes = clicDetailTypes;
          if (areaCode) reqs.areaCode = areaCode; //组织机构模式下，所属院区
          if (pid) reqs.relationOrgId = pid; //组织机构模式下，根据父级id查子集，比如根据指定科室查病区
          if (code) reqs.orgCodes = code;
          if (!code && this.includeOrgCodes) {
            reqs.orgCodes = this.includeOrgCodes.split(",");
          }
          if (inoutCode) {
            // 支持根据输入检索
            rsp = await queryRoadOrgCodeByAreaCode({
              inoutCode,
              queryParam: value,
              roadAreaCode: areaCode,
            });
            // 根据输入文本过滤数据(不建议)
            // rsp.data = rsp.data.filter(item => {
            //   let flag = false
            //   if (item.roadOrgCodeStr) {
            //     flag = item.roadOrgCodeStr.indexOf(value)>=0
            //   }
            //   return flag
            // })
          } else {
            //这里是查询权限控制相关
            if (authFlag) {
              reqs.authFlag = 1;
              //isAllSystemUri 只有在authFlag为1的情况下才生效
              if (isAllSystemUri) reqs.isAllSystemUri = 1;
            }
            if (excludeOrgCodes) reqs.excludeOrgCodes = excludeOrgCodes;
            reqs.onlyShowLeaf = onlyShowLeaf ? "1" : "0";
            rsp = await getPageOrg({
              ...reqs,
              ...this.otherQuery,
            });
          }
          break;
        }
        case CUSTOM_MODE[1]: {
          //医疗机构
          reqs.medInstName = value;
          if (code) reqs.medInstCode = code;
          rsp = await getPageMedInst(reqs);
          break;
        }
        case CUSTOM_MODE[2]: {
          //院区
          if (medInstId) reqs.medInstId = medInstId;
          if (code) reqs.areaCode = code;
          reqs.areaName = value;

          if (inoutCode) {
            // reqs.inoutCode = inoutCode;
            rsp = await queryRoadAreaCodeByAreaCode({ inoutCode });
          } else {
            //这里是查询权限控制相关
            if (authFlag) {
              reqs.authFlag = 1;
              //isAllSystemUri 只有在authFlag为1的情况下才生效
              if (isAllSystemUri) reqs.isAllSystemUri = 1;
            }
            rsp = await getPageHospitalArea(reqs);
          }
          break;
        }
        case CUSTOM_MODE[3]: {
          //组织机构
          reqs.orgCode = code || "";
          reqs.queryParam = value;
          rsp = await getHaveRuleUserHavePermissionOrgPage({
            ...reqs,
            ...this.otherQuery,
          });
          break;
        }
        case CUSTOM_MODE[4]: {
          //组织机构
          reqs.orgCode = code || "";
          reqs.queryParam = value;
          rsp = await queryAuthOrgBySys({
            ...reqs,
            ...this.otherQuery,
          });
          break;
        }
      }
      return rsp;
    },
    async inputSearch(params) {
      // console.log(params);
      // console.log('=================this.initVal=================',this.initialValue);

      //这里是触发了inputTable的点击事件
      const { currentPage, pageSize, type, value } = params;
      // this.initialCode = value.orgCode;
      // if (type !== 'entry') return this.$emit('selectItem', value);
      if (type !== "entry") {
        this.initialCode = value.orgCode;
        switch (this.mode) {
          case CUSTOM_MODE[0]: {
            this.initialValue = value.orgName;
            break;
          }
          case CUSTOM_MODE[1]: {
            this.initialValue = value.medInstName;
            break;
          }
          case CUSTOM_MODE[2]: {
            this.initialValue = value.areaName;
            break;
          }
        }
        return this.$emit("selectItem", value);
      }

      const { data } = await this.getRsp(currentPage, pageSize, value);
      const records = data?.records || data;
      const total = data?.total || 0;

      this.tableConfig.pageConfig = { total, currentPage, pageSize };
      this.tableConfig.tableData = records;
    },
    mychange(v) {
      const item = this.dataSourceM.find((item) => item.itemValue === v);
      this.$emit("selectItemObj", item);
      this.$emit("selectItem", v);
      this.$emit("input", v);
      if (this.mode === "zzjg") {
        const r = this.dataSource.find((item) => item.orgCode === v);
        this.$emit("selectRecord", r);
      }
    },
  },

  render() {
    const {
      tableConfig,
      initialValue,
      select,
      dataSourceM,
      loading,
      placeholder,
    } = this;
    const { inputSearch } = this;
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };

    // console.log("================select:",this.value);
    return select ? (
      <wg-el-select
        {...{ props }}
        {...{ on }}
        v-loading={loading}
        value={this.value}
        onchange={this.mychange}
        // v-model={this.defaultValue}
        // onvisible-change={this.reflsh}
        // filter-method={(v) => {
        //   c.dataFilter(v, i);
        // }}
      >
        {dataSourceM.map((item) => {
          return (
            <wg-el-option
              key={item.itemValue}
              label={item.itemName}
              value={item.itemValue}
            />
          );
        })}
      </wg-el-select>
    ) : (
      <wg-input-table
        ref="wgInputTable"
        {...{ props }}
        {...{ on }}
        style="width:100%"
        height={"200px"}
        eval={initialValue}
        placeholder={placeholder}
        config={tableConfig}
        oninputSearch={inputSearch}
      />
    );
  },
};
</script>

<style lang="less" scoped>
@import "./main.less";
</style>
