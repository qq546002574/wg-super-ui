<template>
  <vxe-pulldown ref="pullTree" transfer>
    <template #default>
      <wg-el-input ref="inputRef" slot="reference" v-model="inputVal" :placeholder="placeholder" clearable @clear="inputClear" @input="input" @focus="focus"></wg-el-input>
    </template>
    <template #dropdown>
      <wg-el-tree ref="treeRef" :data="treeData" v-bind="treeConfig" v-on="$listeners" class="treeContanier" @node-click="nodeClick"></wg-el-tree>
    </template>
  </vxe-pulldown>
</template>
<script>
import { isEmpty } from '@/utils/validate';
export default {
  name: 'wgPullTree',
  props: {
    placement: {
      type: String,
      default: 'bottom',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    treeConfig: {
      type: Object,
      default: () => {},
    }, 
    treeData: {
      type: Array,
      default: () => [],
    },
    popWidth: [String, Number],
    defaultModel: {
      type:[String,Number,Array],
    },
  },
  model: {
    prop: 'defaultModel',
    event: 'tagInput',
  },
  data() {
    return {
      inputVal: '',
      popoverVal: false,
    };
  },
  computed: {},
  watch: {
    defaultModel: {
      handler(val) {
        this.inputVal = val || '';
      },
      immediate: true,
    }
  },
  created() {
  },
  methods: {
    focus() {
      this.$refs.pullTree.showPanel();
    },
    input(val) {
      this.$emit('input', val);
    },
    inputClear() {
      this.inputVal = '';
      this.$emit('tagInput', '');
    },
    nodeClick(el, node, target) {
      const { props, nodeKey } = this.treeConfig;
      const { label } = props;
      this.inputVal = el[label];
      this.$emit('tagInput', el[label]);
      this.$emit('node-click', el, node, target);
      // 若行数据里的showPanel为true,则点击该节点时不关闭弹窗,否则关闭
      if (!el.showPanel) {
        this.$refs.pullTree.hidePanel();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import './main.less';
</style>
