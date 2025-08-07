<script>
import Sortable from 'sortablejs';
import contextMenu from './contextMenu.vue';
import { getUrlkey } from '@/utils/index.js';
// import server from '@/api/http';
import { getDrugCheckTableConfig, saveDrugCheckTableData } from '@/utils';

export default {
  name: 'wgDragTableCheck',
  components: {contextMenu},
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    // 表格配置项
    gridOptions: {
      type: Object,
      default: () => {},
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // 行拖拽排序
    rowSort: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 列拖拽排序
    colSort: {
      type: Boolean,
      default: () => false,
    },
    tableId: {
      type: String,
      default: '1',
    },
  },
  watch: {
    columns: {
      handler(val, oldVal) {
        this.$nextTick(()=> {
          this.getCustomColumns(val);
        })
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    initGirdOptions() {
      return {
        ...this.gridOptions,
        columnKey: this.colSort, // 列拖拽的时候必须为true
        rowKey: this.rowSort, // 行拖拽的时候必须为true
      }
    },
  },
  data() {
    return {
      initColumns: [],
      sortable: null,
      initTime: null,
      showContextMenu: false,
      mouseTop: '',
      mouseLeft: '',
      needLeft: false,
      allColumns: [],
    }
  },
  created() {
    this.$nextTick(() => {
      // 加载完成之后在绑定拖动事件
      this.initTime = setTimeout(() => {
        // 行拖拽
        this.rowDrop();
        // 列拖拽
        this.columnDrop();
      }, 500);
    });
  },
  mounted() {
    this.$nextTick(()=> {
      if(this.colSort) {
        document.addEventListener('click', e => {
          const {path} = e;
          const isContextMenu = path.find(item => item && item.getAttribute && item.getAttribute('class') === 'context-menu contextmenu');
          if (this.showContextMenu) {
            this.showContextMenu = isContextMenu;
          }
        },false);

        document.addEventListener('contextmenu', e => {
          e.preventDefault();//阻止默认事件
          const {path, clientX, clientY} = e;
          const isHeader = path.find(item => item && item.getAttribute && item.getAttribute('class') === 'vxe-header--row');
          if (isHeader) {
            this.showContextMenu = true;
            this.needLeft = window.innerWidth - clientX < 384;
            const changeLeft = this.needLeft ? 166 : 0;
            this.mouseTop = `${clientY}px`;
            this.mouseLeft = `${clientX - changeLeft}px`;
            const $grid = this.$refs.xEditGrid;
            this.allColumns = $grid.getTableColumn();
          }
        },false);
      }
    })
  },
  methods: {
    resizableChange(event) {
      this.$nextTick(()=> {
        this.saveColumn();
      })
      this.$emit('resizable-change', event);
    },
    async sortTableColumns(col) {
      const $grid = this.$refs.xEditGrid;
      await $grid.loadColumn(col);
    },
    // 重置列的展示隐藏
    async resetColumn() {
      const $grid = this.$refs.xEditGrid;
      await $grid.resetColumn();
      this.saveColumn();
    },
    // 列拖拽保存
    async saveColumn() {
      const $grid = this.$refs.xEditGrid;
      const { fullColumn } = $grid.getTableColumn();
      const {funCode, pageUrlParams} = this.hasMuneContanier();
      const { _sys, _userId} = pageUrlParams;
      const tableCode = `${_sys}-${funCode}-${_userId}-${this.tableId}`;
      const columns = fullColumn.map((item, index) => {
        const {align, visible, width, title, field, minWidth, showOverflow, resizeWidth} = item;
        return {align, visible: visible === true ? '1' : '0', width: resizeWidth ? String(resizeWidth) : width, title, field, minWidth, showOverflow: showOverflow === true ? '1': '0'}
      }).filter(item => item.title);
      columns.forEach((column, index) => column.sort = index + 1);
      const params = {
        pathCode: funCode,
        tableCode,
        columns,
        customType: 1,
        customCode: window.top.userName,
      }
      // 触发保存
      // const saveApi = '/bcs/customTable/save';
      // const res = await server.post(saveApi, params);
      const { data } = await saveDrugCheckTableData(params);
    },
    // 列的展示与隐藏
    columnVisbleChange(column) {
      // 查找到当前表格中的列，根据情况进行隐藏展示操作
      const $grid = this.$refs.xEditGrid;
      $grid.refreshColumn();
      this.saveColumn();
    },
    // 列拖拽
    columnDrop() {
      if(!this.colSort) return;
      const $grid = this.$refs.xEditGrid;
      this.sortable = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
        handle: '.vxe-header--column:not(.col--fixed)',
        chosenClass: 'col-choice',
        dragClass: 'col-drag',
        ghostClass: 'col-ghost',
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
          this.saveColumn();
        },
      });
    },
    // 行拖拽
    rowDrop() {
      if (!this.rowSort) return;
      const $grid = this.$refs.xEditGrid;
      this.sortable = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
        handle: '.drag-btn',
        onEnd: (sortableEvent) => {
          const newIndex = sortableEvent.newIndex;
          const oldIndex = sortableEvent.oldIndex;
          const currRow = this.tableData.splice(oldIndex, 1)[0];
          this.tableData.splice(newIndex, 0, currRow);
          this.$emit('getRowSortTable', this.tableData);
        },
      });
    },
    hasMuneContanier() {
      const isMenuContainer = this.$wgFramework.getIsMenuContainer();
      let funCode = '';
      let pageUrlParams = {};
      if (isMenuContainer) {
        const url = window.top.window.location.href;
        const topUrl = url.split('?')[0];
        pageUrlParams = getUrlkey(url);
        const topUrlArr = topUrl.split('/');
        funCode = topUrlArr[topUrlArr.length-1];
      } else {
        const url = window.location.href;
        pageUrlParams = getUrlkey(url);
        const {_funCode} = pageUrlParams;
        funCode = _funCode;
      }
      return {
        funCode,
        pageUrlParams,
      }
    },
    // 根据tableId获取当前表格的配置调整列的顺序
    async getCustomColumns(val) {
      const {funCode, pageUrlParams} = this.hasMuneContanier();
      // const customConfigUrl = '/bcs/customTable/getConfig';
      const { _sys, _userId} = pageUrlParams;
      const tableCode = `${_sys}-${funCode}-${_userId}-${this.tableId}`;
      const params = {
        pathCode: funCode,
        tableCode
      }
      // const {code, data} = await server.get(customConfigUrl, params);

      // if (code === '0' && data) {
        // 在这里处理初始化数据
        const data = await getDrugCheckTableConfig(params)
        const {columns} = data;
        const hasMoreItem = []
        const defaultTheadData = val.map(item => {
          const field = item.field || null;
          const newItem = {
            ...item,
            field,
          }
          const diffItem = columns.find(d => d.title === newItem.title && d.field === newItem.field);
          if (!diffItem) {
            hasMoreItem.push(item);
          }
          return newItem
        })
        const newArr = columns.map(item => {
          const defaultItem = defaultTheadData.find(t => t.title === item.title && t.field === item.field);
          item.visible = item.visible === '1';
          item.showOverflow = item.showOverflow === '1';
          return {...defaultItem, ...item};
        })
        if(hasMoreItem && hasMoreItem.length) {
          hasMoreItem.forEach(item => {
            defaultTheadData.forEach((t, i) => {
              if (t.type === 'rowSort' && !newArr.includes(t)) {
                newArr.unshift(t);
              } else if (t.type === 'checkbox' && !newArr.includes(t)) {
                if (this.rowSort) {
                  newArr.splice(1, 0, t);
                } else {
                  newArr.unshift(t);
                }
              } else if (t.title === item.title && t.field === item.field)
                newArr.splice(i, 0, t);
              }
            );
          })
        }
        this.initColumns = newArr;
        setTimeout(()=> {
          this.saveColumn();
        }, 0)
        return;
      // }
      this.initColumns = val;
    },
  },
  destroyed() {
    clearTimeout(this.initTime);
    if (this.sortable) {
      this.sortable.destroy();
    }
  },
  render() {
    // 表格属性
    const { tableData, initColumns, initGirdOptions, loading, showContextMenu, needLeft, allColumns, mouseTop, mouseLeft} = this;
    // 方法
    const {columnVisbleChange, resetColumn, sortTableColumns, resizableChange} = this;
    const on = {
      ...this.$listeners,
    };
    return (
      <div class="flex fcol height-100">
        <div class="flex-1 overflow-hidden">
          <vxe-grid
            ref="xEditGrid"
            loading={loading}
            props={initGirdOptions}
            height="100%"
            columns={initColumns}
            empty-render={{name: 'empty'}}
            data={tableData}
            {...{ on }}
            onresizable-change={resizableChange}
            >
          </vxe-grid>
          {
            showContextMenu ? (
              <contextMenu
                class="contextmenu"
                isLeft={needLeft}
                allColumns={allColumns}
                style={{ top: mouseTop, left: mouseLeft }}
                onVisibleChange={columnVisbleChange}
                onResetColumn={resetColumn}
                onSortTableColumns={sortTableColumns}
              >
              </contextMenu>
            ) : ''
          }
        </div>
      </div>
    )
  },
}
</script>
<style lang="less" scoped>
.tableHeightAuto {
  overflow: hidden;
}
.drag-btn {
  cursor: move;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .drag-icon {
    font-size: 16px;
  }
}
.vxe-body--row.sortable-ghost,
.vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
.contextmenu {
  position:fixed;
}
::v-deep {
  td.col--checkbox .vxe-cell--checkbox {
    display: inline-block;
  }
  .vxe-table--fixed-left-wrapper {
    box-shadow: 4px 0 4px -2px #d4d4d4;
  }

  .vxe-table--fixed-right-wrapper {
    box-shadow: -4px 0 4px -2px #d4d4d4;
  }
}
</style>
<style>
.col-choice {
  background: #EEF2F6;
}
.col-drag {
  background: #EEF2F6;
  border: 1px solid rgba(255,255,255,1);
}
.col-ghost {
  background: #E8F8FF;
  box-sizing: border-box;
  border: 1px dashed rgba(34,172,227,1) !important;
}
</style>