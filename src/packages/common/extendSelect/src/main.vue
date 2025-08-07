<template>
  <wg-el-select
    :class="{ isSelectAll: isSelectAll }"
    v-bind="$attrs"
    v-model="selectedArray"
    :value-key="pickerOptions.value"
    @change="changeSelect"
    @remove-tag="removeTag"
    @visible-change="visibleChange"
    @clear="clear"
    @blur="blur"
    @focus="focus"
  >
    <wg-el-option v-if="hasSelectAll" label="全选" value="全选" @click.native.prevent="selectAll"></wg-el-option>
    <wg-el-option
      v-for="item in options"
      :key="item[pickerOptions.value]"
      :label="item[pickerOptions.label]"
      :value="item[pickerOptions.value]"
      v-bind="item"
    >
    </wg-el-option>
  </wg-el-select>
</template>

<script>
export default {
  name: 'wgExtendSelect',
  props: {
    options: Array,
    hasSelectAll: {
      type: Boolean,
      default: false,
    },
    pickerOptions: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
        };
      },
    },
  },
  data() {
    return {
      selectedArray: [],
      isSelectAll: false,
    };
  },
  watch: {
    selectedArray(val) {
      if (val instanceof Array && val.find((item) => item == '全选')) {
        this.$emit('input', val.slice(1));
      } else {
        this.$emit('input', val);
      }
    },
  },
  methods: {
    selectAll() {
      if (this.selectedArray.length < this.options.length) {
        this.selectedArray = [];
        this.options.map((item) => {
          this.selectedArray.push(item[this.pickerOptions.value]);
        });
        this.selectedArray.unshift('全选');
        this.isSelectAll = true;
      } else {
        this.selectedArray = [];
        this.isSelectAll = false;
      }
      this.$emit('change', this.selectedArray.slice(1));
    },
    changeSelect(val) {
      if (!val.includes('全选') && val.length === this.options.length && this.hasSelectAll) {
        this.selectedArray.unshift('全选');
        this.isSelectAll = true;
      } else if (val.includes('全选') && val.length - 1 < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '全选';
        });
        this.isSelectAll = false;
      }
      if (val instanceof Array && val.find((item) => item == '全选')) {
        this.$emit('change', val.slice(1));
      } else {
        this.$emit('change', val);
      }
    },
    removeTag(val) {
      if (val === '全选') {
        this.selectedArray = [];
      }
      this.$emit('remove-tag', val);
    },
    visibleChange(val) {
      this.$emit('visible-change', val);
    },
    clear() {
      this.$emit('clear');
    },
    blur(event) {
      this.$emit('blur', event);
    },
    focus(event) {
      this.$emit('focus', event);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .isFixHeight .el-input__inner {
  height: 28px;
}
/deep/ .isFixHeight .el-select__tags {
  height: 28px;
  overflow-y: auto;
  max-width: 100% !important;
}
// .dds
.isSelectAll {
  /deep/ .el-tag.el-tag--info {
    &:first-child {
      display: none;
    }
  }
}
</style>
