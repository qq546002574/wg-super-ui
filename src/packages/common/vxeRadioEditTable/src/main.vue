<template>
  <div class="tableHeightAuto" :style="{ width: tableWidth, height: tableHeight }">
    <vxe-table
      ref="xTable"
      border
      row-key
      column-key
      show-header-overflow
      show-overflow
      auto-resize
      keep-source
      height="auto"
      v-bind="$attrs"
      v-on="$listeners"
      :radio-config="radioConfig"
      :row-config="rowConfig"
      :column-config="columnConfig"
      :keyboard-config="keyboardConfig"
      :mouse-config="mouseConfig"
      :edit-config="editConfig"
      :sort-config="sortConfig"
      :data="data"
      @radio-change="selectChangeEvent"
    >
      <vxe-column width="60" v-if="showRowSort">
        <template #default>
          <span class="drag-btn">
            <i class="vxe-icon--menu"></i>
          </span>
        </template>
        <template #header>
          <vxe-tooltip v-model="showHelpTip" content="按住后可以上下拖动排序！" enterable>
            <i class="vxe-icon--question" @click="showHelpTip = !showHelpTip"></i>
          </vxe-tooltip>
        </template>
      </vxe-column>
      <vxe-column type="radio" width="60" v-if="showRadio"></vxe-column>
      <vxe-column type="seq" title="序号" width="60" v-if="showIndex"></vxe-column>
      <template v-for="(item, index) in thData">
        <vxe-column v-if="item.type === 'slot'" :key="index" v-bind="item" :edit-render="{ autofocus: '.myinput' }">
          <template v-if="item.slots.default !== undefined" #default="scope">
            <slot :name="item.slots.default" :data="scope.row">
              <!--select回填-->
              <span v-if="item.concrete === 'select'">{{ formatSelect(scope.row[item.field], item.options) }}</span>
            </slot>
          </template>
          <template v-if="item.slots.edit !== undefined" #edit="scope">
            <slot :name="item.slots.edit" :data="scope.row">
              <!--input插槽-->
              <wg-el-input v-if="item.concrete === 'input'" v-model="scope.row[item.field]"></wg-el-input>
              <!--select插槽-->
              <wg-el-select v-else-if="item.concrete === 'select'" v-model="scope.row[item.field]">
                <wg-el-option
                  v-for="item in item.options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></wg-el-option>
              </wg-el-select>
            </slot>
          </template>
        </vxe-column>
        <vxe-column v-else-if="item.type === 'opt'" :key="index" v-bind="item" :edit-render="{ autofocus: '.myinput' }">
          <template v-if="item.slots.default !== undefined" #default="scope">
            <slot :name="item.slots.default" :data="scope.row">
              <template v-if="$refs.xTable.isUpdateByRow(scope.row) && item.btnGroup.isDepatSave">
                <wg-button type="text">局部保存</wg-button>
              </template>
              <wg-button v-if="item.btnGroup.isCheck" type="text" icon="icon-chakan"></wg-button>
              <wg-button v-if="item.btnGroup.isEdit" type="text" icon="icon-bianji1" @click.stop="editRowEvent(scope.row)"></wg-button>
              <wg-button v-if="item.btnGroup.isDelete"  type="text" icon="icon-shanchu" @click.stop="removeRowEvent(scope.row)"
                ></wg-button
              >
              <wg-button v-if="item.btnGroup.isReset" type="text" icon="icon-chexiao"></wg-button>
            </slot>
          </template>
        </vxe-column>
        <vxe-column v-else :key="index" v-bind="item"></vxe-column>
      </template>
      <template #empty v-if="!emptyText">
        <slot name="empty">
          <wg-empty />
        </slot>
      </template>
    </vxe-table>
  </div>
</template>

<script>
import { VXETable } from 'vxe-table';
import Sortable from 'sortablejs';
export default {
  name: 'wgRadioEditTable',
  props: {
    editConfig: {
      type: Object,
      default() {
        return {
          mode: 'row',
          trigger: 'dblclick',
          showStatus: true,
          // icon: 'fa fa-file-text-o',
          autoClear: false,
        };
      },
    },
    sortConfig: {
      // 排序配置
      type: Object,
      default() {
        return {
          orders: ['desc', 'asc', null],
        };
      },
    },
    columnConfig: {
      // 列配置
      type: Object,
      default() {
        return {
          resizable: true,
        };
      },
    },
    rowConfig: {
      // 行配置
      type: Object,
      default() {
        return {
          isCurrent: true,
          isHover: true,
          // height: 36,
        };
      },
    },
    radioConfig: {
      // 单选框配置
      type: Object,
      default() {
        return {
          trigger: 'row',
          highlight: true,
        };
      },
    },
    emptyText: {
      // 空文本配置
      type: String,
      default: '',
    },
    // 按键配置项
    keyboardConfig: Object,
    // 鼠标配置项
    mouseConfig: Object,
    tableWidth: {
      type: String,
      default: '',
    },
    tableHeight: {
      type: String,
      default: '',
    },
    theadData: {
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    showIndex: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showRadio: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showRowSort: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    columnConfig(val) {
      this.columnConfig = Object.assign(this.columnConfig, val);
    },
    rowConfig(val) {
      this.rowConfig = Object.assign(this.rowConfig, val);
    },
    radioConfig(val) {
      this.radioConfig = Object.assign(this.radioConfig, val);
    },
    theadData: {
      handler(val, oldVal) {
        this.thData = val;
      },
      immediate: true,
      deep: true,
    },
    tableData: {
      handler(val, oldVal) {
        this.data = val;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      sortable: null,
      initTime: null,
      showHelpTip: false,
      thData: [],
      data: [],
    };
  },
  created() {
    this.$nextTick(() => {
      // 加载完成之后在绑定拖动事件
      this.initTime = setTimeout(() => {
        this.rowDrop();
        this.columnDrop();
      }, 500);
    });
  },
  methods: {
    // 删除
    removeRowEvent(row) {
      const that = this;
      that
        .$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          that.$listeners.removeRowEvent(row);
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 编辑
    editRowEvent(row) {
      // const $grid = this.$refs.xTable;
      // $grid.setActiveRow(row);
      this.$listeners.editRowEvent(row);
    },
    // 格式化下拉框
    formatSelect(val, opt) {
      for (const item of Object.values(opt)) {
        if (item.value === val) {
          return item.label;
        }
      }
    },
    // 列拖拽
    columnDrop() {
      const $grid = this.$refs.xTable;
      this.sortable = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
        handle: '.vxe-header--column:not(.col--fixed)',
        onEnd: (sortableEvent) => {
          const targetThElem = sortableEvent.item;
          const newIndex = sortableEvent.newIndex;
          const oldIndex = sortableEvent.oldIndex;
          const { fullColumn, tableColumn } = $grid.getTableColumn();
          const wrapperElem = targetThElem.parentNode;
          const newColumn = fullColumn[newIndex];
          if (newColumn.fixed) {
            // 错误的移动
            const oldTrElement = wrapperElem.children[oldIndex];
            if (newIndex > oldIndex) {
              wrapperElem.insertBefore(targetThElem, oldTrElement);
            } else {
              wrapperElem.insertBefore(oldTrElement, targetThElem);
            }
            return VXETable.modal.message({
              content: '固定列不允许拖动！',
              status: 'error',
            });
          }
          // 转换真实索引
          const oldColumnIndex = $grid.getColumnIndex(tableColumn[oldIndex]);
          const newColumnIndex = $grid.getColumnIndex(tableColumn[newIndex]);
          // 移动到目标列
          const currRow = fullColumn.splice(oldColumnIndex, 1)[0];
          fullColumn.splice(newColumnIndex, 0, currRow);
          $grid.loadColumn(fullColumn);
        },
      });
    },
    // 行拖拽
    rowDrop() {
      this.sortable = Sortable.create(this.$refs.xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
        handle: '.drag-btn',
        onEnd: (sortableEvent) => {
          const newIndex = sortableEvent.newIndex;
          const oldIndex = sortableEvent.oldIndex;
          const currRow = this.data.splice(oldIndex, 1)[0];
          this.data.splice(newIndex, 0, currRow);
          this.$emit('getRowSortTable', this.data);
        },
      });
    },
    selectChangeEvent({ row }) {
      this.selectRow = row;
      this.$emit('selectChangeEvent', { row });
    },
  },
  destroyed() {
    clearTimeout(this.initTime);
    if (this.sortable) {
      this.sortable.destroy();
    }
  },
};
</script>

<style lang="less">
.tableHeightAuto {
  overflow: hidden;
}
.drag-btn {
  cursor: move;
  font-size: 12px;
}
.vxe-body--row.sortable-ghost,
.vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
</style>
