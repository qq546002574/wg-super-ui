<template>
  <div class="context-menu">
    <div class="edit-table"  @click="showTableRow">
        <span class="title" :class="{'is-active':showContent}">编辑表格</span>
    </div>
    <div class="menu-content" :class="{'is-left':isLeft}" v-if="showContent">
        <div class="default" @click="resetColumn">恢复默认展示</div>
        <div class="col-container">
            <template v-for="(item, index) in allColumns.fullColumn">
                <div :key="`${index}-${item.id}`" v-if="item.title" class="col-item" :id="item.id">
                    <el-checkbox v-model="item.visible" @change="visibleChange(item)">{{item.title}}</el-checkbox>
                    <wg-icon name="icon-paixu"></wg-icon>
                </div>
            </template>
        </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';

export default {
  name: 'contextMenu',
  props: {
    isLeft: {
        default: false,
        type: Boolean,
    },
    allColumns: {
        default: () => {},
        type: Object,
    }
  },
  watch: {
  },
  data() {
    return {
        showContent: false,
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    showTableRow() {
        this.showContent = !this.showContent;
        if (this.showContent) {
            this.$nextTick( () => {
                this.columnDrag();
            })
        }

    },
    // 重置全部列
    resetColumn() {
        this.$emit('resetColumn');
    },
    visibleChange(col) {
        this.$emit('visibleChange', col);
    },
    columnDrag() {
        const colContainerEl = document.querySelector('.col-container');
        const sortable = Sortable.create(colContainerEl, {
            handle: '.col-item',
            dragClass: 'item-drag',
            ghostClass: 'item-ghost',
            onEnd: (sortableEvent) => {
                const { fullColumn } = this.allColumns;
                const colItem = colContainerEl.getElementsByClassName('col-item');
                const colKeyList = Array.from(colItem).map(col => col.getAttribute('id'));
                const keyColumns = [];
                colKeyList.forEach(key => {
                    const oldCol = fullColumn.find((col) => col.id === key);
                    if (oldCol) {
                        keyColumns.push(oldCol);
                    }
                })
                fullColumn.forEach((item, index) => {
                    if(!colKeyList.includes(item.id)) {
                        keyColumns.splice(index, 0, item);
                    }
                })
                this.$emit('sortTableColumns', keyColumns);
            },
        });
    }
  },
};
</script>

<style lang="less" scoped>
.context-menu {
    z-index: 999;
    pointer-events: none;
    .edit-table {
        background: #FFFFFF;
        width: 166px;
        height: 44px;
        box-shadow: 0px 8px 16px -5px rgba(0,0,0,0.08);
        border-radius: 2px;
        padding: 6px 8px;
        pointer-events: auto;
        .title {
            display: block;
            width: 100%;
            height: 100%;
            font-size: 14px;
            color: #505356;
            line-height: 22px;
            font-weight: 400;
            display: flex;
            align-items: center;
            padding: 8px;
            &:hover {
                cursor: pointer;
                background: #dff2fc;
                border-radius: 2px;
            }
        }
    }
    .is-active {
        background: #CDE7F6;
    }
    .menu-content {
        min-width: 220px;
        min-height: 100px;
        position: relative;
        top: -44px;
        left: 166px;
        background: rgb(255, 255, 255);
        box-shadow: 0px 8px 16px -5px rgba(0,0,0,0.08);
        padding: 0 0 12px 0;
        pointer-events: auto;
        .default {
            cursor: pointer;
            font-size: 14px;
            color: #22ACE3;
            text-align: left;
            line-height: 22px;
            font-weight: 400;
            padding: 11px 0 5px 16px;
        }
        .col-container {
            width: 100%;
            max-height: 400px;
            overflow: auto;
            background: #fff;
            .col-item {
                background: #fff;
                border: 1px solid #fff;
                border-radius: 2px;
                padding: 6px 8px;
                display: flex;
                justify-content:space-between;
                align-items:center;
            }
        }
    }
    .is-left {
        top: -44px;
        left: -221px;
    }
}
</style>
<style>
.item-ghost {
  background: #E8F8FF !important;
  box-sizing: border-box;
  border: 1px dashed rgba(34,172,227,1) !important;
}
</style>
