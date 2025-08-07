<template>
  <el-row :class="['superTree']">
    <el-row v-if="showSearch">
      <slot name="search">
        <wg-el-input
          v-model="searchForm[formSearchField]"
          @keyup.enter.native="searchData"
          suffix-icon="el-icon-search"
          :placeholder="placeholder"
        ></wg-el-input>
      </slot>
    </el-row>

    <el-row v-show="!isEmpty()" class="height-100">
      <wg-el-tree
        v-if="!useVirtual"
        :node-key="nodeKey"
        :ref="treeRef"
        v-bind="$attrs"
        v-on="$listeners"
        :data="tree.treeData"
        @check="check"
        :filter-node-method="searchMethod"
        :default-expand-all="defaultExpandAll"
      >
        <div
          slot-scope="{ node, data }"
          :class="{ treeFirst: node.level == 1 }"
          class="tree-item"
          @dblclick="dbclick"
        >
          <slot :data="data" :node="node">
            <div
              :class="{ 'left-op': showOp, 'left-all': !showOp }"
              :title="data[titleField]"
            >
              <span v-if="showIcon">
                <wg-icon v-if="data.icon" :name="data.icon"></wg-icon>
                <span v-else style="margin-left: 18px"></span>
              </span>

              <span v-html="text(data)"></span>
            </div>
            <div v-if="showOp" class="right-op">
              <wg-icon
                class="op-button"
                @click="add(data)"
                name="icon-xinzeng1"
              >
              </wg-icon>
              <wg-icon class="op-button" @click="edit(data)" name="icon-jianyi">
              </wg-icon>
              <wg-icon
                class="op-button-danger"
                @click="deleteData(data)"
                name="icon-shanchu"
              >
              </wg-icon>
            </div>

            <!--                        </div>-->
          </slot>
        </div>
      </wg-el-tree>
      <wg-easy-tree
        v-else
        :node-key="nodeKey"
        :ref="treeRef"
        v-bind="$attrs"
        v-on="$listeners"
        :data="tree.treeData"
        :height="virtualHeight"
        @check="check"
        :filter-node-method="searchMethod"
        :default-expand-all="defaultExpandAll"
      >
        <div
          slot-scope="{ node, data }"
          :class="{ treeFirst: node.level == 1 }"
          class="tree-item"
          @dblclick="dbclick"
        >
          <slot :data="data" :node="node">
            <div
              :class="{ 'left-op': showOp, 'left-all': !showOp }"
              :title="data[titleField]"
            >
              <span v-if="showIcon">
                <wg-icon v-if="data.icon" :name="data.icon"></wg-icon>
                <span v-else style="margin-left: 18px"></span>
              </span>

              <span v-html="text(data)"></span>
            </div>
            <div v-if="showOp" class="right-op">
              <wg-icon
                class="op-button"
                @click="add(data)"
                name="icon-xinzeng1"
              >
              </wg-icon>
              <wg-icon class="op-button" @click="edit(data)" name="icon-jianyi">
              </wg-icon>
              <wg-icon
                class="op-button-danger"
                @click="deleteData(data)"
                name="icon-shanchu"
              >
              </wg-icon>
            </div>

            <!--                        </div>-->
          </slot>
        </div>
      </wg-easy-tree>
    </el-row>
    <div v-if="isEmpty()" class="height-100">
      <div v-if="treeLoading" class="height-100">...</div>
      <div v-else class="height-100">
        <wg-empty />
      </div>
    </div>
  </el-row>
</template>
<script>
import ajax from "@/api/http";

export const treeToArray = (nodes, childName = "children") => {
  var r = [];
  if (Array.isArray(nodes)) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]); // 取每项数据放入一个新数组
      if (Array.isArray(nodes[i][childName]) && nodes[i][childName].length > 0)
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(treeToArray(nodes[i][childName]));
    }
  }
  return r;
};
export default {
  name: "WgSuperTree",
  props: {
    defaultExpandAll: {
      default: true,
      type: Boolean,
    },
    useVirtual: {
      default: false,
      type: Boolean,
    },
    virtualHeight: {
      type: String,
      default: "100%",
    },
    nodeKey: {
      default: "",
    },
    showSearch: {
      default: false,
    },
    searchModel: {
      default: "local",
    },
    /**
     * 树形显示字段
     */
    nameField: {
      default: "label",
    },
    /**
     * 树本地搜索字段
     */
    treeSearchField: {
      default: "label",
    },
    formSearchField: {
      default: "search",
    },
    titleField: {
      default() {
        return this.nameField;
      },
    },
    placeholder: {
      default: "请输入节点名称,回车进行搜索",
    },

    url: {
      default: "",
    },
    method: {
      default() {
        return "GET";
      },
    },
    searchForm: {
      default() {
        return {};
      },
    },

    /**
     * 搜索方法
     */
    filterNodeMethod: {},
    showIcon: {
      default() {
        return false;
      },
    },
    highLightSearch: {
      default: true,
    },
    showOp: {
      default: false,
    },
    iconField: {
      default() {
        return "icon";
      },
    },

    data: {
      type: Array,
    },

    /* 初始化时是否加载树*/
    mountCreateTree: {
      default: true,
    },
    //默认勾上的ID
    checkIds: {
      default() {
        return [];
      },
    },

    //默认勾上并且禁用的ID
    checkDisableIds: {
      default() {
        return [];
      },
    },

    disableIds: {
      default() {
        return [];
      },
    },
  },
  created() {
    this.treeRef = "tree_" + Math.round(Math.random() * 10000);
  },
  data() {
    return {
      treeRef: "tree_super",
      wait: 50,
      tree: {
        treeData: [],
      },

      treeLoading: false,
      lastCheckNodes: [],
      lastDisableNodes: [],
      lastCheckDisableNodes: [],
    };
  },

  mounted() {
    if (this.data && this.data.length > 0) {
      // 优先传过来的数据
      this.beforeNodes(this.data);
    } else if (this.mountCreateTree && this.url) {
      //是否初始化加载树
      this.reCreateTree();
    }
  },
  computed: {
    isEmpty() {
      return this.empty;
    },
    text() {
      return this.treeText;
    },
    /**
     * 优先用户定义的自定义方法，然后就组件内自定义方法
     * @returns {any}
     */
    searchMethod() {
      return this.filterNodeMethod ? this.filterNodeMethod : this.filterNode;
    },
  },
  watch: {
    data(val) {
      this.beforeNodes(val);
    },
    checkIds(ids) {
      setTimeout(() => {
        this.checkNodes(ids);
      }, 300);
    },
    checkDisableIds(ids) {
      setTimeout(() => {
        this.checkDisableNodes(ids);
      }, 300);
    },
    disableIds(ids) {
      setTimeout(() => {
        this.disableNodes(ids);
      }, 300);
    },
  },

  methods: {
    // expandAll() {
    //     this.show = false
    // this.$nextTick(() => {
    //     this.show = true
    //
    //     this.expandAll = true
    // })

    // setTimeout(() => {
    //     this.$nextTick(()=>{
    //         this.expandNode()
    //     })
    //
    // }, 300)

    // },
    expandAll() {
      console.log("ex ex ex ex ex ex");

      let tree = this.getTreeObj();
      // if (!node) {
      //     node = tree.store.root
      // }
      for (let j = 0; j < 10; j++) {
        setTimeout(() => {
          for (let i = 0; i < tree.store._getAllNodes().length; i++) {
            this.$nextTick(() => {
              tree.store._getAllNodes()[i].expanded = true;
            });
          }
        }, 300);
      }

      // node.expand()
    },

    empty() {
      let tree = this.getTreeObj();
      if (!tree) {
        return;
      }
      return tree.isEmpty;
    },
    notifyTreeChange() {
      if (this.checkIds) {
        this.checkNodes(this.checkIds);
      }
      if (this.checkDisableIds) {
        this.checkDisableNodes(this.checkDisableIds);
      }
      if (this.disableIds.length > 0) {
        this.disableNodes(this.disableIds);
      }
    },
    check(node, checks) {
      this.nodesCheckChange();
      this.$emit("check", node, checks);
    },

    dbclick(node) {
      this.$emit("dbclick", node);
    },

    nodesCheckChange() {
      // let treeObj = this.getZTreeObj()
      // let nodes = treeObj.getCheckedNodes(true);
      let nodes = this.getTreeObj().getCheckedNodes(false, true);

      this.$emit("nodesCheckChange", nodes);
    },
    getTreeObj() {
      return this.$refs[this.treeRef];
    },
    unCheckAll() {
      this.getTreeObj().setCheckedKeys([]);
      this.nodesCheckChange();
    },
    checkDisableNodes(ids) {
      let treeObj = this.getTreeObj();
      if (!treeObj) {
        return;
      }
      // 先取消之前的禁用
      this.lastCheckDisableNodes.map((id) => {
        // treeObj.setChkDisabled(node, false);
        let node = treeObj.getNode(id);

        this.$set(node.data, "disabled", false);
      });
      // 先取消之前的选中
      this.lastCheckDisableNodes.map((id) => {
        treeObj.setChecked(id, false);
      });
      setTimeout(() => {
        // 设置当前选中
        ids.map((id) => {
          treeObj.setChecked(id, true);
        });

        // 设置当前禁用
        ids.map((id) => {
          let node = treeObj.getNode(id);
          // node.data.disabled = true
          this.$set(node.data, "disabled", true);
        });
        // 记录上次的选中
        this.lastCheckDisableNodes = ids;
      }, this.wait);
    },
    async checkNodes(ids) {
      const idList = ids;
      await this._checkNodes(idList);
    },
    async _checkNodes(ids) {
      let treeObj = this.getTreeObj();

      if (!treeObj) {
        return;
      }
      // 先取消之前的选中
      this.lastCheckNodes.map((id) => {
        treeObj.setChecked(id, false);
      });
      this.$nextTick(() => {
        ids.map((id) => {
          treeObj.setChecked(id, true, false);
        });
      });
      this.lastCheckNodes = ids;
    },

    //禁用节点
    disableNodes(ids) {
      let treeObj = this.getTreeObj();
      if (!treeObj) {
        return;
      }
      // 先取消之前的禁用
      this.lastDisableNodes.map((id) => {
        let node = treeObj.getNode(id);
        // node.data.disabled = false
        if (node) {
          this.$set(node.data, "disabled", false);
        }
      });

      // setTimeout(() => {
      // 设置当前禁用
      ids.map((id) => {
        let node = treeObj.getNode(id);
        if (node) {
          this.$set(node.data, "disabled", true);
        }
      });
      this.lastDisableNodes = ids;
      this.$forceUpdate();
      // }, this.wait)
    },
    getTreeData() {
      return this.tree.treeData;
    },
    checkAll() {
      if (!this.nodeKey) {
        console.error("全选必须设置nodeKey");
        return;
      }
      let nodeList = treeToArray(this.getTreeData());
      let keys = [];
      nodeList.map((node) => {
        let key = node[this.nodeKey];
        if (key) {
          keys.push(key);
        }
      });
      this.getTreeObj().setCheckedKeys(keys);
      this.nodesCheckChange();
    },
    treeText(data) {
      let text = data[this.nameField];

      function getHighLineText(text) {
        return `<span style="color:#ED5151;">${text}</span>`;
      }

      let searchContent = this.searchForm[this.formSearchField];
      if (this.highLightSearch && searchContent) {
        text = text.replace(searchContent, getHighLineText(searchContent));
      }
      return text;
    },
    add(parent) {
      this.$emit("add", parent);
    },
    deleteData(data) {
      this.$emit("delete", data);
    },
    edit(data) {
      this.$emit("edit", data);
    },
    changeData(val) {
      setTimeout(() => {
        // this.tree.treeData = val
        this.$set(this.tree, "treeData", val);
        this.$forceUpdate();
      }, this.wait);
    },

    async reCreateTree() {
      let treeData = await this.addChildren();
      this.beforeNodes(treeData);
      this.$nextTick(() => {
        setTimeout(() => {
          this.notifyTreeChange();
        }, 50);
      });
    },

    async addChildren(node = undefined) {
      let data = await this.getSearchNode();
      if (!node) {
        //根节点
        return data;
      } else {
        this.beforeNodes(data, false);
        node.data.children = data;
      }
    },

    async getSearchNode() {
      let res = {};
      this.treeLoading = true;
      if (this.method.toUpperCase() == "GET") {
        res = await ajax.get(this.url, this.searchForm);
      } else {
        res = await ajax.post(this.url, this.searchForm);
      }
      this.treeLoading = false;
      if (res.code == "0") {
        let data = res.data;
        return data;
      } else {
        return [];
      }
    },

    beforeNodes(nodeTree, replace = true) {
      let nodeList = treeToArray(nodeTree);
      this.$emit("beforeNodes", nodeTree, nodeList);
      if (replace) {
        this.changeData(nodeTree);
      }
    },
    filterNode(value, data) {
      let search = value ? value.trim() : "";
      if (!search) {
        return true;
      }

      //支持多列搜索，以逗号分割
      let fields = this.treeSearchField.split(",");

      for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let content = data[field];
        // 如果包含字段则返回true
        if (content && content.includes(search)) {
          return true;
        }
      }
      return false;
    },
    searchData() {
      if (this.searchModel == "remote") {
        //如果是远程搜索
        this.reCreateTree();
      } else {
        //本地搜索
        this.getTreeObj().filter(this.searchForm[this.formSearchField]);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "./tree.less";
</style>
