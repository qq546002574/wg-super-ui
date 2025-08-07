<template>
  <div class="wg-text-icon" :class="[size, shape, direction]" :style="customStyle">
    {{text}}
  </div>
</template>

<script>
export default {
  name: "wgTextIcon",
  props: {
    size: {
      type: String,
      default: 'normal'
    },
    shape: {
      type: String,
      default: 'circular'
    },
    customStyle: {
      type: Object,
      default: () => {}
    },
    text: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      default: 'left'
    }
  }
};
</script>

<style scoped lang="less">
.wg-text-icon{
  display: inline-flex;
  align-items: center;
  border: 1px solid #222222;
  justify-content: center;
  white-space: nowrap;
  &.normal{
    height: 20px;
    font-size: 12px;
    padding: 0 8px;
    &.round,&.square{
      width: 20px;
      overflow: hidden;
    }
  }
  &.small{
    height: 16px;
    font-size: 8px;
    padding: 0 4px;
    &.round,&.square{
      width: 16px;
      overflow: hidden;
    }
  }
  &.large{
    height: 24px;
    font-size: 14px;
    padding: 0 10px;
    &.round,&.square{
      width: 24px;
      overflow: hidden;
    }
  }
  &.round{
    border-radius: 50%;
  }
  &.rectangle{
    border-radius: 2px;
  }
  &.circular{
    border-radius: 50px;
  }
  &.square{
    border-radius: 2px;
  }
  &.semicircle{
    &.left{
      border-bottom-left-radius: 50px;
      border-top-left-radius: 50px;
    }
    &.right{
      border-bottom-right-radius: 50px;
      border-top-right-radius: 50px;
    }
  }
}
</style>