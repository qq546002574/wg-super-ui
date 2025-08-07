<template>
  <el-popover
    v-model="show"
    placement="bottom"
    width="400"
    height="400"
    trigger="click"
  >
    <el-row>
      <wg-org-tree
        v-bind="$attrs"
        v-on="$listeners"
        :treeStyle="{ height: '300px', overflow: 'auto' }"
        @orgChange="orgChange"
        @dbclick="dbclick"
      >
      </wg-org-tree>
    </el-row>

    <wg-el-input
      v-model="workDeptShow"
      :readOnly="true"
      clearable
      placeholder="请选择部门"
      slot="reference"
    >
    </wg-el-input>
  </el-popover>
</template>
<script>
export default {
  name: "wgOrgTreeInput",
  components: {},
  props: {
    data_value: {
      default: "",
    },
    workDeptName: {
      default: "",
    },
  },

  model: {
    prop: "data_value",
    event: "data_value_change",
  },
  data() {
    return {
      workDept: "",
      workDeptShow: this.workDeptName,
      show: false,
    };
  },
  watch: {
    workDeptName(val) {
      this.workDeptShow = val;
    },

    data_value(value) {
      if (!value && this.workDeptShow) {
        this.workDeptShow = "";
      }
    },
    workDept(value) {
      this.$emit("data_value_change", value);
    },
    workDeptShow(value) {
      if (!value) {
        this.workDept = "";
      }
    },
  },
  methods: {
    orgChange(node) {
      this.$emit("orgChange", node);
      this.workDeptShow = `${node.name}`;
      this.workDept = node.code;
      // this.show = false
    },
    dbclick(node) {
      console.log("🚀🚀🚀 =>> dbclick =>> nodeAAA", node);
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "./orgTreeInput.less";
</style>
