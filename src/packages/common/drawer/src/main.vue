<template>
  <transition
    name="el-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      class="el-drawer__wrapper wg-drawer-container"
      tabindex="-1"
      v-show="visible"
    >
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          :aria-label="title"
          class="el-drawer"
          :class="[direction, customClass]"
          :style="
            isHorizontal ? `width: ${drawerSize}` : `height: ${drawerSize}`
          "
          ref="drawer"
          role="dialog"
          tabindex="-1"
        >
          <header class="wg-header" v-if="withHeader">
            <wg-title
              ><span>{{ title }}</span></wg-title
            >
            <button
              :aria-label="`close ${title || 'drawer'}`"
              class="el-drawer__close-btn"
              type="button"
              v-if="showClose"
              @click="closeDrawer"
            >
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </header>
          <section class="el-drawer__body" v-if="rendered">
            <slot></slot>
          </section>
          <section class="wg-footer" v-if="withFooter && isRightToLeft">
            <wg-button primary @click="confirm">确定</wg-button>
            <wg-button @click="cancel">取消</wg-button>
          </section>
          <section class="wg-footer ltr" v-if="withFooter && isLeftToRight">
            <wg-button @click="cancel">取消</wg-button>
            <wg-button primary @click="confirm">确定</wg-button>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from "@/element/utils/popup";
import emitter from "@/element/mixins/emitter";

export default {
  name: "wgDrawer",
  mixins: [Popup, emitter],
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
    },
    customClass: {
      type: String,
      default: "",
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: "rtl",
      validator(val) {
        return ["ltr", "rtl", "ttb", "btt"].indexOf(val) !== -1;
      },
    },
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    size: {
      type: [Number, String],
      default: "40%",
    },
    title: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
    },
    wrapperClosable: {
      type: Boolean,
      default: true,
    },
    withHeader: {
      type: Boolean,
      default: true,
    },
    withFooter: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isHorizontal() {
      return this.direction === "rtl" || this.direction === "ltr";
    },
    isRightToLeft() {
      return this.direction === "rtl";
    },
    isLeftToRight() {
      return this.direction === "ltr";
    },
    drawerSize() {
      return typeof this.size === "number" ? `${this.size}px` : this.size;
    },
  },
  data() {
    return {
      closed: false,
      prevActiveElement: null,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit("open");
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
        this.prevActiveElement = document.activeElement;
      } else {
        if (!this.closed) {
          this.$emit("close");
          if (this.destroyOnClose === true) {
            this.rendered = false;
          }
        }
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus();
          }
        });
      }
    },
  },
  methods: {
    afterEnter() {
      this.$emit("opened");
    },
    afterLeave() {
      this.$emit("closed");
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit("update:visible", false);
        this.$emit("close");
        if (this.destroyOnClose === true) {
          this.rendered = false;
        }
        this.closed = true;
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer();
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    handleClose() {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      this.closeDrawer();
    },
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
};
</script>
<style lang="less" scoped>
.wg-drawer-container {
  .el-drawer__container {
    .el-drawer {
      .wg-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 5px 5px 10px;
        border-bottom: 1px solid #e5ecef;
        .el-drawer__close-btn {
          font-size: 14px;
        }
      }
      .wg-footer {
        padding: 8px 5px 10px 10px;
      }
      .ltr {
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>
