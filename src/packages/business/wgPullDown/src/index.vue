<template>
  <vxe-pulldown
    ref="pullDown"
    class="wg-pull-table"
    transfer
    v-bind="$attrs"
    v-on="$listeners"
    @hide-panel="hide"
  >
    <template #default>
      <wg-el-input
        v-model="inputValue"
        v-bind="$attrs"
        ref="inputTableCheck"
        :placeholder="placeholder"
        @focus="myFocus"
        @clear="handerClear"
        @input="input"
        @change="change"
      ></wg-el-input>
    </template>
    <template #dropdown>
      <div
        class="drop-down-table flex flex-column"
        :style="{ width: getWidth + 'px', height: height + 'px' }"
      >
        <div v-if="myHasTab" class="flex mb8 jsb ac">
          <el-radio-group v-model="radio" @change="radioChange">
            <el-radio
              v-for="item in myTabs"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
          <wg-button type="text" @click="setCy" v-if="showSetCommon"
            >设为常用</wg-button
          >
        </div>
        <div class="table-box flex-1 height0" v-loading="loading">
          <vxe-grid
            ref="grid"
            v-loading="loading"
            v-bind="gridOptions"
            @cell-click="cellClick"
            @checkbox-change="checkboxChange"
            @checkbox-all="checkboxAll"
            @keydown="tabKey"
            :empty-render="{ name: 'empty' }"
          >
            <template #yaopingDrugName="{ row }">
              <div class="flex align-center">
                <span
                  class="mr4"
                  v-if="row.stopFlagPlan === '0'"
                  style="
                    color: #f12727;
                    font-size: 10px;
                    font-weight: bolder;
                    border: 1px solid #f12727;
                    border-radius: 20px;
                    padding: 0px 8px;
                  "
                  >停用</span
                >
                <!--<wg-icon v-if="row.stopFlagPlan==='0'" name="icon-a-Group89" style="font-size:32px;margin-right:8px" />-->
                <p class="more-txt">{{ row.drugName }}</p>
              </div>
            </template>
          </vxe-grid>
        </div>
        <div class="flex jfe mt12" v-if="!noPage">
          <wg-pagination
            class="pagination"
            simple
            small
            :page-sizes="pager.pageSizeArr"
            :total="pager.total"
            :page.sync="pager.currentPage"
            :limit.sync="copyPageSize"
            @pagination="paginationChange"
          >
          </wg-pagination>
        </div>
      </div>
    </template>
  </vxe-pulldown>
</template>

<script>
import config from "./type.js";
import ajax from "@/api/http.js";
import { isEmpty } from "@/utils/validate";
export default {
  name: "wgPullDown",
  props: {
    mountedCreate: {
      type: Boolean,
      default: false,
    },

    multiple: Boolean,
    value: [String, Number],
    dataType: String,
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizeArr: {
      type: Array,
      default: () => [10, 20, 30],
    },
    isAttachment: {
      //医嘱核对、费用查询-补记账、医嘱补记账、其他补记账添加附加项目时希望检索结果能默认30条/页
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 352,
    },
    hasTab: {
      type: Boolean,
      default: false,
    },
    watchInput: {
      // 需要监听inputValue时传true
      type: Boolean,
      default: false,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    tagType: String,
    immateShow: {
      type: Boolean,
      default: true,
    },
    defaultCode: [String, Number],
    callBackParams: [Boolean, Object],
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    tag: {
      type: String,
      default: "",
    },
    setBack: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    noPage: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    clxmPageSize: Number,
    showSetCommon: {
      default: false,
      type: Boolean,
    },
    isClearInput: {
      default: false,
      type: Boolean,
    },
    // 自动匹配输入的数据
    autoSelectInput: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const tabs = this.getTabsFromTag(this.tag);
    const hasTab = this.gethasTabFromTag(this.tag);
    const radio = this.getTagRadio(tabs); //tabs[0]?.value || '';
    console.log(radio, this.dataType, this.multiple, "---< typexxxxxxxxx");
    const businessConfig = hasTab ? config[radio] : config[this.dataType];
    const columns_t = businessConfig?.tableColum || [];
    const columns = this.multiple
      ? [{ type: "checkbox", width: 28, align: "center" }, ...columns_t]
      : columns_t;
    return {
      myTabs: tabs,
      myHasTab: hasTab,
      radio,
      inputValue: "",
      onlyClxmPageSize: 10,
      pager: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizeArr: [10, 20, 30, 40, 50, 100],
      },
      copyPageSize: 10,
      businessConfig,
      pullDown: null,
      selectData: [],
      grid: null,
      loading: false,
      gridOptions: {
        border: true,
        resizable: true,
        showOverflow: true,
        height: "auto",
        align: "left",
        rowConfig: {
          isHover: true,
          isCurrent: true,
        },
        columns,
        data: [],
        keyboardConfig: {
          isArrow: true,
          isEnter: true,
        },
      },
      selectRow: {}, // 回显时不输入内容 不用清空
      timer: null,
    };
  },
  created() {
    this.inputValue = this.value;
    if (this.pageSize === 50) {
      // 诊断开立特殊处理
      this.pager.pageSize = 50;
      this.businessConfig.searchParams.pageSize = 50;
      this.pager.pageSizeArr = [10, 20, 30, 40, 50];
    }
  },
  computed: {
    getWidth() {
      return this.width ?? this.businessConfig.popWidth;
    },
  },
  watch: {
    clxmPageSize: {
      handler(val) {
        this.onlyClxmPageSize = val;
      },
      immediate: true,
    },
    tagType: {
      handler(newValue) {
        if (newValue) {
          this.radio = newValue;
          this.businessConfig = config[newValue];
          this.gridOptions.columns = this.multiple
            ? [
                { type: "checkbox", width: 28, align: "center" },
                ...config[newValue].tableColum,
              ]
            : config[newValue].tableColum;
        }
      },
      immediate: true,
    },
    dataType: {
      handler(newValue) {
        const hasTab = this.gethasTabFromTag(this.tag);
        if (!hasTab) {
          this.businessConfig = config[newValue];
          this.gridOptions.columns = config[newValue].tableColum;
        }
      },
      immediate: true,
    },
    value: {
      handler(newv) {
        if (newv) {
          let self = this;
          if (this.watchInput) {
            console.log("this.watchInput+++", this.watchInput, this.inputValue);
            // 在未保存情况下，给输入框传值,组件内时刻更新inputValue
            this.inputValue = newv;
          }
          this.$nextTick(() => {
            // 修复分页数据为空问题
            self.businessConfig.searchParams[this.businessConfig.searchField] =
              newv;
            self.initTableData("focus");
          });
        } else {
          this.inputValue = "";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.pullDown = this.$refs.pullDown;
    this.grid = this.$refs.grid;
    if (this.mountedCreate && !this.value) {
      this.focus();
    }
  },
  methods: {
    // 表格键盘事件
    tabKey(keyEvent) {
      if (keyEvent.$event.keyCode === 13) {
        // 回车选中
        if (this.upLoading) return (this.upEntty = true); // 当还在调用接口的时候，回车事件需要等接口调用完成才能启用;
        this.cellClick({ row: keyEvent.$table.currentRow });
      }
    },
    deBonce(fn, timeout) {
      // 利用函数本身也是对象，使用函数本身的静态成员来存储定时器ID
      //1.先清除上一次触发事件 的定时器
      clearTimeout(this.deBonce.timeID);
      //2.以最后一次触发 为准
      this.deBonce.timeID = setTimeout(fn, timeout);
    },
    getTabsFromTag() {
      switch (this.tag) {
        case "clinic": {
          return [
            { label: "材料项目", value: "CAI_LIAO_XM" },
            { label: "计价项目", value: "JI_JIA_XM" },
          ];
        }
        case "clinic2": {
          return [
            {
              label: "全部",
              value: "JI_JIA_CAI_LIAO_XM",
            },
            { label: "材料项目", value: "CAI_LIAO_XM" },
            { label: "计价项目", value: "JI_JIA_XM" },
          ];
        }
        default:
          return this.tabs;
      }
    },
    getTagRadio(tabs) {
      let index = tabs.findIndex((c) => c.value === this.tagType);
      if (index === -1) index = 0;
      return tabs[index]?.value || "";
    },
    gethasTabFromTag() {
      switch (this.tag) {
        case "clinic": {
          return true;
        }
        case "clinic2": {
          return true;
        }
        default:
          return this.hasTab;
      }
    },
    async setCy() {
      console.log("==============> setCy", this.selectData);
      const params = [];
      this.selectData.forEach((item) => {
        params.push({
          drugSpec: item.specificationValue,
          feeItemId: item?.itemCode || item.materialCode,
          feeItemName: item?.itemName || item.materialName,
          itemType: item?.itemType || !isEmpty(item.materialCode) ? "3" : "1",
          modelValue: item.modelValue,
          unit: item.measureName,
          unitPrice: item.sellPrice,
        });
      });
      const rsp = await ajax["post"]("/bcs/commonItem/setCommon", params);
      if (+rsp.code === 0) {
        this.$message.success("操作成功！");
      }
    },
    radioChange(val) {
      this.$emit("typeChange", val);
      this.gridOptions.columns = this.multiple
        ? [
            { type: "checkbox", width: 28, align: "center" },
            ...config[val].tableColum,
          ]
        : config[val].tableColum;
      this.businessConfig = config[val];
      this.pager.currentPage = 1;
      this.businessConfig.searchParams.currentPage = 1;
      this.setClxmPageSize();
      this.myFocus();
      this.initTableData();
    },
    setClxmPageSize() {
      if (
        this.radio === "CAI_LIAO_XM" &&
        this.onlyClxmPageSize &&
        !this.isAttachment
      ) {
        this.pager.pageSize = this.onlyClxmPageSize;
        this.pager.pageSizeArr = [50, 100, 150];
        this.businessConfig.searchParams.pageSize = this.onlyClxmPageSize;
      } else if (this.isAttachment) {
        this.pager.pageSize = this.pageSize;
        this.pager.pageSizeArr = this.pageSizeArr;
        this.businessConfig.searchParams.pageSize = this.pageSize;
      } else {
        this.pager.pageSize = 10;
        this.pager.pageSizeArr = [10, 20, 30];
        this.businessConfig.searchParams.pageSize = 10;
        if (this.pageSize === 50) {
          this.businessConfig.searchParams.pageSize = 50;
          this.pager.pageSize = 50;
          this.pager.pageSizeArr = [10, 20, 30, 40, 50];
        }
      }
    },
    input(val) {
      console.log("=============> val  val ", val);
      this.upLoading = true;
      let self = this;
      this.$nextTick(() => {
        self.deBonce(() => {
          self.businessConfig.searchParams[self.businessConfig.searchField] =
            val;
          self.$emit("inputChange", val);
          self.initTableData();
          if (!self.pullDown.isPanelVisible()) {
            self.pullDown.showPanel();
            window.popUp = true;
          }
          this.getGridFocus();
        }, 500);
      });
    },
    reSetScroll() {
      if (!this.grid) {
        this.grid = this.$refs.grid;
      } else {
        this.grid.clearScroll();
      }
    },
    paginationChange(val) {
      this.businessConfig.searchParams.currentPage = val.page;
      this.businessConfig.searchParams.pageSize = val.limit;
      this.initTableData();
    },
    async getRequest(params) {
      const rsp = await ajax[this.businessConfig.apiConfig.method](
        this.businessConfig.apiConfig.url,
        { ...params }
      );
      return rsp;
    },
    async initTableData(type) {
      const cbParams = this.callBackParams
        ? this.callBackParams
        : this.businessConfig.callBackParams;
      this.loading = true;
      this.reSetScroll();
      // console.log("searchParams:",this.businessConfig.searchParams);
      console.log(this.queryParams, this.params);
      const { code, data } = await this.getRequest({
        ...this.businessConfig.searchParams,
        ...this.params,
        ...this.queryParams,
      });
      this.loading = false;
      if (code === "0") {
        this.selectData = [];
        this.gridOptions.data = data.records || data || [];
        // 默认高亮第一行
        try {
          this.$refs.grid.setCurrentRow(this.gridOptions.data[0]);
        } catch (e) {}
        // if(this.dataType === 'CAI_LIAO_XM_NEW' || this.dataType === 'CAI_LIAO_XM' || this.radio === 'CAI_LIAO_XM'){
        // console.log('新材料库存组件');
        // console.log('data.records=========>', data.records);
        // let arr = [];
        // data.records.forEach( (c, i)=>{
        //   if(!isEmpty(c.inventoryInfoList)){
        //     //库存不为空
        //     c.inventoryInfoList.forEach((t)=>{
        //       arr.push({
        //         ...c,
        //         inventoryInfoList:null,
        //         ...t
        //       })
        //     });
        //   }else{
        //     arr.push({
        //       ...c,
        //       inventoryNum:0,
        //       hlsInventoryId:'-',
        //     });
        //   }
        // });
        // this.gridOptions.data = arr;
        // }

        if (
          (type === "focus" && this.setBack) ||
          this.gridOptions.data.length === 1
        ) {
          this.setCallBackName(this.gridOptions.data);
        }
        this.pager.total = data.total;
        if (!this.grid) this.grid = this.$refs.grid; //表格没有加载出来的话不会获取到refs

        this.upLoading = false;
        if (this.upEntty) {
          this.upEntty = false;
          // console.log('===========> 需要调用回车事件，之前有被终止过', this.gridOptions.data);
        }
      }
    },
    setGirdOptions() {
      // this.gridOptions.columns = this.businessConfig.tableColum;
      // this.initTableData();
    },
    checkboxChange(props) {
      if (!this.multiple) {
        return;
      }
      // const cbParams = this.callBackParams ? this.callBackParams : this.businessConfig.callBackParams;
      this.selectData = props.records;
      // const row = isEmpty(this.selectData[0]) ? [] : this.selectData[0];
      // this.$emit('input', row[cbParams.code]);
      // this.inputValue = row[cbParams.name];
      // const checkType = isEmpty(this.radio) ? this.dataType : this.radio;
      // this.$emit('select', this.selectData, checkType);
      // console.log('==============> props', this.selectData);
    },
    checkboxAll(props) {
      if (!this.multiple) {
        return;
      }
      // const cbParams = this.callBackParams ? this.callBackParams : this.businessConfig.callBackParams;
      this.selectData = props.records;
      // const row = isEmpty(this.selectData[0]) ? [] : this.selectData[0];
      // this.$emit('input', row[cbParams.code]);
      // this.inputValue = row[cbParams.name];
      // const checkType = isEmpty(this.radio) ? this.dataType : this.radio;
      // this.$emit('select', this.selectData, checkType);
      // console.log('==============> props', this.selectData);
    },
    cellClick({ row, $columnIndex }) {
      if (this.multiple && $columnIndex === 0) {
        // 如果是多选的复选框，不走这个逻辑
        return;
      }
      const cbParams = this.callBackParams
        ? this.callBackParams
        : this.businessConfig.callBackParams;
      this.$emit("input", row[cbParams.code]);
      this.inputValue = row[cbParams.name];
      console.log("this.inputValue", this.inputValue);
      const checkType = isEmpty(this.radio) ? this.dataType : this.radio;
      // 是否需要自动匹配输入的数据
      if (!isEmpty(this.autoSelectInput)) {
        this.$emit("select", row, checkType, true);
      } else {
        this.$emit("select", row, checkType);
      }
      this.selectRow = row;
      this.pullDown.hidePanel();
      setTimeout(() => {
        this.grid?.blur();
      }, 100);
      window.popUp = false;
    },
    getGridFocus() {
      // 使表格获取焦点
      setTimeout(async () => {
        const isPanelVisible = await this.pullDown.isPanelVisible();
        if (isPanelVisible) {
          this.$refs.grid.focus();
        }
      }, 500);
    },
    myFocus() {
      this.$emit("beforeShow", this.radio);
      this.$nextTick(async () => {
        this.businessConfig.searchParams.currentPage = 1;
        this.businessConfig.searchParams[this.businessConfig.searchField] =
          this.inputValue;
        this.setClxmPageSize();
        this.initTableData("focus");
        if (this.immateShow) {
          this.pullDown.showPanel();
          window.popUp = true;
        }
        this.getGridFocus();
      });
    },
    focus() {
      this.$refs.inputTableCheck.focus();
    },
    setCallBackName(data) {
      console.log(data);
      const cbParams = this.callBackParams
        ? this.callBackParams
        : this.businessConfig.callBackParams;
      const isExit = data.filter((item) => {
        const t = cbParams?.backCodes
          ? `${cbParams.code},${cbParams.backCodes}`
          : cbParams.code;
        const str = t.split(",");
        let index = str.findIndex(
          (c) =>
            String(item[c]) === String(this.value) ||
            String(item[c]) === String(this.inputValue)
        );
        return index > -1;
      })[0];
      if (isExit) {
        if (this.value !== isExit[cbParams.code]) {
          this.cellClick({ row: isExit });
        } else {
          this.inputValue = isExit[cbParams.name];
        }
      }
    },
    change(v) {
      this.selectRow = null;
      this.$emit("inputChange", v);
    },
    handerClear() {
      const checkType = isEmpty(this.radio) ? this.dataType : this.radio;
      this.$emit("input", "");
      this.$emit("select", "", checkType);
      this.$emit("update:value", "");
    },
    clearInput() {
      this.inputValue = "";
      this.$emit("update:value", "");
    },

    /**
     * 遍历表格数据，精准匹配后返回该数据
     */
    async autoSelectData() {
      const tval = this.autoSelectInput;
      const data = this.gridOptions.data.filter((item) => {
        for (let i = 0; i < tval.length; i++) {
          const index = tval[i];
          if (item[index] === this.inputValue) {
            return item;
          }
        }
      });
      const row = isEmpty(data) ? [] : data[0];
      const checkType = isEmpty(this.radio) ? this.dataType : this.radio;
      if (isEmpty(data)) {
        this.$emit("select", "", checkType, false);
      } else {
        const cbParams = this.callBackParams
          ? this.callBackParams
          : this.businessConfig.callBackParams;
        this.$emit("input", row[cbParams.code]);
        this.$emit("select", row, checkType, true);
      }
    },
    hide() {
      // 是否需要自动匹配输入的数据
      if (!isEmpty(this.autoSelectInput)) {
        this.autoSelectData();
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (this.isClearInput && !this.selectRow) {
          this.clearInput();
          this.$emit("hide");
        }
        clearTimeout(this.timer);
        this.timer = null;
      }, 300);
    },
  },
};
</script>

<style lang="less" scoped>
.wg-pull-table {
}
/deep/ .vxe-pulldown--panel {
  z-index: 100000 !important;
}
/deep/ .vxe-table--render-default {
  z-index: 90000 !important;
}
/deep/ .vxe-select--panel {
  z-index: 99999 !important;
}
.box-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  .box-grid {
    width: 1450px;
    height: 500px;
  }
}
.drop-down-table {
  background: #fff;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  color: #606266;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  word-break: break-all;
  .jfe {
    /deep/ .pagination {
      .el-input__inner {
        height: 20px;
        line-height: 20px;
        padding: 0 8px;
      }
      .el-input__suffix {
        top: -2px;
      }
      .vxe-pager--goto {
        border-radius: 2px;
      }
      .vxe-pager--sizes {
        margin-right: 0;
        .vxe-input--inner {
          border-radius: 2px;
        }
      }
    }
  }
}
.align-center {
  align-items: center;
}
.more-txt {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
