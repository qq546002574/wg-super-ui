import { Dialog } from "element-ui";
import { isEmpty } from "@/utils/validate";
import DialogX from "@/utils/aria-dialog";
let messageBox;
export default {
  extends: Dialog,
  name: "wgElDialog",
  props: {
    noHeader: {
      type: Boolean,
      default: false,
    },
    noDisable: Boolean,
    type: String,
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: "8vh",
    },
    // dialog开启高度限制最大为屏幕高度
    maxFullHeight: {
      type: Boolean,
      default: false,
    },
    alignCenter: Boolean,
    iconName: String,
    onlyFoucsDialog: {
      type: Boolean,
      default: false,
    },
    // 弹窗出现位置 top-end左上 top-start右上 bottom-start左下 bottom-end右下
    placement: {
      type: String,
      default: "",
    },
  },
  destroyed() {
    this.closeModel();
    setTimeout(this.closeModel, 100);
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        if (!this.$wgFramework) return;
        if (val) {
          if (this.onlyFoucsDialog) {
            this.focusAfterClosed = document.activeElement;
            if (!isEmpty(messageBox)) messageBox.closeDialog(); // 解绑
            if (this.$el) {
              messageBox = new DialogX(
                this.$el.childNodes[0],
                this.focusAfterClosed,
                this.getFirstFocus()
              );
            } else {
              this.$nextTick(() => {
                messageBox = new DialogX(
                  this.$el.childNodes[0],
                  this.focusAfterClosed,
                  this.getFirstFocus()
                );
              });
            }
          }
          return this.$wgFramework.disabled(true);
        }
        if (!isEmpty(oldVal)) {
          this.closeModel();
          setTimeout(this.closeModel, 100);
        }
      },
      immediate: true,
    },
  },
  computed: {
    placementStyle() {
      if (this.placement === "top-end") {
        return {
          position: "absolute",
          right: "15px",
          top: "15px",
          "margin-top": "0px",
        };
      } else if (this.placement === "top-start") {
        return {
          position: "absolute",
          left: "15px",
          top: "15px",
          "margin-top": "0px",
        };
      } else if (this.placement === "bottom-start") {
        return {
          position: "absolute",
          left: "15px",
          bottom: "-15px",
        };
      } else if (this.placement === "bottom-end") {
        return {
          position: "absolute",
          right: "15px",
          bottom: "-15px",
        };
      } else {
        return "";
      }
    },
  },
  methods: {
    isClose() {
      this.$nextTick(() => {
        // 判断是否有menu弹窗，如果有则一起关闭
        try {
        const $el = document.getElementsByClassName("el-select-dropdown");
        if ($el && $el.length > 0) {
          for (let i = 0; i < $el.length; i++) {
            const ele = $el[i];
            ele.style.display = "none";
          }
        }
        this.handleClose()
        // this.$emit("update:visible", false);
        // 调用继承的方法
      } catch (error) {
        console.log(error);
        this.handleClose()

      }
      });
    },
    fDisabled() {
      if (this.noDisable) return;
      this.$wgFramework.disabled(false);
    },
    getFirstFocus() {
      // if (!this.onlyFoucsDialog) return;
      const docx = this.$el || document;
      // const btn = docx.querySelector('.wg-el-dialog__wrapper .el-button');
      const title = docx.querySelector(
        ".wg-el-dialog__wrapper .el-dialog__footer .wg-button.is-primary"
      );
      return title; //btn || title;
    },
    closeModel(setT = true) {
      if (!isEmpty(messageBox) && this.onlyFoucsDialog)
        messageBox.closeDialog(); // 解绑
      const $el = document.getElementsByClassName("wg-el-dialog__wrapper");

      let bool = true;
      for (let i = 0; i < $el.length; i++) {
        const ele = $el[i];
        let style = ele.getAttribute("style");
        if (!style?.includes("display") && !style?.includes("none")) {
          bool = false;
        }
      }
      if (bool) return this.fDisabled();
      const $el2 = document.getElementsByClassName("v-modal"); // 上一个判断不不保险，使用蒙层判断来保底
      if (isEmpty($el2) || $el2.length === 0) this.fDisabled();
      const $el3 = document.getElementsByClassName("v-modal-leave");
      if ($el3 && setT) {
        setTimeout(() => {
          this.closeModel(false);
        }, 100);
      }
      // } this.fDisabled();
    },
  },
};
