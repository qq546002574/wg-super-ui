<template>
  <wg-el-dialog
    :title="title"
    :visible.sync="dialogShow"
    @close="close"
    type="border"
    width="312px"
  >
    <dateTimePanle ref="datePanel" @pick="pick"></dateTimePanle>
    <span slot="footer" class="dialog-footer">
      <wg-button size="large" @click="cancel">取 消</wg-button>
      <wg-button size="large" primary @click="submit">确 定</wg-button>
    </span>
  </wg-el-dialog>
</template>
<script>
import dateTimePanle from "../../date-picker/src/panel/date.vue";
import { formatDate } from "@/element/utils/date-util";
export default {
  name: "wgDateTimeDialog",
  components: { dateTimePanle },
  props: {
    showTime: {
      type: Boolean,
      default: true,
    },
    title: String,
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    }, // 实现v-model
  },
  model: {
    // 实现v-model
    prop: "value",
    event: "changeTime",
  },
  watch: {
    dialogVisible: {
      handler(v) {
        this.dialogShow = v;
        if (v) {
          this.$nextTick(() => {
            this.initDatePanel();
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      dialogShow: false,
      submitTime: "",
    };
  },
  methods: {
    initDatePanel() {
      this.$refs.datePanel.value = new Date(this.value);
      this.$refs.datePanel.showTime = this.showTime;
      this.$refs.datePanel.visible = true;
    },
    close() {
      this.dialogShow = false;
      this.$emit("update:dialogVisible", false);
    },
    submit() {
      this.$emit("save", this.submitTime);
      this.$emit("changeTime", this.submitTime);
      this.close();
    },
    cancel() {
      this.$emit("cancel", this.value);
      this.close();
    },
    // 时分秒前补0
    addZero(n) {
      if (n <= 9) {
        return `0${n}`;
      }
      return n;
    },
    changeDate(date) {
      if (this.showTime) {
        const h = new Date(date).getHours();
        const m = new Date(date).getMinutes();
        const s = new Date(date).getSeconds();
        return (
          formatDate(date) +
          " " +
          this.addZero(h) +
          ":" +
          this.addZero(m) +
          ":" +
          this.addZero(s)
        );
      } else {
        return formatDate(date);
      }
    },
    pick(date) {
      this.submitTime = this.changeDate(date);
      this.$refs.datePanel.value = date;
      this.$refs.datePanel.resetView && this.$refs.datePanel.resetView();
      this.$emit("change", this.submitTime);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-picker-panel__footer {
  display: none;
}
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .wg-picker-panel {
  border-width: 0 !important;
  .el-date-picker__header {
    margin: 5px 0 0 0 !important;
  }
}
/deep/ .el-picker-panel {
  margin: 0 !important;
  box-shadow: none !important;
}
</style>
