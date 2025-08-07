<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      tabindex="-1"
      v-show="visible"
      :class="[
        'wg-el-dialog__wrapper',
        'el-dialog__wrapper wg-dialog',
        alignCenter && 'wg-dialog-center',
        maxFullHeight && 'wg-dialog-max-full-height',
      ]"
      @click.self="handleWrapperClick"
    >
      <div
        v-draggable
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog',
          { 'is-border': type },
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass,
        ]"
        ref="dialog"
        :style="!alignCenter && placementStyle ? placementStyle : style"
      >
        <div class="el-dialog__header" v-if="!noHeader">
          <slot name="title">
            <wg-icon v-if="iconName" :name="iconName"></wg-icon>
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            :style="
              !alignCenter && placementStyle
                ? { position: 'fixed', top: '24px', right: '28px' }
                : ''
            "
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script src="./dialog.js"></script>
<style lang="less" scoped>
@import "./dialog.less";
</style>
