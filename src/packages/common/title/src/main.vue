<template>
  <div v-bind="$attrs" class="wg-title f16 title" :class="size">
    <div class="wg-title-content">
      <span class="wg-line" :class="noline ? 'wg-line-no' : ''"></span>
      <slot></slot>
    </div>
    <div class="wg-title-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wgTitle',
  props: {
    size: {
      type: String,
      default: 'default',
    },
    noline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
@import './main.less';
</style>
