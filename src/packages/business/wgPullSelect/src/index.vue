<template>
  <vxe-pulldown
    ref="pullDown"
    @hide-panel="myHidePanel"
    class="wg-pull-table"
    transfer
    v-bind="$attrs"
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
        <div v-if="hasTabs" class="flex mb8">
          <el-radio-group
            @keydown.native.capture.stop
            v-model="radio"
            @change="radioChange"
          >
            <el-radio
              v-for="item in myTabs"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </div>
        <div class="table-box flex-1 height0" tabindex="-1" ref="girdBox">
          <vxe-grid
            ref="grid"
            v-bind="gridOptions"
            @cell-click="cellClick"
            @keydown="tabKey"
            :empty-render="{ name: 'empty' }"
          ></vxe-grid>
        </div>
      </div>
    </template>
  </vxe-pulldown>
</template>

<script>
import { isEmpty } from "@/utils/validate";
export default {
  name: "wgPullSelect",
  props: {
    value: [String, Number],
    dataType: String,
    width: {
      type: [Number, String],
      default: 200,
    },
    height: {
      type: Number,
      default: 352,
    },
    hasTab: {
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
    tabsParams: [Boolean, Object],
    activeTab: String,
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
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tmpRadio: "",
      radio: this.activeTab,
      myTabs: [],
      hasTabs: false,
      tmpValue: "",
      inputValue: "",
      pullDown: null,
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
        data: [],
        keyboardConfig: {
          isArrow: true,
          isEnter: true,
        },
        ...this.config,
      },
    };
  },
  created() {
    this.getTabs();
  },
  computed: {
    getWidth() {
      return this.width;
    },
  },
  watch: {
    config: {
      handler(configVal) {
        // this.getTabs();
        if (configVal.data) this.gridOptions.data = configVal.data;
        this.$nextTick(this.getTabs);
      },
      deep: true,
    },
    activeTab: {
      handler(val) {
        if (val) {
          this.radio = val;
        }
      },
      immediate: true,
    },
    value: {
      handler(newv) {
        if (newv) {
          const cbParams = this.callBackParams ? this.callBackParams : {};
          const tmp = this.gridOptions.data.find(
            (c) => c[cbParams.code] === newv
          );
          if (tmp) this.inputValue = tmp[cbParams.name];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.pullDown = this.$refs.pullDown;
    this.grid = this.$refs.grid;
  },
  methods: {
    // 表格键盘事件
    tabKey(keyEvent) {
      if (keyEvent.$event.keyCode === 13) {
        // 回车选中
        this.cellClick({ row: keyEvent.$table.currentRow });
      }
    },
    getTabs() {
      if (this.tabsParams) {
        // 有tabs关键参数,需要展示tabs
        let myTabsCode = [];
        const myTabs = [];
        this.gridOptions.data.forEach((c) => {
          const code = c[this.tabsParams.code];
          if (code) {
            if (!myTabsCode.includes(code)) {
              myTabsCode.push(code);
              myTabs.push({
                value: code,
                label: c[this.tabsParams.name],
              });
            }
          }
        });
        myTabsCode = null;
        this.myTabs = myTabs;
        if (myTabs.length > 0) {
          this.hasTabs = true;
        }

        this.gridOptions.data = this.config.data.filter(
          (c) => c[this.tabsParams.code] === this.radio
        );
      } else {
        this.myTabs = [];
        this.hasTabs = false;
      }
    },
    radioChange(val) {
      this.gridOptions.data = this.config.data.filter(
        (c) => c[this.tabsParams.code] === val
      );
      this.$nextTick(() => {
        this.$refs.girdBox.focus();
        this.grid?.clearScroll();
        this.getGridFocus();
        // 默认高亮第一行
        this.$refs.grid.setCurrentRow(this.gridOptions.data[0]);
      });
    },
    input(val) {
      if (val) {
        const cbParams = this.callBackParams ? this.callBackParams : {};
        this.gridOptions.data = this.tmpData.filter(
          (c) =>
            c[cbParams.code].indexOf(val) > -1 ||
            c[cbParams.name].indexOf(val) > -1 ||
            c.wbCode?.indexOf(val.toUpperCase()) > -1 ||
            c.pyCode?.indexOf(val.toUpperCase()) > -1
        );
      } else {
        this.gridOptions.data = this.tmpData;
      }
      this.$nextTick(() => {
        this.getGridFocus();
        // 默认高亮第一行
        this.$refs.grid.setCurrentRow(this.gridOptions.data[0]);
      });
    },
    reSetScroll() {
      if (!this.grid) {
        this.grid = this.$refs.grid;
      } else {
        this.grid.clearScroll();
      }
    },

    async initTableData(type) {
      const cbParams = this.callBackParams ? this.callBackParams : {};
      this.reSetScroll();
    },
    setGirdOptions() {
      // this.gridOptions.columns = this.businessConfig.tableColum;
      // this.initTableData();
    },
    cellClick({ row }) {
      const cbParams = this.callBackParams
        ? this.callBackParams
        : this.businessConfig.callBackParams;
      this.$emit("input", row[cbParams.code]);
      this.inputValue = row[cbParams.name];

      this.$emit("select", row, this.radio);
      this.gridOptions.data = this.tmpData;
      this.pullDown.hidePanel();
      setTimeout(() => {
        this.$refs.girdBox.blur();
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
      this.pullDown.showPanel();
      window.popUp = true;

      this.tmpRadio = this.radio;
      this.tmpData = this.gridOptions.data;
      this.tmpValue = this.inputValue;
      this.inputValue = "";
      // 默认高亮第一行
      // try{
      //   this.$refs.grid.setCurrentRow(this.gridOptions.data[0]);
      // }catch(e){}
      this.$nextTick(() => {
        this.getGridFocus();
        // 默认高亮第一行
        this.$refs.grid.setCurrentRow(this.gridOptions.data[0]);
      });
    },
    myHidePanel() {
      this.inputValue = this.tmpValue;
      this.gridOptions.data = this.tmpData;
      this.radio = this.tmpRadio;
      this.tmpRadio = null;
      this.tmpData = null;
      this.tmpValue = null;
    },
    focus() {
      this.$refs.inputTableCheck.focus();
    },
    change(v) {
      //   this.$emit('inputChange',v);
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
  },
};
</script>

<style lang="less" scoped>
.wg-pull-table {
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
}
/deep/ .table-box:focus-visible {
  outline-width: 0px;
}
</style>
