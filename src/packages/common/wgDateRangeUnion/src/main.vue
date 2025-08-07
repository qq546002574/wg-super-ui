<template>
  <div :class="[newType === 'date' ? 'dateWidth' : 'datetimeWidth']">
    <div class="wg-date-range-new" v-show="!rangeVisible">
      <wg-date-picker
        v-bind="$attrs"
        ref="picker1Ref"
        v-model="value1"
        :type="newType"
        :placeholder="leftPlaceholder"
        @change="picker1Change"
        @blur="picker1Blur"
        @focus="picker1Focus"
      >
      </wg-date-picker>
      <span class="gap">{{ rangeSeparator }}</span>
      <wg-date-picker
        v-bind="$attrs"
        ref="picker2Ref"
        v-model="value2"
        :type="newType"
        :placeholder="rightPlaceholder"
        @change="picker2Change"
        @blur="picker2Blur"
        @focus="picker2Focus"
      >
      </wg-date-picker>
      <wg-icon
        class="primaryColor"
        :name="newType === 'date' ? 'icon-a-rilixuanzeshijian' : 'icon-Union'"
        @click="iconClick"
      ></wg-icon>
    </div>
    <div class="wg-date-range-new" v-show="rangeVisible">
      <wg-date-picker
        ref="dateRangeRef"
        v-model="daterange"
        :type="daterangeType"
        :start-placeholder="leftPlaceholder"
        :end-placeholder="rightPlaceholder"
        :range-separator="rangeSeparator"
        v-bind="$attrs"
        @blur="dateRangeBlur"
        @focus="dateRangeFocus"
        @change="dateRangeChange"
      >
      </wg-date-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: "wgDateRangeUnion",
  props: {
    dateRangeUnion: {
      type: [String, Array],
      default: () => [],
    },
    rangeType: {
      type: String,
      default: "date",
    },
    leftPlaceholder: {
      type: String,
      default: "开始日期",
    },
    rightPlaceholder: {
      type: String,
      default: "结束日期",
    },
    rangeSeparator: {
      type: String,
      default: "至",
    },
  },
  model: {
    prop: "dateRangeUnion",
    event: "dateChange",
  },
  data() {
    return {
      value1: "",
      value2: "",
      rangeVisible: false,
      daterange: [],
      newType: "",
    };
  },
  watch: {
    rangeType: {
      handler(val) {
        this.newType = val;
      },
      immediate: true,
    },
    dateRangeUnion: {
      handler(val, oldVal) {
        this.value1 = "";
        this.value2 = "";
        if (val?.length !== 0) {
          val.forEach((v, i) => {
            this[`value${i + 1}`] = v;
          });
        }
      },
      immediate: true,
    },
  },
  computed: {
    daterangeType() {
      return this.newType === "date" ? "daterange" : "datetimerange";
    },
  },
  methods: {
    picker1Focus(val) {
      this.$emit("leftFocus", val);
    },
    picker2Focus(val) {
      this.$emit("rightFocus", val);
    },
    picker1Blur(val) {
      this.$emit("leftBlur", val);
    },
    picker2Blur(val) {
      this.$emit("rightBlur", val);
    },
    picker1Change(val) {
      this.$emit("dateChange", [val || "", this.value2]);
      this.$emit("leftChange", val);
    },
    picker2Change(val) {
      this.$emit("dateChange", [this.value1, val || ""]);
      this.$emit("rightChange", val);
    },
    iconClick() {
      this.rangeVisible = true;
      this.daterange = [this.value1 || "", this.value2 || ""];
      this.$nextTick(() => {
        this.$refs.dateRangeRef.pickerVisible = true;
      });
    },
    dateRangeBlur() {
      this.rangeVisible = false;
    },
    dateRangeFocus() {
      this.$refs.dateRangeRef.pickerVisible = false;
      this.$nextTick(() => {
        this.rangeVisible = false;
      });
    },
    dateRangeChange(val) {
      this.rangeVisible = false;
      if (val) {
        this.value1 = val[0];
        this.value2 = val[1];
      } else {
        this.value1 = "";
        this.value2 = "";
      }
      this.$emit("dateChange", val);
      this.$emit("change", val);
    },
  },
};
</script>
<style lang="less" scoped>
.dateWidth {
  width: 235px;
}
.datetimeWidth {
  width: 350px;
}
.wg-date-range-new {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid #bfc3c5;
  border-radius: 2px;
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-input__inner {
    padding-right: 8px;
  }
  /deep/ .el-input__suffix svg {
    display: none;
  }
  .primaryColor {
    width: 90px;
    &:hover {
      cursor: pointer;
    }
  }
  .gap {
    padding-left: 8px;
  }
}
</style>
