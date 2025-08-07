<template>
  <div
    class="el-select wg-el-select"
    :class="[selectSize ? 'el-select--' + selectSize : '', { isFixHeight: isFixHeight }]"
    @click="toggleMenu"
    v-clickoutside="handleClose"
  >
    <div
      class="el-select__tags"
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%', overflow: 'auto' }"
    >
      <span v-if="collapseTags && selected.length">
        <el-tag
          :closable="!selectDisabled && clearable"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          type="info"
          @close="deleteTag($event, selected[0])"
          disable-transitions
        >
          <span class="el-select__tags-text">{{ selected[0].currentLabel }}</span>
        </el-tag>
        <el-tag v-if="selected.length > 1" :closable="false" :size="collapseTagSize" type="info" disable-transitions>
          <template v-if="selected.findIndex((c) => c.currentLabel === allCode) === -1">
            <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
          </template>
          <template v-else>
            <span class="el-select__tags-text">+ {{ selected.length - 2 }}</span>
          </template>
        </el-tag>
      </span>
      <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
        <template v-for="item in selected">
          <el-tag
            :key="getValueKey(item)"
            v-if="item.currentLabel !== allCode"
            :closable="!selectDisabled"
            :size="collapseTagSize"
            :hit="item.hitState"
            type="info"
            @close="deleteTag($event, item)"
            disable-transitions
          >
            <span class="el-select__tags-text">{{ item.currentLabel }}</span>
          </el-tag>
        </template>
      </transition-group>

      <input
        type="text"
        class="el-select__input"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :autocomplete="autoComplete || autocomplete"
        @focus="handleFocus"
        @blur="softFocus = false"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        v-model="query"
        @input="debouncedQueryChange"
        v-if="filterable"
        :maxlength="maxlength"
        :style="{ 'flex-grow': '1', width: inputLength / (inputWidth - 32) + '%', 'max-width': inputWidth - 42 + 'px' }"
        ref="input"
      />
    </div>
    <wg-el-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :autocomplete="autoComplete || autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : null"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"></i>
        <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close" @click="handleClearClick"></i>
      </template>
    </wg-el-input>
    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <el-select-menu ref="popper" :append-to-body="popperAppendToBody" v-show="visible && emptyText !== false">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading"
        >
          <wg-el-option :value="query" created v-if="showNewOption"> </wg-el-option>
          <wg-el-option v-if="hasSelectAll" :label="allLabelName" :value="allCode"></wg-el-option>

          <slot></slot>
        </el-scrollbar>
        <template v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0))">
          <slot name="empty" v-if="$slots.empty"></slot>
          <p class="el-select-dropdown__empty" v-else>
            {{ emptyText }}
          </p>
        </template>
      </el-select-menu>
    </transition>
  </div>
</template>
<script>
import { Select } from 'element-ui';

export default {
  extends: Select,
  name: 'wgElSelect',
  props: {
    maxlength: {
      type: Number,
    },
    isFixHeight: {
      type: Boolean,
      default: false,
    },
    hasSelectAll: Boolean,
    allCode:{//当开启全选以后，全选的code，即Value。默认是''空字符
      type: [String, Number],
      default: '',
    },
    allLabelName: {
      type: String,
      default: '全选'
    },
    clearable: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      paramsls : ['Checked', 'created', 'currentLabel', 'currentValue', 'disabled', 'isObject', 'itemSelected', 'label', 'limitReached', 'value'],
      allCacheOption: [],
    };
  },
  methods: {
    toggleMenu(e) {
      if(window.popUp){
        window.popUp = false;
      }else{
        e.stopPropagation();
      }
      // window.popUp = false;
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false;
        } else {
          // 解决automaticDropdown为true的情况下，下拉会立马关闭的问题
          if (this.automaticDropdown) {
            this.visible = false;
          }
          this.visible = !this.visible;
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus();
        }
      }
    },
    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.firstChild.childNodes; // 新增了一个firstChild，因为input基础组件多包了一层
        let input = [].filter.call(inputChildNodes, (item) => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0;
        const sizeInMap = 28;//this.initialInputHeight || 28;
        if (input) {
          input.style.height =
            this.selected.length === 0
              ? sizeInMap + 'px'
              : Math.max(tags ? tagsHeight + (tagsHeight > sizeInMap ? 6 : 0) : 0, sizeInMap) + 'px';
        }
        if (this.visible && this.emptyText !== false) {
          this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      });
    },
    selectAll() {
      const dataSource = this.$slots.default?.map((c) => {
        if (c.componentOptions.tag === 'wg-el-option') return c;
      });
    },
    deleteTag(event, tag) {
      console.log("测试")
      if(tag.value===this.allCode){
        let value=[]
        this.$emit('input', value);
        this.emitChange(value);
        this.$emit('remove-tag', tag.value);
      }else {
        //对tag做过特殊操作，在渲染tag时判断了，如果有全选，input中不展示全选tag
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.selectDisabled) {
          let value = this.value.slice();
          value.splice(index, 1);

          //删除tag的时候，下拉框中的全选也要去掉
          value = value.filter((c) => c !== this.allCode);
          this.$emit('input', value);
          this.emitChange(value);
          this.$emit('remove-tag', tag.value);
        }
      }
      event.stopPropagation();
    },
    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        let value = (this.value || []).slice();
        const optionIndex = this.getValueIndex(value, option.value);
        const dataSource = this.$slots.default?.map((c) => {
          if (c.componentOptions?.tag === 'wg-el-option') return c;
        });
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value);
        }
        // console.log("valuevaluevalue:",value);
        if (option.value === this.allCode) {
          //如果是全选的时候不做任务操作
          if (!option.itemSelected) {
            //这是全选

            if (value.length > 0) value = [this.allCode];

            const values = dataSource?.map((c) => {
              value.push(c.componentOptions.propsData.value);
              return c.componentOptions.propsData.value;
            });
          } else {
            value = [];
          }
          // console.log('byClick:',byClick);
          // console.log(option);
          // console.log("itemSelected:",option.itemSelected);

          // return;
        } else {
          let index = value.findIndex((c) => c === this.allCode);
          let len = value.length;
          if (index !== -1) {
            len = len - 1;
          }
          if (len === dataSource?.length) {
            if (index === -1) value.push(this.allCode);
          } else {
            if (index !== -1) value.splice(index, 1);
          }
        }

        let index = value.findIndex((c) => c === this.allCode);
        let t = [...value].slice();
        if (index !== -1) t.splice(index, 1);
        // this.$emit('change', t);
        this.$emit('input', value);
        this.emitChange(t);

        if (option.created) {
          this.query = '';
          this.handleQueryChange('');
          this.inputLength = 20;
        }
        if (this.filterable) this.$refs.input.focus();
      } else {
        this.$emit('input', option.value);
        this.emitChange(option.value);
        this.visible = false;
      }

      this.isSilentBlur = byClick;
      this.setSoftFocus();
      if (this.visible) return;
      this.$nextTick(() => {
        this.scrollToOption(option);
      });
    },
        getOption(value) {
      let option;
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]';
      const isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]';

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
          : cachedOption.value === value;
        
        if (isEqual) {
          option = Object.assign({}, cachedOption);
          this.paramsls.forEach((c) => {
            option[c] = cachedOption[c];
          });
          let index = this.allCacheOption.findIndex((c) => c.value === option.value);
          if (index !== -1) {
            this.allCacheOption[index] = option;
          } else {
            this.allCacheOption.push(option);
          }
          break;
        }
      }
      if (option) return option;
      const label = (!isObject && !isNull && !isUndefined)
        ? String(value) : '';
      const cacheIndex = this.allCacheOption.findIndex((c) => c.value === value);
      if (cacheIndex !== -1) {
        option = this.allCacheOption[cacheIndex];
        return option;
      }
      let newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },
  },
};
</script>
<style lang="less" scoped>
@import './select.less';
</style>
