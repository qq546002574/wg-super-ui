<template>
  <wg-date-picker
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dateValue"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    @change="change"
  >
  </wg-date-picker>
</template>
<script>
import { getMenuDateRange } from "@/utils";
export default {
  name: "wgDateRange",
  data() {
    return {
      dateValue: [],
      startTime: null,
      endateime: null,
    };
  },
  created() {
    this.getPathCode();
  },
  methods: {
    change(val) {
      this.$emit("input", val);
    },
    // yyyy-MM-dd HH:mm:ss格式
    dateFormat(date) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1 + "").padStart(2, "0");
      const d = (date.getDate() + "").padStart(2, "0");
      const hh = (date.getHours() + "").padStart(2, "0");
      const mm = (date.getMinutes() + "").padStart(2, "0");
      const ss = (date.getSeconds() + "").padStart(2, "0");
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
    // 计算时间
    initTime(data) {
      const eTime = new Date(data.baseTime);
      eTime.setTime(eTime.getTime() + data.offset * 1000);
      if (data.isEndateime) {
        this.startTime = new Date(data.baseTime);
        this.endateime = eTime;
      } else {
        this.endateime = new Date(data.baseTime);
        this.startTime = eTime;
      }
      this.dateValue = [this.startTime, this.endateime];
      // 抛出yyyy-MM-dd HH:mm:ss格式
      const val = [
        this.dateFormat(this.startTime),
        this.dateFormat(this.endateime),
      ];
      this.$emit("input", val);
    },
    // 获取当前菜单详情
    async getPathCode() {
      const tabInfo = this.$wgFramework.getActiveTabInfo();
      const { data } = await getMenuDateRange({
        pathCode: tabInfo.functionCode,
      });
      this.initTime(data);
    },
  },
};
</script>
