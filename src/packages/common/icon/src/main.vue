<template>
  <el-tooltip :disabled="disabled" :content="content" :placement="placement">
    <svg @click="nClick" class="wg-icon" aria-hidden="true">
      <use :xlink:href="`#${name}`"></use>
    </svg>
  </el-tooltip>
</template>

<script>
// iconfont图标字体文件
// import './font';

export default {
  name: "wgIcon",
  props: {
    type: {
      default() {
        return "primary";
      },
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
      default: "bottom",
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    nClick() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="less" scoped>
.wg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: 0;
}
</style>
