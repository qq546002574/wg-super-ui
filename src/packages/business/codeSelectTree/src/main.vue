<template>
  <el-popover
    class="wg-tree-option"
    transition="el-zoom-in-top"
    placement="bottom"
    width="350"
    :trigger="immateShow ? 'click' : 'manual'"
    v-model="popVisible"
    :disabled="disabled"
  >
    <div class="wg-tree-container">
      <wg-tree
        :showSearch="showSearch"
        :propFilter="inputData"
        :type="treeType"
        :data="treeData"
        :styleObject="styleObject"
        @nodeClick="nodeClick"
        v-bind="treeConfig.attrs || {}"
        v-on="treeConfig.on || {}"
      >
      </wg-tree>
    </div>
    <wg-el-input
      @input="(val) => (inputData = val)"
      slot="reference"
      v-bind="$attrs"
      v-on="$listeners"
      :disabled="disabled"
      @focus="inputFocus"
      clearable
    >
      <wg-icon :name="iconName" slot="suffix" class="selectIcon"></wg-icon>
    </wg-el-input>
  </el-popover>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";

export default {
  name: "wgCodeSelectTree",
  data() {
    return {
      popVisible: false,
      immateShow: true,
      styleObject: {
        height: "310px",
        overflow: "auto",
      },
      myTreeData: [],
      inputData: "",
    };
  },
  directives: { Clickoutside },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    // 允许选择根节点
    canRootNode: {
      type: Boolean,
      default: true,
    },
    // tree 类型
    treeType: {
      type: String,
      default: "find",
    },
    // tree 数据
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    treeConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    iconName() {
      return this.popVisible ? "icon-zuojiantou-1" : "icon-zuojiantou1";
    },
  },
  mounted() {
    // document.addEventListener("click", this.bodyCloseTable);
  },
  methods: {
    bodyCloseTable(e) {
      if (!this.immateShow) {
        this.popVisible = false;
      }
    },
    /**tree 节点点击事件 */
    nodeClick(node) {
      if (!this.canRootNode && node.children?.length > 0) {
        return false;
      }
      this.$emit("nodeClick", node);
      console.log("mycheck-node:", node);
      this.popVisible = false;
    },
    /**关闭 */
    close() {
      this.popVisible = false;
    },
    // 聚焦触发
    inputFocus(val) {
      this.$emit("inputFocus", val);
      if (this.immateShow) {
        console.log("触发了focus事件");
        // this.selectData = [];
        // this.tableConfig.pageConfig.currentPage = this.copyCurrentPage;
        // this.tableConfig.pageConfig.pageSize = this.copyPageSize;
        // let callData = {
        //   value: this.inputVal,
        //   currentPage: this.tableConfig.pageConfig.currentPage,
        //   pageSize: this.tableConfig.pageConfig.pageSize,
        //   type: 'entry',
        // };
        // this.$emit('inputSearch', callData);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wg-tree-option {
  text-align: right;
  padding: 5px;
  /deep/ .el-input__inner {
    border-radius: 2px;
  }
}
.selectIcon {
  width: 11px !important;
  margin-right: 6px;
}
</style>
