<template>
  <button
    v-bind="$attrs"
    class="wg-button"
    :type="btnType"
    :loading="loading"
    @click="handleClick"
    :disabled="disabled"
    :style="btnStyle"
    :autofocus="autofocus"
    :class="[
      `wg-button-${type}`,
      buttonSize ? 'wg-button-' + buttonSize : '',
      { 'is-primary': primary },
      { 'is-plain': plain },
      { 'is-disabled': disabled },
      { 'is-delete': isDelete },
    ]"
  >
    <i class="el-icon-loading" v-if="loading" />
    <wg-icon
      v-if="icon !== '' && !loading"
      :name="icon"
      :style="iconStyle"
      :class="[
        `wg-btn-icon`,
        buttonSize ? 'wg-btn-icon-' + buttonSize : '',
        { 'is-primary': primary },
        { 'is-disabled': disabled },
      ]"
    ></wg-icon>
    <span v-if="$slots.default" :style="{'margin-left':compoute_margin}" >
      <slot></slot>
    </span>
  </button>
</template>
<script>
import XEUtils from 'xe-utils';

export default {
  name: 'wgButton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    btnType: {
      type: String,
      default: 'button',
    },
    type: {
      type: String,
      default: 'default',
    },
    primary: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: [Boolean, Function],
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    size: String,
    autofocus: Boolean,
    iconStyle: Object, // 图标样式
    btnStyle: Object, // 按钮样式
    debonceTime: Number, // 防抖时间
  },
  computed: {
    buttonSize() {
      return this.size || 'default';
    },
    compoute_margin(){
      if(this.icon || this.loading){
         const margin_map = {
          'default':'4px',
          'mini':'2px',
          'small':'2px',
          'large':'4px',
          'xsmall':'2px',
        }
        return margin_map[this.buttonSize]? margin_map[this.buttonSize]:'0px'
      }else{
        return '0px'
      }
    }
  },
  methods: {
    handleClick(evt) {
      if (this.loading) return;
      if (!this.click) {
        this.click = XEUtils.debounce(
          function(evt) {
            this.$emit('click', evt);
          },
          this.debonceTime || window.top.btnGlobalDebounceTime,
          {
            leading: true,
            trailing: false,
          },
        );
      }
      this.click(evt);
    },
  },
};
</script>
<style lang="less" scoped>
@import './main.less';

</style>
