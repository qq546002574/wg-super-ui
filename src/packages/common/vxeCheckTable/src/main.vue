<template>
  <!-- <div id="wgCheckTable"> -->
  <div class="tableHeightAuto" :style="{ width: tableWidth, height: tableHeight }">
    <vxe-table
      ref="xTable"
      :border="border"
      row-key
      column-key
      show-header-overflow
      show-overflow
      auto-resize
      height="auto"
      v-bind="$attrs"
      v-on="$listeners"
      :checkbox-config="checkboxConfig"
      :row-config="rowConfig"
      :column-config="columnConfig"
      :keyboard-config="keyboardConfig"
      :mouse-config="mouseConfig"
      :sort-config="sortConfig"
      :data="data"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
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
      <vxe-column type="checkbox" :width="border?48:28" v-if="showCheckBox" style="padding: 0 10px;"></vxe-column>
      <vxe-column type="seq" title="序号" width="60" v-if="showIndex"></vxe-column>
      <template v-for="(item, index) in thData">
        <vxe-column v-if="item.type === 'slot'" :key="index" v-bind="item">
          <template v-if="item.slots.default !== undefined" #default="scope">
            <slot :name="item.slots.default" :data="scope.row">
              {{ scope.row[item.field] }}
            </slot>
          </template>
          <template v-if="item.slots.filter!==undefined" #filter="{ $panel, column }">
              <slot  :name="item.slots.filter" :data="{$panel,column}"  >
              </slot>
          </template>
        </vxe-column>
        <vxe-column v-else-if="item.type === 'opt'" :key="index" v-bind="item">
          <template v-if="item.slots.default !== undefined" #default="scope">
            <slot :name="item.slots.default" :data="scope.row">
              <el-button v-if="item.btnGroup.isCheck" type="text">查看</el-button>
              <el-button v-if="item.btnGroup.isEdit" type="text" @click.stop="editRowEvent(scope.row)">编辑</el-button>
              <el-button v-if="item.btnGroup.isDelete" type="text" @click.stop="removeRowEvent(scope.row)"
                >删除</el-button
              >
              <el-button v-if="item.btnGroup.isReset" type="text">重置</el-button>
            </slot>
          </template>
        </vxe-column>
        <!-- 床号特定模式 -->
        <vxe-column v-else-if="item.type === 'bedName'" :key="index" v-bind="item">
         <template v-if="item.slots.default !== undefined" #default="scope">
           <slot :name="item.slots.default" :data="scope.row">
             <wg-icon class="icons2"
               :name="scope.row.patientSexStr === '男' ? 'icon-touxiangnan-touming' : 'icon-touxiangnv-touming'" />
              <span>{{ scope.row[item.field] }}<span v-if="item.field=== 'bedName'&&scope.row[item.field].indexOf('床') === -1">床</span></span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ scope.row.patientName }}</span>
              <span>{{ '(' + scope.row.patientAgeStr + ')' }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ scope.row.patientId }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ scope.row.visitId }}</span>
           </slot>
         </template>
        </vxe-column>
        <!-- 加下划线 -->
        <!-- <vxe-column v-else-if="item.type === 'divider'" :key="index" v-bind="item">
         <template v-if="item.slots.default !== undefined" #default="scope">
           <slot :name="item.slots.default" :data="scope.row">
            <div class="pol">
             <el-divider direction="vertical"></el-divider>
            </div>
              <div style="text-align: center;">{{ scope.row[item.field] }}<span v-if="item.field === 'patientName'">{{ '(' +  scope.row.patientAgeStr + ')' }}</span></div>
           </slot>
         </template>
        </vxe-column> -->
        <vxe-column v-else :key="index" v-bind="item"></vxe-column>
      </template>
      <template #empty v-if="!emptyText">
        <slot name="empty">
          <wg-empty />
        </slot>
      </template>
    </vxe-table>
  </div>
  <!-- </div> -->
</template>

<script>
import Vue from 'vue';
import Sortable from 'sortablejs';
import 'xe-utils';
import VXETable from 'vxe-table';
// import type from '../../../../../pages/doctorAdviceMng/components/orderCheck/components/pullDown/type';
// import VXETablePluginElement from 'vxe-table-plugin-element';
// import 'vxe-table/lib/style.css';
// VXETable.use(VXETablePluginElement);

// Vue.use(VXETable);
// console.log(11);
export default {
  name: 'wgCheckTable',
  props: {
    border:{
      type: Boolean,
      default: true,
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
    checkboxConfig: {
      // 复选框配置
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
    showCheckBox: {
      type: Boolean,
      default() {
        return true;
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
    checkboxConfig(val) {
      this.checkboxConfig = Object.assign(this.checkboxConfig, val);
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
    selectAllEvent({ checked, records }) {
      this.$emit('selectAllEvent', { checked, records });
    },
    selectChangeEvent({ checked, records }) {
      this.$emit('selectChangeEvent', { checked, records });
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
<style lang="less" scoped>
.pol {
  position: absolute;
  left: 0;
  z-index: 88;
}
.el-divider--vertical {
  margin: 0 8px;
}
.icons2 {
  min-width: 16px;
  margin-right: 2px;
  font-size: 20px;
}
</style>
