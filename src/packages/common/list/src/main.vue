<template>
  <li class="wg-list" @click="handClick">
    <div class="wg-list-title">
      <slot name="title"></slot>
    </div>
    <div class="wg-list-content">
      <span>
        <wg-icon v-if="iconName" :name="iconName" :style="iconStyle"></wg-icon>
        <slot>ddddddd</slot>
      </span>
      <span>
        <slot name="btnOpt" class="wg-list-btnOpt"></slot>
      </span>
    </div>
  </li>
</template>
<script>
export default {
  name: 'wgList',
  props: {
    iconName: String,
    iconStyle: Object,
  },
  methods: {
    handClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
<style lang="less" scoped>
@import './list.less';
</style>
