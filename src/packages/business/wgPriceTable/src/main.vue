<template>
  <el-popover
    v-model="popShow"
    :disabled="disabled"
    @show="popvorShow"
    placement="bottom" 
    trigger="focus" 
    width="600">
    <wg-el-input
      slot="reference" 
      ref="inputRef"
      v-model="inputVal"
      v-on="$listeners"
      v-bind="$attrs"
      :disabled="disabled"
      clearable
      @keyup.native="tabKey"
      @focus="inputFocus"
      @clear="clear"
      >
      <wg-icon :name="iconName" slot="suffix" class="selectIcon"></wg-icon>
    </wg-el-input>
    <wg-table
      border
      ref="multipleTable"
      highlight-current-row
      max-height="289"
      :row-style="rowStyle"
      @row-click="handleClickTableRow"
      :data="tableData"
    >
      <wg-table-column label="价表编码" prop="itemCode"> </wg-table-column>
      <wg-table-column label="价表名称" prop="itemName"> </wg-table-column>

      <wg-table-column align="right" label="价格" prop="itemName">
        <template slot-scope="scope"> {{ scope.row.priceMoney }}元 </template>
      </wg-table-column>
    </wg-table>
  </el-popover>
</template>
<script>
import { getpriceList } from '@/utils';

export default {
  name: 'wgPriceTable',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    defaultModel: {
      type:[String,Number,Array],
    },
    openKeyboard: {
      type: Boolean,
      default: true,
    },
  },
  model: {
    prop: 'defaultModel',
    event: 'tagInput',
  },
  computed: {
    iconName() {
      return this.popShow ? 'icon-zuojiantou-1' : 'icon-zuojiantou1';
    },
  },
  watch: {
    defaultModel: {
      handler(val) {
        this.inputVal = val[0].label;
      },
      immediate: true,
    }
  },
  data() {
    return {
      popShow: false,
      tableData: [],
      inputVal: '',
      // 键盘事件
      dataRow: '', // 当前已选择行
      dataIndex: 0, // 当前选择行的index
    }
  },
  methods: {
    focus() {
      this.$refs.inputRef.focus();
    },
    popvorShow() {
      this.resetKeyBoard();
    },
    resetKeyBoard() {
      this.dataIndex = 0;
      this.dataRow = '';
    },
    // 上键
    keyUp(tableData) {
      if (this.dataIndex == 0) {
        //当选中的index等于0时，说明到顶了，再按上键就要返回到表格的底部，并计算距离表格顶部的距离
        this.dataIndex = tableData.length - 1;
        this.dataRow = tableData[this.dataIndex]; // 当前已选择行
        let height = 39;
        this.$refs.multipleTable.bodyWrapper.scrollTop = height * (tableData.length - 4);
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
        this.$refs.multipleTable.bodyWrapper.scrollTop = -(height * (tableData.length - 6));
      } else {
        if (this.dataIndex > 3 && this.dataIndex < 12) {
          let height = 39; //计算选中行离表格顶部的距离
          this.$refs.multipleTable.bodyWrapper.scrollTop = height * this.dataIndex;
        }
        this.dataRow = tableData[this.dataIndex + 1]; // 当前已选择行
        this.dataIndex = this.dataIndex + 1;
      }
    },
    // 上下移动的时候改变颜色
    rowStyle(row) {
      if (!this.openKeyboard) return ;
      if (row.rowIndex === this.dataIndex) {
        return {
          'background-color': '#edf5fa',
        };
      }
    },
    // 键盘操作
    tabKey(event) {
      if (!this.openKeyboard) return ;
      const tableData = this.tableData;
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
        if (this.dataRow === '') {
          this.dataRow = this.tableData[0];
        }
        this.handleClickTableRow(this.dataRow);
      }
    },
    clear() {
      this.$emit('tagInput', [{label: '', value: ''}]);
    },
    // 获取表格数据
    async initTable() {
      const { data } = await getpriceList(this.queryParams);
      this.tableData = data || [];
    },
    // 输入框聚焦事件
    async inputFocus(e) {
      await this.initTable();
    },
    // 行选中
    handleClickTableRow(row, event, column) {
      this.inputVal = `${row.itemName}(${row.priceMoney}元)`;
      this.$emit('tagInput', [{label: this.inputVal, value: row.itemCode}]);
      this.popShow = false;
      this.$refs.inputRef.blur();
      this.$emit('selectItem', row);
    },

  }
}
</script>
<style lang="less" scoped>
.selectIcon {
  width: 11px;
  margin-right: 6px;
}
</style>