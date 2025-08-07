<template>
  <li
    @mouseleave="hoverLeaveItem"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="el-select-dropdown__item"
    v-show="visible"
    :class="{
      selected: itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      hover: hover,
    }"
  >
    <slot>
      <el-checkbox v-if="select.multiple" :value="Checked" @click.native.prevent>{{ currentLabel }}</el-checkbox>
      <span v-else>{{ currentLabel }}</span>
    </slot>
  </li>
</template>
<script>
import { Option } from 'element-ui';

export default {
  extends: Option,
  name: 'wgElOption',
  computed: {
    Checked: {
      get() {
        if (!this.select.multiple) {
          return this.isEqual(this.value, this.select.value);
        } else {
          const t = this.contains(this.select.value, this.value);
          if (this.value === '全选' && !t) return this.isAllCechk(this.select.options, this.select.value);
          return t;
        }
      },
      set(val) {
        this.SET_CHECKED(val);
      },
    },
    itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.value);
      } else {
        const t = this.contains(this.select.value, this.value);
        if (this.value === '全选' && !t) return this.isAllCechk(this.select.options, this.select.value);
        return t;
      }
    },
  },
  methods: {
    hoverLeaveItem() { // 悬浮移走去掉样式
			if (!this.disabled && !this.groupDisabled) {
				this.hover = !this.hover;
			}
		},
    isAllCechk(a, b) {
      const t = a.filter((c) => {
        if (c.value !== '全选') return c.value;
      });
      return t.length === b.length;
    },
    selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', [this, true]);
      }
    },
    checkBoxChange(val) {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', [this, true]);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import './option.less';
</style>
