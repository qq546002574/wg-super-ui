<template>
  <div class="wg-button-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'wgButtonGroup',
};
</script>
<style lang="less" scoped>
.wg-button-group {
  display: inline-block;
  vertical-align: middle;
  .wg-button {
    float: left;
    position: relative;
  }
  .wg-button + .wg-button {
    margin-left: 0;
  }
  .wg-button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .wg-button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .wg-button:last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .wg-button-default.is-primary:not(:last-child) {
    border-right-color: hsla(0, 0%, 100%, 0.5);
  }
}
</style>
