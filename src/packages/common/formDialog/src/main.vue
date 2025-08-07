<template>
  <wg-el-dialog v-bind="$attrs" v-on="$listeners" type="border" class="wg-form-dialog" :top="top">
    <slot name="title" slot="title">
      <wg-icon :name="iconName" v-if="iconName"></wg-icon>
      <span>{{ $attrs.title }}</span>
    </slot>
    <slot><span>这是一段信息</span></slot>
    <slot v-if="showFooter" name="btnOpt" slot="footer">
      <wg-button v-if="cancelBtn" size="large" @click="btnCancel">取消</wg-button>
      <wg-button v-if="submitBtn" :loading="loading" :disabled="loading" size="large" primary @click="btnSubmit"
        >确认</wg-button
      >
    </slot>
  </wg-el-dialog>
</template>
<script>
export default {
  name: 'wgFormDialog',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    cancelBtn: {
      type: Boolean,
      default: true,
    },
    submitBtn: {
      type: Boolean,
      default: true,
    },
    deleteBtn: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '5vh',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    btnCancel() {
      this.$emit('btnCancel');
    },
    btnSubmit() {
      this.$emit('btnSubmit');
    },
  },
};
</script>
<style lang="less" scoped>
.wg-form-dialog {
  /deep/ .el-dialog__body {
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
>
