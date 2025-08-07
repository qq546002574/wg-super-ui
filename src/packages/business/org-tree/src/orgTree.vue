<template>
  <el-row class="wg-org-tree-main">
    <!--如果是组织机构才能显示细别分类-->
    <el-row v-if="orgType === 'org' && showClicDetailType" class="search-tool">
      <el-checkbox-group
        :indeterminate="true"
        v-model="clicDetailType"
        @change="handlerCheck"
      >
        <el-checkbox
          v-for="item in clicList"
          :value="item.itemValue"
          :label="item.itemValue"
          :key="item.itemValue"
          >{{ item.itemName }}</el-checkbox
        >
      </el-checkbox-group>
    </el-row>
    <el-row class="search-tool">
      <div
        style="width: 100%"
        :class="[
          'flex',
          'search-tool-input',
          border && 'search-tool-input-border',
        ]"
      >
        <wg-el-input
          suffix-icon="el-icon-search"
          v-model="searchForm.queryParam"
          @keyup.enter.native="search"
          placeholder="请输入组织名称、编码"
        >
          <!--                <el-button-->
          <!--                        @click="search"-->
          <!--                        slot="append" icon="el-icon-search"></el-button>-->
        </wg-el-input>
      </div>
    </el-row>

    <wg-super-tree
      v-show="hasQuerySearch"
      class="wg-org-tree"
      :props="{
        label: 'name',
        children: 'children',
        isLeaf: 'leaf',
      }"
      :style="treeStyle"
      :default-expand-all="true"
      :expand-on-click-node="false"
      node-key="code"
      :showSearch="false"
      ref="orgTree"
      :url="url"
      :search-form="searchForm"
      @beforeNodes="beforeNodes"
      :nameField="showName"
      titleField="name"
      :showIcon="true"
      :show-checkbox="showCheckbox"
      @nodesCheckChange="nodesCheckChange"
      :check-strictly="checkStrictly"
      :checkIds="checkIds"
      @current-change="nodeChange"
      @check-change="checkChange"
      @dbclick="dbclick"
    >
    </wg-super-tree>
    <wg-super-tree
      v-show="!hasQuerySearch"
      class="wg-org-tree"
      :props="{
        label: 'name',
        children: 'children',
        isLeaf: 'leaf',
      }"
      :style="treeStyle"
      :default-expand-all="expandAll"
      :lazy="true"
      :expand-on-click-node="false"
      node-key="code"
      :load="loadNode"
      :showSearch="false"
      :mountCreateTree="false"
      ref="orgTreeLazy"
      :url="url"
      :search-form="searchForm"
      @beforeNodes="beforeNodes"
      :nameField="showName"
      titleField="name"
      :showIcon="true"
      :show-checkbox="showCheckbox"
      @nodesCheckChange="nodesCheckChange"
      :check-strictly="checkStrictly"
      :checkIds="checkIds"
      @current-change="nodeChange"
      @check-change="checkChange"
      @dbclick="dbclick"
    >
    </wg-super-tree>
  </el-row>
</template>
<script>
import { isEmpty, treeToArray } from "@/utils/validate";
import ajax from "@/api/http";

export default {
  name: "wgOrgTree",
  props: {
    showClicDetailType: {
      default: false,
    },
    border: Boolean,
    treeStyle: {
      default() {
        return {};
      },
    },
    showUserCount: {
      default: false,
    },
    hasCheck: {
      default: false,
    },
    checkIds: {},
    // 只选组织结构
    onlyOrg: {
      default: true,
    },
    // 只选叶子节点
    onlyLeaf: {
      default: false,
    },
    chkboxType: {},
    showCheckbox: {
      default: false,
    },

    checkStrictly: {
      default: false,
    },
    // 显示类型
    orgType: {
      default: "org",
    },
  },
  data() {
    return {
      show: true,
      expandAll: false,
      clicDetailType: [],
      searchForm: {
        clicDetailType: [],
        isAllData: 1,
        orgId: "0",
        queryParam: "",
        type: 1,
      },
      showName: "text",
      clicList: [],
      hasQuerySearch: false,
    };
  },
  computed: {
    lazyLoader() {
      return this.hasSearch();
    },
    url() {
      if (this.orgType == "org") {
        return "/bcs/api/organization/mergeTree";
      } else {
        return "/bcs/api/organization/medAndAreaTree";
      }
    },
  },
  components: {},
  mounted() {
    this.getClicDetailType();
  },
  methods: {
    test() {
      this.clicDetailType = [];
    },
    checkChange(data, selected) {
      if (this.onlyLeaf && !this.isLeafNode(data)) {
        return;
      }
      this.$emit("check-change", data, selected);
    },
    async loadNode(node, resolve) {
      //如果已经请求出来了，就直接返回

      if (node.data.canReq == false) {
        if (node.data.children) {
          return resolve(node.data.children);
        } else {
          return resolve([]);
        }
      }
      //否则请求
      this.$nextTick(async () => {
        if (node.data.type) {
          this.searchForm.orgId = node.data.orgId;
          this.searchForm.type = node.data.type;
          node.data.canReq = false;
        }

        let data = await this.getTreeObj().getSearchNode();
        this.beforeNodes(data);
        return resolve(data);
      });
    },
    handlerCheck(values) {
      // if (values.length == 0) {
      //     this.searchForm.clicDetailType = ''
      //
      // } else {
      //     let code = values.pop()
      //     this.clicDetailType = [code]
      //     this.searchForm.clicDetailType = code
      // }
      this.searchForm.clicDetailType = values.join(",");
      this.search();
    },
    dbclick(node) {
      this.$emit("dbclick", node);
    },
    async getClicDetailType() {
      const response = await ajax.get(
        "/bcs/codeTableItem/getcodeTableItemInfoList",
        { standardCode: "BCS0034" }
      );
      if (response.code == "0") {
        this.clicList = response.data;
      }
    },
    isLeafNode(node) {
      let leaf = false;
      // 如果没有节点下级节点字段，表示可以有子节点
      if (!node.isNextChild) {
        leaf = true;
      }
      //有children,并且有值表示非子节点
      if (node.children && node.children.length > 0) {
        leaf = false;
      }
      return leaf;
    },
    getOrgNodes(nodes) {
      let data = [];
      nodes.map((node) => {
        if (node && node.type === 3) {
          data.push(node);
        }
      });
      return data;
    },
    nodesCheckChange(nodes) {
      let data = [];
      // 如果只选叶子节点
      if (this.onlyLeaf) {
        nodes.map((node) => {
          if (this.isLeafNode(node)) {
            data.push(node);
          }
        });
      } else {
        data = nodes;
      }
      //只选组织结构
      if (this.onlyOrg) {
        data = this.getOrgNodes(data);
      }

      this.$emit("nodesCheckChange", data);
    },
    nodeChange(node) {
      this.orgChange(node);
      // debugger
      // this.$emit("nodeChange", node)
    },
    unSelectTree() {
      this.getTreeObj().unSelectTree();
    },
    unCheckAll() {
      this.getTreeObj().unCheckAll();
    },
    getTreeObj() {
      if (this.hasSearch()) {
        console.log(
          "this.searchForm.queryParam1111111111:",
          this.searchForm.queryParam
        );
        return this.$refs.orgTree;
      } else {
        console.log(
          "this.searchForm.queryParam2222222222222:",
          this.searchForm.queryParam
        );

        return this.$refs.orgTreeLazy;
      }
    },
    async search() {
      this.searchForm.orgId = "0";
      this.searchForm.type = "1";
      if (this.hasSearch()) {
        this.hasQuerySearch = true;
      } else {
        this.hasQuerySearch = false;
      }
      await this.getTreeObj().reCreateTree();

      // 处理有搜索条件就展开
      if (this.hasSearch()) {
        // this.$nextTick(() => {
        //     this.show = true
        //     this.$refs.orgTree.expandAll()
        // })
      } else {
        //没有搜索条件就关闭

        this.$nextTick(() => {
          this.show = true;
        });
      }
    },
    hasSearch() {
      const { queryParam, clicDetailType } = this.searchForm;
      return !isEmpty(queryParam) || !isEmpty(clicDetailType);
    },

    fixItem(item) {
      function getHighLineText(text) {
        return `<span class="tree-work-user-count">${text}</span>`;
      }

      function getRedLineText(text) {
        return `<span style="color:#22ace3 ">${text}</span>`;
      }

      let name = `${item.name}`;
      if (
        name &&
        this.searchForm.queryParam &&
        name.includes(this.searchForm.queryParam)
      ) {
        name = name.replace(
          this.searchForm.queryParam,
          getRedLineText(this.searchForm.queryParam)
        );
      }

      let count = 0;
      if (item.userCount) {
        count = item.userCount;
      }
      if (this.showUserCount) {
        name += getHighLineText("(" + count + ")");
      }
      item[this.showName] = name;

      // 如果已经展开过，就无需请求
      if (item.children && item.children.length > 0) {
        item["icon"] = "icon-zuzhijigou";
        item.canReq = false;
        return;
      }
      // todo 这里需要改成，是否有子节点
      if (item.isNextChild == true) {
        item["icon"] = "icon-zuzhijigou";
        item.children = [];
        item.canReq = true;
      } else {
        // item["iconSkin"] = 'wg-menu-item'
        item["children"] = [];
        item.canReq = false;
        this.$set(item, "isLeaf", true);
        this.$set(item, "leaf", true);
        item.isLeaf = true;
        item.leaf = true;
      }

      if (this.hasSearch()) {
        if (item.children && item.children.length == 0) {
          delete item["children"];
        }
      }
    },

    beforeNodes(nodeTree, first = true) {
      let nodes = treeToArray(nodeTree);

      for (let i = 0; i < nodes.length; i++) {
        let item = nodes[i];
        if (this.first) {
          if (item.children.length == 0) {
            item["isLast"] = true;

            delete item["children"];
          }
        }
        this.fixItem(item);
        // 递归处理子节点
        // if (item.children) {
        //     this.beforeNodes(item.children, false)
        // }
      }
    },
    onExpand(event, treeId, node) {
      if (node.canReq) {
        this.searchForm.orgId = node.orgId;
        this.searchForm.type = node.type;
        this.$refs.orgTree.addChildren(node);
        node.canReq = false;
      }
    },
    orgChange(node) {
      // 如果只能选择组织机构
      if (this.onlyOrg && node.type != 3) {
        return;
      }
      this.$emit("orgChange", node);
    },
    nodeDblClick(event, treeId, node) {
      if (!node) {
        return;
      }
      // 如果只能选择组织机构
      if (this.onlyOrg && node && node.type != 3) {
        return;
      }
      this.$emit("nodeDblClick", node);
    },
    nodeClick(event, treeId, node) {
      this.orgChange(node);
    },
  },
};
</script>
<style lang="less" scoped>
@import "./orgTree.less";
</style>
<style lang="less">
.wg-org-tree {
  .tree-item {
    .tree-work-user-count {
      padding-left: 8px;
      color: #22ace3;
    }
  }

  .el-tree-node.is-current > .el-tree-node__content {
    .tree-work-user-count {
      color: #f8f8f8;
    }
  }
}
</style>
