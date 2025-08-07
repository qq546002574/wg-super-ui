<template>
  <el-popover
    v-model="popShow"
    :placement="placement"
    :width="tableConfig.popWidth"
    :trigger="triggerType"
    @after-enter="popvorShow"
    @hide="popvorHide"
    :disabled="disabled"
    :popper-append-to-body="false"
    :popper-options="{ boundariesElement: 'viewport', removeOnDestory: true }"
    :popper-class="popperClass"
    transition="el-zoom-in-top"
    class="wgInputTable"
    ref="tablePopover"
  >
    <slot name="search"></slot>
    <div :style="{ 'max-width': maxWidth }">
      <wg-table
        class="wg-input-table"
        v-loading="loadingFlag"
        ref="multipleTable"
        :height="height"
        :max-height="maxHeight"
        :border="tableConfig.border"
        :stripe="tableConfig.stripe"
        :highlight-current-row="tableConfig.highlight"
        :data="tableConfig.tableData"
        :row-style="rowStyle"
        @selection-change="handleSelectionChange"
        @row-click="handleClickTableRow"
        @select="checkBoxSelect"
        @select-all="selectAll"
      >
        <wg-table-column v-if="tableConfig.isSelect" type="selection">
        </wg-table-column>
        <wg-table-column
          v-if="tableConfig.isIndex"
          type="index"
          label="序号"
          width="55"
        ></wg-table-column>
        <template v-for="(item, index) in tableConfig.tableColum">
          <wg-table-column :key="index" v-bind="item"></wg-table-column>
        </template>
      </wg-table>
    </div>
    <!--分页区域 -->
    <wg-pagination
      v-if="tableConfig.pageConfig.isPage"
      class="pagination"
      simple
      small
      :page-sizes="tableConfig.pageConfig.pageSizeArr"
      :total="tableConfig.pageConfig.total"
      :page.sync="copyCurrentPage"
      :limit.sync="copyPageSize"
      @pagination="paginationChange"
    >
    </wg-pagination>
    <div class="btnDiv" v-if="tableConfig.isSelect">
      <wg-button @click="popShow = false">取消</wg-button>
      <wg-button primary @click="submitSelect">确定</wg-button>
    </div>
    <div
      slot="reference"
      :class="['tags_input_div', { isFixHeight: isFixHeight }]"
      :style="outMaxWidth"
      @click="tagsInputDivClick"
    >
      <div class="tagsDiv" v-if="tableConfig.isSelect && tagsData[0]">
        <template v-if="collapseTags">
          <el-tag
            size="mini"
            type="info"
            :closable="!disabled"
            @close="tagsClose(tagsData[0])"
            >{{ getTagsName(tagsData[0]) }}</el-tag
          >
          <div class="tagsCount" v-if="tagsData.length !== 1">
            + {{ tagsData.length - 1 }}
          </div>
        </template>
        <template v-else>
          <el-tag
            v-for="(tag, index) in tagsData"
            :key="index"
            size="mini"
            type="info"
            :closable="!disabled"
            @close="tagsClose(tag)"
            >{{ getTagsName(tag) }}</el-tag
          >
        </template>
      </div>
      <wg-el-input
        ref="inputRef"
        :class="['tags_input', { paddLR5: tableConfig.isSelect }]"
        v-model="inputVal"
        v-on="$listeners"
        v-bind="$attrs"
        :disabled="disabled"
        :clearable="clearable"
        @keyup.native="tabKey"
        @focus="inputFocus"
        @blur="inputBlurFoucus"
        @keyup.enter.native="inputChange(inputVal)"
        @input="evalFlag = false"
        @clear="clear"
        :style="inputMaxWidth"
      >
        <wg-icon :name="iconName" slot="suffix" class="selectIcon"></wg-icon>
      </wg-el-input>
    </div>
  </el-popover>
</template>
<script>
import LodashMerge from "lodash.merge";
export default {
  name: "wgInputTable",
  data() {
    return {
      triggerType: "manual",
      // 键盘事件
      dataRow: "", // 当前已选择行
      dataIndex: 0, // 当前选择行的index
      enterFlag: false, // 回车选择

      copyTableColumn: [],
      inputLength: 20,
      inputWidth: 0,
      evalFlag: false,
      tagsData: [],
      resInputFlag: false,
      loadingFlag: true,
      popShow: false,
      inputVal: "",
      selectData: [],
      copyPageSize: 10,
      copyCurrentPage: 1,
      tableConfig: {
        immateShow: false,
        popWidth: {},
        callBackName: "",
        isSelect: true,
        isIndex: true,
        border: true,
        stripe: false,
        highlight: true,
        tableColum: [],
        tableData: [],
        pageConfig: {
          isPage: true,
          total: 0,
          pageSize: 10,
          currentPage: 1,
          pagerCount: 5,
          pageSizeArr: [10, 20, 30, 40, 50, 100],
        },
      },
      maxHeight: 350,
    };
  },
  props: {
    height: String,
    maxWidth: {
      type: String,
      default: "800px",
    },
    eval: {
      type: [String, Number],
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
    clearable: {
      type: Boolean,
      default: true,
    },
    setValue: {
      type: Boolean,
      default: false,
    },
    popperClass: String,
  },
  model: {
    // 实现v-model
    prop: "eval",
  },
  watch: {
    config: {
      handler(val) {
        this.tableConfig.tableData = [];
        this.tableConfig = LodashMerge({}, this.tableConfig, val);
        const { isSelect, tableColum, pageConfig } = this.tableConfig;
        let { pageSize, currentPage } = pageConfig;
        this.copyTableColumn = tableColum;
        this.copyPageSize = pageSize;
        this.copyCurrentPage = currentPage;
        this.tableConfig.pageConfig.pageSizeArr = val.pageConfig.pageSizeArr; // 不重新赋值会出现数据混合的问题
        this.loadingFlag = false;

        // 所有的唤起方式固定为聚焦就触发
        // this.tableConfig.immateShow = true;

        // 多选的时候默认选中
        if (isSelect) {
          this.$nextTick(() => {
            this.initSelect();
          });
        }
        /**
         * boundariesElement 默认的是body!
         * 如果里面数据动态化之后有问题，需获取到数据之后要
         * this.$refs.popover.updatePopper()一下（用来重新计算位置的）
         * */
        this.$nextTick(() => {
          this.$refs.tablePopover.updatePopper();
        });
      },
      immediate: true,
      deep: true,
    },
    eval: {
      handler(val) {
        this.enterFlag = false;
        this.resInputFlag = false;
        const { isSelect } = this.tableConfig;
        this.tagsData = [];
        this.selectData = [];
        if (isSelect) {
          if (val) {
            this.tagsData = val.split(",");
          }
        } else {
          this.inputVal = val;
        }
      },
      immediate: true,
    },
    inputVal(val, oldVal) {
      const newVal = val;
      const newOldVal = oldVal;
      if (
        this.evalFlag ||
        this.resInputFlag ||
        newVal === newOldVal ||
        this.enterFlag ||
        this.setValue
      )
        return;
      // 值不是空格
      if (newVal !== newOldVal) {
        this.$nextTick(() => {
          // 防抖
          this.deBonce(() => {
            if (newVal.length > this.minSearchLen) {
              this.inputChange(newVal);
            } else {
              if (newVal.length > 0) {
                this.$message.warning(
                  "检索长度需超过" + this.minSearchLen + "!"
                );
              }
              // input的值为空
              this.callBackAction({
                value: newVal,
                type: "entry",
              });
              // this.popShow = false;
            }
          }, this.deBonceTime);
        });
      }
    },
    popShow(val, oldVal) {
      this.$nextTick(() => {
        this.$refs.tablePopover.updatePopper();
      });
    },
  },
  computed: {
    iconName() {
      return this.popShow ? "icon-zuojiantou-1" : "icon-zuojiantou1";
    },
    inputMaxWidth() {
      const { isSelect } = this.tableConfig;
      const styleObj = {
        // width: this.inputLength / (this.inputWidth - 32) + 4 + '%',
        width: "100px",
        maxWidth: this.inputWidth + "px",
      };
      const hasForm = this.inputWidth === 2 ? {} : styleObj;
      return isSelect ? hasForm : {};
    },
    outMaxWidth() {
      const { isSelect } = this.tableConfig;
      const selectMaxWidth = { maxWidth: this.inputWidth + "px" };
      const hasForm = this.inputWidth === 2 ? {} : selectMaxWidth;
      return isSelect ? hasForm : {};
    },
  },
  mounted() {
    setTimeout(() => {
      this.inputWidth = this.$el.clientWidth;
      if (this.tableConfig.isSelect) {
        this.inputWidth = 300;
      }
    }, 200);
  },
  methods: {
    tagsInputDivClick() {
      this.$refs.inputRef.focus();
    },
    focus() {
      this.$refs.inputRef.focus();
    },
    getTagsName(data) {
      if (typeof data === "string") {
        // 有初始值
        return data;
      } else {
        return data[this.tableConfig.callBackName];
      }
    },
    deBonce(fn, timeout) {
      // 利用函数本身也是对象，使用函数本身的静态成员来存储定时器ID
      //1.先清除上一次触发事件 的定时器
      clearTimeout(this.deBonce.timeID);
      //2.以最后一次触发 为准
      this.deBonce.timeID = setTimeout(fn, timeout);
    },
    // 上键
    keyUp(tableData) {
      if (this.dataIndex == 0) {
        //当选中的index等于0时，说明到顶了，再按上键就要返回到表格的底部，并计算距离表格顶部的距离
        this.dataIndex = tableData.length - 1;
        this.dataRow = tableData[this.dataIndex]; // 当前已选择行
        let height = 39;
        this.$refs.multipleTable.bodyWrapper.scrollTop =
          height * (tableData.length - 4);
      } else {
        this.dataIndex = this.dataIndex - 1;
        this.dataRow = tableData[this.dataIndex];
        let height = 39;
        this.$refs.multipleTable.bodyWrapper.scrollTop += -(height * 1);
      }
    },
    // 下键
    keyDown(tableData) {
      if (this.dataIndex == tableData.length - 1) {
        this.dataIndex = 0; //当选中的index与数据的天数相等时，在按下键就要返回第一个
        this.dataRow = tableData[0];
        let height = 39; //计算表格一行的高度，用于出现滚动条的时候，页面展示选中的某一行
        this.$refs.multipleTable.bodyWrapper.scrollTop = -(
          height *
          (tableData.length - 6)
        );
      } else {
        if (
          this.dataIndex > 3 &&
          this.dataIndex < this.tableConfig.pageConfig.pageSize + 2
        ) {
          let height = 39; //计算选中行离表格顶部的距离
          this.$refs.multipleTable.bodyWrapper.scrollTop =
            height * this.dataIndex;
        }
        this.dataRow = tableData[this.dataIndex + 1]; // 当前已选择行
        this.dataIndex = this.dataIndex + 1;
      }
    },
    // 上下移动的时候改变颜色
    rowStyle(row) {
      // this.tableConfig.isSelect
      if (!this.openKeyboard) return;
      if (row.rowIndex === this.dataIndex) {
        return {
          "background-color": "#edf5fa",
        };
      }
    },
    // 键盘操作
    tabKey(event) {
      if (!this.openKeyboard) return;
      const tableData = this.tableConfig.tableData;
      // 表格为空，不执行下方
      if (tableData.length == 0) {
        return;
      }
      if (event.keyCode === 40) {
        // 向下
        this.keyDown(tableData);
      } else if (event.keyCode == 38) {
        // 向上
        this.keyUp(tableData);
      } else if (event.keyCode == 13) {
        // 回车勾选
        if (this.dataRow === "") {
          this.dataRow = this.tableConfig.tableData[0];
        }
        //
        if (this.tableConfig.isSelect) return this.tabKeyClick(this.dataRow);
        this.handleClickTableRow(this.dataRow, event);
      }
    },
    // 关闭tags
    tagsClose(tag) {
      // 多选没有初始值,或者是选中后的删除
      if (!this.eval || typeof this.tagsData[0] !== "string")
        return this.spliceTagsData(tag);
      // 多选有初始值
      const { tableConfig, selectData } = this;
      const { callBackName } = tableConfig;
      if (selectData.length === 0) {
        const index = this.tagsData.findIndex((item) => item === tag);
        this.tagsData.splice(index, 1);
      } else {
        this.tagsData = selectData.filter((item, index) => {
          if (item[callBackName] === tag) {
            this.$refs.multipleTable.toggleRowSelection(item);
            return false;
          } else {
            return true;
          }
        });
      }
      this.callBackAction({
        type: "checked",
        value: this.tagsData,
      });
    },
    // 多选关闭tags的时候需要删除掉当前tag且取消表格中的当前数据
    spliceTagsData(tag) {
      const { tableConfig, selectData } = this;
      const { callBackName } = tableConfig;
      this.tagsData = this.tagsData.filter((item, index) => {
        if (item[callBackName] === tag[callBackName]) {
          this.$refs.multipleTable.toggleRowSelection(selectData[index]);
          return false;
        } else {
          return true;
        }
      });
      this.callBackAction({
        type: "checked",
        value: this.tagsData,
      });
    },
    // 选中默认数据
    initSelect() {
      this.selectData = [];
      if (!this.eval || typeof this.tagsData[0] !== "string")
        return this.initMultiSelect();
      // 多选有初始值
      const { tableData, callBackName } = this.tableConfig;
      tableData.forEach((item) => {
        if (this.tagsData.includes(item[callBackName])) {
          this.$refs.multipleTable.toggleRowSelection(item);
        }
      });
    },
    // 多选操作了表格后再次默认选中
    initMultiSelect() {
      const { tagsData, tableConfig } = this;
      const { tableData, callBackName } = tableConfig;
      let data = tagsData.map((item) => item[callBackName]);
      tableData.forEach((item) => {
        if (data.includes(item[callBackName])) {
          this.$refs.multipleTable.toggleRowSelection(item);
        }
      });
    },
    bodyCloseTable(e) {
      // if (this.tableConfig.immateShow) return;
      this.popShow = false;
    },
    popvorShow() {
      window.popUp = true;
      const { pageConfig } = this.tableConfig;
      this.copyPageSize = pageConfig.pageSize || this.copyPageSize;
      this.copyCurrentPage = 1;
      // 键盘事件
      this.dataRow = "";
      this.dataIndex = 0;

      // setTimeout(() => {
      document.addEventListener("click", this.bodyCloseTable);
      // }, 500);
    },
    setInputVal(val) {
      this.inputVal = val;
    },
    popvorHide() {
      window.popUp = false;

      this.resInputFlag = false;
      this.evalFlag = false;
      this.enterFlag = false;
      this.myFocus = false;
      this.$refs.inputRef.blur();
      this.$emit("popHide");
      document.removeEventListener("click", this.bodyCloseTable);
      // // 针对键盘事件的回车选中让其主动失焦，能触发自动检索功能
      // this.$refs.inputRef.blur();
    },
    // 多选确定
    submitSelect() {
      if (this.selectData.length !== 0) {
        this.resInputFlag = true;
        this.callBackAction({ type: "checked" });
        this.inputVal = "";
      }
      this.popShow = !this.popShow;
    },
    // 多选事件
    handleSelectionChange(selection) {
      this.selectData = selection;
    },
    // 勾选checkBox
    checkBoxSelect(selection, row) {
      this.tagsData = selection;
    },
    // 全选
    selectAll(selection) {
      this.tagsData = selection;
    },
    // 行选中
    handleClickTableRow(row, event, column) {
      const { isSelect, callBackName } = this.tableConfig;
      if (!isSelect) {
        this.inputVal = row[callBackName];
        this.enterFlag = true;
        this.resInputFlag = true;
        this.selectData = row;
        this.callBackAction({ type: "checked" });
        if (this.popShow) this.$refs.inputRef.blur();
        this.popShow = false;
      } else {
        this.tagsData = this.selectData;
      }
    },
    tabKeyClick(row) {
      const { isSelect, callBackName } = this.tableConfig;
      const index = this.tagsData.findIndex(
        (item) =>
          item === row[callBackName] || item[callBackName] === row[callBackName]
      );
      if (index > -1) {
        // 已存在，取消勾选
        this.tagsData.splice(index, 1);
      } else {
        // 不存在，添加值
        this.selectData.push(row);
        this.tagsData.push(row);
      }
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 分页事件
    paginationChange(val) {
      let paramVal = this.inputVal;
      const { isSelect } = this.tableConfig;
      if (!isSelect) {
        return this.callBackAction({
          value: paramVal,
          currentPage: val.page,
          pageSize: val.limit,
          type: "entry",
        });
      }
      const { tagsData } = this;
      const multiTagsFlag =
        tagsData.length > 0 && typeof tagsData[0] !== "string";
      if (!this.eval || multiTagsFlag) {
        paramVal = this.selectPageMulti();
        return this.callBackAction({
          value: paramVal,
          currentPage: val.page,
          pageSize: val.limit,
          type: "entry",
        });
      }
      paramVal = this.tagsData.toString() + "," + this.inputVal;
      this.callBackAction({
        value: paramVal,
        currentPage: val.page,
        pageSize: val.limit,
        type: "entry",
      });
    },
    // 多选选中值后
    selectPageMulti() {
      const { callBackName } = this.tableConfig;
      let data = this.tagsData.map((item) => item[callBackName]);
      const multiString = data.toString() + "," + this.inputVal;
      return this.inputVal ? multiString : data.toString();
    },
    // input值发生变化就触发
    inputChange(val, event) {
      //在这里做了一个初始化值的判断，只有获取焦点的时候才弹出popover，因为用了v-model以后引起的值回写导致popover超出预期弹出，所以只有在获取焦点的时候才弹出。by Mothpro
      if (this.enterFlag || !this.myFocus) return;
      const { isSelect, callBackName, tableData, pageConfig } =
        this.tableConfig;

      if (isSelect) {
        if (event) event.stopPropagation();
      } else {
        this.popShow = val ? true : false;
      }
      // 切换了页面之后又重新打开了弹窗，页码需要重置
      this.tableConfig.pageConfig.currentPage = 1;
      this.tableConfig.pageConfig.pageSize = this.copyPageSize;
      let paramVal = val;

      // 单选 or 多选但没有勾选表格中的数据
      if (!isSelect) {
        return this.callBackAction({ value: paramVal, type: "entry" });
      }

      // 多选
      if (typeof this.tagsData[0] === "string") {
        if (this.eval) {
          // 有初始值的输入
          paramVal = this.tagsData.toString() + "," + val;
        }
      } else {
        let data = this.tagsData.map((item) => item[callBackName]);
        let initData = [];
        tableData.forEach((item) => {
          if (data.includes(item[callBackName])) {
            initData.push(item[callBackName]);
          }
        });
        paramVal = initData.toString() + "," + val;
      }
      if (!isSelect) {
        this.callBackAction({
          value: paramVal,
          type: "entry",
        });
      }
    },
    // 聚焦触发
    inputFocus(val) {
      this.$nextTick(() => {
        this.myFocus = true; //这里加了一个开关锁，只有当开关是打开状态，才会弹出popover

        if (this.minSearchLen > 0 && this.inputVal.length < this.minSearchLen) {
          this.$message.warning("检索长度需超过" + this.minSearchLen + "！");
          return;
        }
        const { immateShow, callBackName, pageConfig, isSelect } =
          this.tableConfig;
        if (!immateShow && !this.inputVal) return;
        this.popShow = true;
        // 值是否回填
        if (this.noCallBack) {
          this.inputVal = "";
          // this.$emit("input", this.inputVal);
        }
        // 点击空白处关闭后，鼠标指定检索框，自动检索；通过inputVal是否有值来判断
        if (!immateShow && this.inputVal.length > this.minSearchLen) {
          this.popShow = true;
        }
        this.tableConfig.pageConfig.currentPage = 1;
        this.tableConfig.pageConfig.pageSize = this.copyPageSize;
        let paramVal = "";

        if (isSelect) {
          // 多选
          if (typeof this.tagsData[0] !== "string") {
            // 选中的数据
            let data = this.tagsData.map((item) => item[callBackName]);
            paramVal = data.toString();
          } else {
            // 初始状态没有切换选中
            paramVal = this.tagsData.toString();
          }
          if (this.inputVal) {
            // 有输入的值
            paramVal = paramVal + "," + this.inputVal;
          }
        } else {
          // 单选
          paramVal = this.inputVal;
        }
        this.callBackAction({
          value: paramVal,
          type: "entry",
        });
      });
    },
    inputBlurFoucus(val) {
      this.myFocus = false;
    },
    clear() {
      this.popShow = false;
      let paramVal = "";
      if (this.tableConfig.isSelect) {
        // 判断是不是有初始值
        const typeofFlag = typeof this.tagsData[0] === "string";
        paramVal = typeofFlag ? this.eval : this.tagsData;
      } else {
        this.tagsData = [];
        this.selectData = [];
        // this.eval = '';
        this.inputVal = "";
        // 键盘事件
        this.dataRow = "";
        this.dataIndex = 0;
        this.enterFlag = false;
        this.resInputFlag = false;
      }
      this.callBackAction({
        value: paramVal,
        type: "clear",
      });
      // 重置完之后光标聚焦
      this.tagsInputDivClick();
    },
    // 将对应的操作数据抛出去
    callBackAction({
      value: value = this.selectData,
      currentPage: currentPage = this.tableConfig.pageConfig.currentPage,
      pageSize: pageSize = this.tableConfig.pageConfig.pageSize,
      type: type,
    }) {
      let callData = {
        value: value,
        currentPage: currentPage,
        pageSize: pageSize,
        type: type,
      };
      this.$emit("inputSearch", callData);

      if (this.noCallBack) {
        this.inputVal = "";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.maxWidth {
  max-width: 800px;
}
.maxWidth600 {
  max-width: 600px;
}
.margin {
  padding-top: 12px;
}
.btnDiv {
  .margin();
  display: flex;
  justify-content: end;
  border-top: 1px solid #e7ebf1;
}
.pagination {
  .margin();
  margin-bottom: 12px;
  display: flex;
  justify-content: end;
}
.wgInputTable {
  display: inline-block;
  width: 100%;
}
.tags_input_div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #bfc3c5;
  width: 100%;
  border-radius: 2px;
  .tagsDiv {
    line-height: 23px;
    display: contents;
    .el-tag {
      box-sizing: border-box;
      border-color: transparent;
      margin: 2px 0 2px 6px;
      background-color: #f0f2f5;
      display: flex;
      max-width: 100%;
      align-items: center;
      border-radius: 2px;
      /deep/ .el-icon-close {
        transform: scale(0.8);
        top: 1px;
      }
    }
    .tagsCount {
      display: flex;
      height: 20px;
      padding: 0 5px;
      line-height: 19px;
      margin: 2px 0 2px 6px;
      background-color: #f0f2f5;
      box-sizing: border-box;
      border-color: transparent;
      max-width: 100%;
      align-items: center;
      color: #909399;
      border-radius: 2px;
    }
  }
  .tags_input {
    flex-grow: 1;
    width: 1%;
    /deep/ .el-input__inner {
      padding-right: 25px !important;
      border: none;
      outline: none;
    }
  }
  .paddLR5 {
    padding-left: 5px;
    padding-right: 5px;
  }
}
.isFixHeight {
  height: 28px;
  overflow: auto;
}
.selectIcon {
  width: 11px;
  margin-right: 6px;
}
</style>
