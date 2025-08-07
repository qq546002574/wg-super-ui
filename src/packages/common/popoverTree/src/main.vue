<template>
  <el-popover
    ref="popoverTree"
    :placement="placement"
    v-model="popoverVal"
    :width="popWidth"
    :disabled="disabled"
    @hide="hidePanle"
    class="wgPopoverTree"
    >
    <wg-el-tree
      ref="treeRef"
      :data="treeData"
      v-bind="treeConfig"
      v-on="$listeners"
      class="treeContanier"
      @node-click="nodeClick"
      @check="check"
      ></wg-el-tree>
    <div
      slot="reference" 
      :class="['tags_input_div', {'isFixHeight': isFixHeight}]" 
      :style="outMaxWidth">
      <div class="tagsDiv" v-if="treeConfig.showCheckbox && checkData[0]">
        <template v-if="collapseTags">
          <el-tag
            size="mini"
            type="info"
            :closable="!disabled"
            @close="tagsClose(checkData[0])"
            >{{ getTagsName(checkData[0])}}</el-tag
          >
          <div class="tagsCount" v-if="checkData.length !== 1"> + {{checkData.length - 1}}</div>
        </template>
        <template v-else>
          <el-tag
            v-for="(tag, index) in checkData"
            :key="index"
            size="mini"
            type="info"
            :closable="!disabled"
            @close="tagsClose(tag)"
            >{{ getTagsName(tag) }}</el-tag
          >
        </template>
      </div>
      <wg-el-input
        ref="inputRef"
        slot="reference"
        :class="['tags_input', {'paddLR5': treeConfig.showCheckbox}]"
        :style="inputMaxWidth"
        v-model="inputVal"
        :placeholder="placeholder"
        :disabled="disabled"
        clearable
        @clear="inputClear"
        @input="input">
      </wg-el-input>
    </div>
  </el-popover>
</template>
<script>
import { isEmpty } from '@/utils/validate';
export default {
  name: 'wgPopoverTree',
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
    popWidth: {
      type:[String,Number,Array],
      default: 300,
    },
    defaultModel: {
      type:[String,Number,Array],
    },
    isFixHeight: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      checkData: [],
      // 多选
      inputWidth: 0,
    };
  },
  computed: {
    inputMaxWidth() {
      const { showCheckbox } = this.treeConfig;
      const styleObj = {
        width: '100px',
        maxWidth: this.inputWidth + 'px',
      };
      const hasForm = this.inputWidth === 2 ? {} : styleObj;
      return showCheckbox ? hasForm : {};
    },
    outMaxWidth() {
      const { showCheckbox } = this.treeConfig;
      const selectMaxWidth = {maxWidth: this.inputWidth + 'px'};
      const hasForm = this.inputWidth === 2 ? {} : selectMaxWidth;
      return showCheckbox ? hasForm  : {};
    },
  },
  watch: {
    treeData: {
      handler(val) {
        const { showCheckbox } = this.treeConfig;
        if (showCheckbox) {
          this.$nextTick(()=> {
            this.initSelect();
          })
        }
      },
      immediate: true,
      deep: true,
    },
    defaultModel: {
      handler(val) {
        const { props, nodeKey, showCheckbox } = this.treeConfig;
        const { label } = props;
        if (showCheckbox) { // 多选有初始值
          if (isEmpty(val)) {
            val = [{label: '', value: ''}];
          }
          const map = val.map(item=> {
            let json = {};
            json[label] = item.label;
            json[nodeKey] = item.value;
            return json;
          })
          if (map.length === 1 && isEmpty(map[0][nodeKey])) {
            // 取消之前的勾选
            this.$nextTick(()=> {
              this.checkData.forEach(item=> {
                if (!isEmpty(item[nodeKey])) {
                  const node = this.$refs.treeRef.getNode(item[nodeKey]);
                  this.$refs.treeRef.setChecked(node , false, false);
                }
              })
            })
            this.checkData = [];
          } else {
            this.checkData = map;
            // 默认勾选
            this.$nextTick(()=> {
              this.initSelect();
            })
          }
        } else { // 单选有初始值
          this.inputVal = val[0].label || '';
        }
      },
      immediate: true,
    },
  },
  created() {
  },
  mounted() {
    let self = this;
    this.$nextTick(()=>{
      self.inputWidth = self.$el.clientWidth ? self.$el.clientWidth : 300;
    })
  },
  methods: {
    hidePanle() {
      const { props, nodeKey, showCheckbox } = this.treeConfig;
      // 多选下，若搜索框有值，popover隐藏时清空掉
      if (showCheckbox && !isEmpty(this.inputVal)) {
        this.inputVal = '';
      };
    },
    initSelect() {
      const { nodeKey } = this.treeConfig;
      this.checkData.forEach(item=> {
        if (!isEmpty(item[nodeKey])) {
          const node = this.$refs.treeRef.getNode(item[nodeKey]);
          this.$refs.treeRef.setChecked(node , true, false);
        }
      })
    },
    // 设置v-model
    setModel() {
      const { props, nodeKey } = this.treeConfig;
      const { label } = props;
      const map = this.checkData.map(item=> {
        return {
          label: item[label],
          value: item[nodeKey],
        }
      })
      this.$emit('tagInput', map);
    },
    // 关闭tags
    tagsClose(tag) {
      const { nodeKey } = this.treeConfig;
      this.checkData = this.checkData.filter((item)=>{
        if (item[nodeKey] === tag[nodeKey]) {
          // 取消选中状态
          this.$refs.treeRef.setChecked(item, false, false);
          return false;
        } else {
          return true;
        }
      });
      this.setModel();
    },
    getTagsName(data) {
      const { props } = this.treeConfig;
      const { label } = props;
      return data[label];
    },
    check(targetNode, nodeCheckObj) {
      this.checkData = this.$refs.treeRef.getCheckedNodes(true);
      this.setModel();
      this.$emit('check', targetNode, nodeCheckObj);
    },
    input(val) {
      this.$emit('input', val);
    },
    inputClear() {
      this.inputVal = '';
      this.$emit('tagInput', [{label: '', value: ''}]);
    },
    nodeClick(el, node, target) {
      const { props, nodeKey, showCheckbox } = this.treeConfig;
      // 多选则不走该方法
      if (showCheckbox) return;
      // 单选
      const { label } = props;
      this.inputVal = el[label];
      const map = {
        label: el[label],
        value: el[nodeKey],
      };
      this.$emit('tagInput', [map]);
      this.$emit('node-click', el, node, target);
      // 若行数据里的showPanel为true,则点击该节点时不关闭弹窗,否则关闭
      if (!el.showPanel) {
        this.popoverVal = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.treeContanier {
    max-height: 400px;
    overflow-y: auto;
  }
.wgPopoverTree {
  display: inline-block;
  width: 100%;
  .isFixHeight {
    height: 28px;
    overflow: auto;
  }
  .tags_input_div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border: 1px solid #bfc3c5;
    width: 100%;
    border-radius: 2px;
    .tagsDiv {
      line-height: 23px;
      display: contents;
      .el-tag {
        box-sizing: border-box;
        border-color: transparent;
        margin: 2px 0 2px 6px;
        background-color: #f0f2f5;
        display: flex;
        max-width: 100%;
        align-items: center;
        border-radius: 2px;
        /deep/ .el-icon-close {
          transform: scale(0.8);
          top: 1px;
        }
      }
      .tagsCount {
        display: flex;
        height: 20px;
        padding: 0 5px;
        line-height: 19px;
        margin: 2px 0 2px 6px;
        background-color: #f0f2f5;
        box-sizing: border-box;
        border-color: transparent;
        max-width: 100%;
        align-items: center;
        color: #909399;
        border-radius: 2px;
      }
    }
    .tags_input {
      flex-grow: 1;
      width: 1%;
      height: 26px;
      line-height: 24px !important;
      /deep/ .el-input__inner {
        border: none;
        outline: none;
      }
    }
    .paddLR5 {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
</style>
  