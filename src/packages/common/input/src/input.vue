<template>
  <div class="wg-input-custom">
    <div
      :class="[
        'wg-el-input',
        type === 'textarea' ? 'el-textarea' : 'el-input',
        size ? 'el-input--' + size : 'medium',
        {
          'is-disabled': inputDisabled,
          'is-exceed': inputExceed,
          'el-input-group': $slots.prepend || $slots.append,
          'el-input-group--append': $slots.append,
          'el-input-group--prepend': $slots.prepend,
          'el-input--prefix': $slots.prefix || prefixIcon,
          'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword,
          'warning-length-level': lengthLevel == 'warning',
          'error-length-level': lengthLevel == 'error',
          _inputIcon: $slots.prefix || prefixIcon,
          _inputClear: showClear,
        },
      ]"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <template v-if="type !== 'textarea'">
        <!-- 前置元素 -->
        <div class="el-input-group__prepend" v-if="$slots.prepend">
          <slot name="prepend"></slot>
        </div>
        <input
          :tabindex="tabindex"
          v-if="type !== 'textarea'"
          :class="['el-input__inner', { paddRight32: showClear }]"
          v-bind="$attrs"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="inputDisabled"
          :readonly="readonly"
          :autocomplete="autoComplete || autocomplete"
          ref="input"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @paste="handlePasting"
          :aria-label="label"
          :maxlength="myMaxlength"
        />
        <!-- 前置内容 -->
        <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
          <slot name="prefix"></slot>
          <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
        </span>
        <!-- 后置内容 -->
        <span class="el-input__suffix" v-if="getSuffixVisible()">
          <span class="el-input__suffix-inner">
            <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
              <slot name="suffix"></slot>
              <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
            </template>
            <i
              v-if="showClear"
              class="el-input__icon el-icon-circle-close el-input__clear"
              @mousedown.prevent
              @click.stop="clear"
            ></i>
            <i
              v-if="showPwdVisible"
              class="el-input__icon el-icon-view el-input__clear"
              @click="handlePasswordVisible"
            ></i>
            <span v-if="isWordLimitVisible" class="el-input__count">
              <span class="el-input__count-inner"> {{ textLength }}/{{ upperLimit }} </span>
            </span>
          </span>
          <i class="el-input__icon" v-if="validateState" :class="['el-input__validateIcon', validateIcon]"> </i>
        </span>
        <!-- 后置元素 -->
        <div class="el-input-group__append" v-if="$slots.append">
          <slot name="append"></slot>
        </div>
      </template>
      <textarea
        v-else
        :tabindex="tabindex"
        class="el-textarea__inner"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        ref="textarea"
        v-bind="$attrs"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :style="textareaStyle"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
        :maxlength="myMaxlength"
      >
      </textarea>
      <span v-if="isWordLimitVisible && type === 'textarea'" class="el-input__count"
        >{{ textLength }}/{{ upperLimit }}</span
      >
    </div>
  </div>
</template>
<script>
import { isEmpty } from '@/utils/validate';
import emitter from '@/element/mixins/emitter';
import Migrating from '@/element/mixins/migrating';
import calcTextareaHeight from './calcTextareaHeight';
import merge from '@/element/utils/merge';
import { isKorean } from '@/element/utils/shared';

// level级别
const LEVELS = ['warning', 'error'];
// level类型
const LEVELTYPE = {
  WARNING: 'warning',
  ERROR: 'error',
};

export default {
  name: 'wgElInput',

  componentName: 'ElInput',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: '',
    },
    elFormItem: {
      default: '',
    },
  },

  data() {
    return {
      timerLength: undefined, // 延时关闭error提醒
      lengthLevel: '', // 文本框警告级别
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false,
    };
  },

  props: {
    // 延时error时间
    timerLengthDelay: {
      type: Number,
      default: 800,
    },
    // 文本框最大长度
    maxlength: [Number],
    // 级别，error：截断字符长度且红字提醒，warning：只是警告提醒不做截断处理
    level: {
      type: String,
      default: '',
    },
    value: [String, Number],
    fixed: [Number, String],
    size: {
      type: String,
      default: 'medium',
    },
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Input]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead.",
          );
        return true;
      },
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    tabindex: String,
    isUpper: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // 只要有level默认不传length
    myMaxlength() {
      return LEVELS.includes(this.level) ? -1 : this.maxlength;
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },
    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close',
      }[this.validateState];
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, { resize: this.resize });
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    nativeInputValue() {
      // 根据isUpper判断是否需要小写转大写
      const val = this.isUpper ? String(this.value).toUpperCase() : String(this.value);
      return this.value === null || this.value === undefined ? '' : val;
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      );
    },
    showPwdVisible() {
      return this.showPassword && !this.inputDisabled && !this.readonly && (!!this.nativeInputValue || this.focused);
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      );
    },
    upperLimit() {
      return this.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }

      return (this.value || '').length;
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit;
    },
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val]);
      }

      if (!this.needCheckLength()) return;
      this.lengthLevel = val && val.length > this.maxlength ? this.level : '';
    },
    lengthLevel(val) {
      this.dispatch('ElFormItem', 'el.form.levelChange', [{ level: val, maxlength: this.maxlength }]);
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue();
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
        this.resizeTextarea();
        this.updateIconOffset();
      });
    },
  },

  methods: {
    // 是否需要验证文本长度
    needCheckLength() {
      // 文本长度验证
      return (
        this.maxlength &&
        LEVELS.includes(this.level) &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      );
    },
    // 粘贴
    async handlePasting(event) {
      const fileDataList = await this.getFile(event.clipboardData);
      if (fileDataList.length !== 0) {
        event.target.value = '';
        this.$emit('input', event.target.value);
        this.$message({
          message: '输入框内不能复制图片！',
          type: 'warning',
        });
        return;
      }
    },
    async getFile(clipboardData) {
      const { items = [] } = clipboardData || {};
      const P_files = Array.prototype.map
        .call(items, (item) => {
          if (item.kind === 'file' && item.type.startsWith('image')) {
            const file = item.getAsFile();
            return file
              ? new Promise((resolve) => {
                  let reader = new FileReader();
                  reader.onload = function (event) {
                    // event.target.result就是图片的Base64地址啦
                    resolve(event.target.result);
                  };
                  reader.readAsDataURL(file);
                })
              : null;
          }
        })
        .filter((p) => p);
      return await Promise.all(P_files);
    },
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    getMigratingConfig() {
      return {
        props: {
          icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.',
        },
        events: {
          click: 'click is removed.',
        },
      };
    },
    handleBlur(event) {
      // if (!isEmpty(this.value)) {
      //   // 格式化小数处理
      //   if (!isNaN(this.value) && (this.fixed || +this.fixed === 0)) {
      //     // this.value = Number(this.value).toFixed(this.fixed); 这种方式违背属性只读原则
      //     const val = Number(this.value).toFixed(this.fixed);
      //     this.$emit("input", val);
      //   } else if (typeof this.value === "string") {
      //     this.$emit("input", this.value.trim());
      //     console.log("***sss handleBlur", this.value);
      //   }
      // }
      this.focused = false;
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
      }
    },
    select() {
      this.getInput().select();
    },
    resizeTextarea() {
      if (this.$isServer) return;
      const { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight,
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionUpdate(event) {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || '';
      this.isComposing = !isKorean(lastCharacter);
    },
    handleCompositionEnd(event) {
      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(event);
      }
    },
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return;

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return;
      if (this.needCheckLength()) {
        const { value } = event.target;
        const flag = this.level === LEVELTYPE.ERROR && value && value.length > this.maxlength;
        const sliceStr = flag ? value.slice(0, this.maxlength) : value;
        this.lengthLevel = flag ? LEVELTYPE.ERROR : '';
        this.$emit('input', sliceStr);
        // 延时关闭error
        if (this.lengthLevel === LEVELTYPE.ERROR) {
          // 防抖处理timer函数
          if (this.timerLength) clearTimeout(this.timerLength);
          this.timerLength = setTimeout(() => {
            this.lengthLevel = '';
          }, this.timerLengthDelay);
        }
      } else {
        this.$emit('input', event.target.value);
      }

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      const formatValue = (val) => {
        if (isEmpty(val)) return '';
        if (!isNaN(val) && (this.fixed || +this.fixed === 0)) {
          const result = Number(val).toFixed(this.fixed);
          this.$emit('input', result);
          return result;
        } else if (typeof val === 'string') {
          const trimStr = val.trim();
          // 有trim效果了再发消息
          if (trimStr !== val) {
            this.$emit('input', trimStr);
            return trimStr;
          }
        }
        return val;
      };
      this.$emit('change', formatValue(event.target.value));
    },
    calcIconOffset(place) {
      let elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || []);
      if (!elList.length) return;
      let el = null;
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend',
      };

      const pendant = pendantMap[place];
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
          this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth
        }px)`;
      } else {
        el.removeAttribute('style');
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix');
      this.calcIconOffset('suffix');
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.focus();
      });
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      );
    },
  },

  created() {
    this.$on('inputSelect', this.select);
  },

  mounted() {
    this.setNativeInputValue();
    this.resizeTextarea();
    this.updateIconOffset();
  },

  updated() {
    this.$nextTick(this.updateIconOffset);
  },
};
</script>
<style lang="less" scoped>
.error-length-level {
  /deep/ .el-input__inner {
    border: 1px solid #f56c6c;
  }
  /deep/ .el-textarea__inner {
    border: 1px solid #f56c6c;
  }
}
.warning-length-level {
  /deep/ .el-input__inner {
    border: 1px solid #fc7420;
  }
  /deep/ .el-textarea__inner {
    border: 1px solid #fc7420;
  }
}
.wg-input-custom {
  display: inline-block;
  width: 100%;
  .paddRight32 {
    padding-right: 32px !important;
  }
  // 去掉input为number下的滚动图标样式
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
