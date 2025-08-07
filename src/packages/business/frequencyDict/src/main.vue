<template>
  <el-popover
    placement="bottom"
    width="360"
    class="wgFrequencyDict"
    popper-class="poperClass"
    trigger="manual"
    v-model="visiblePop"
  >
    <div class="titleDiv">
      <div class="_title">请选择时间</div>
      <div>
        <wg-icon name="icon-guanbi1" class="_icon" @click="closePop"></wg-icon>
      </div>
    </div>
    <div class="timeDiv" v-if="timeType === 'time'">
      <div v-for="index of timeArr.length" :key="index" class="timeLi">
        <onlyTime
          :required="required"
          :timeType="timeType"
          :id="index"
          :time="timeArr[index - 1]"
          @change="selectTime"
        >
        </onlyTime>
      </div>
    </div>
    <div class="timeDiv" v-else>
      <div v-for="index of weekTimeArr.length" :key="index" class="timeLi">
        <timeGrop
          :required="required"
          :id="index"
          :time="weekTimeArr[index - 1]"
          @change="selectWeekTime"
        >
        </timeGrop>
      </div>
    </div>
    <div class="btnDiv">
      <div v-if="+longTemporaryCode === 1" class="flex-1 flex">
        <el-radio-group v-model="freqCtrlVal">
          <el-radio label="1">首日</el-radio>
          <el-radio label="2">每日</el-radio>
        </el-radio-group>
      </div>
      <wg-button primary @click="btnSubmit">确认</wg-button>
    </div>
    <div slot="reference" v-if="frequencyCode === 'once'">
      <wg-date-picker
        v-model="onceDate"
        :clearable="false"
        format="yyyy-MM-dd HH:mm"
        placeholder="执行时间"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        :picker-options="{ disabledDate: disabledDate }"
        @change="onceTimeChange"
      />
    </div>
    <div
      slot="reference"
      v-else
      :class="['frequencyDiv', { 'is-disabled': disabled }]"
      @click="onClick"
    >
      <span>{{ callbackTime }}</span>
      <wg-icon name="icon-bianji1" class="editIcon"></wg-icon>
    </div>
  </el-popover>
</template>
<script>
import { getFrequencyDict } from "@/utils/index";
import onlyTime from "./components/onlyTime";
import timeGrop from "./components/timeGrop";
import dayjs from "dayjs";

export default {
  name: "wgFrequencyDict",
  components: { onlyTime, timeGrop },
  model: {
    prop: "dateValue",
    event: "change",
  },
  props: {
    // 频次code 允许没值
    frequencyCode: "",
    // 缓存数据 使用 :cacheList.sync
    cacheList: {
      type: Array,
      default: () => [],
    },
    // 双向绑定 v-model
    dateValue: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    longTemporaryCode: {
      type: [Number, String],
      default: "",
    },
    freqCtrl: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    // 开医嘱时间
    applyTime: {
      type: String,
      default: "",
    },
    //  once 频次日期
    onceFreqDay: {
      type: String,
      default: "",
    },
    onceMaxDay: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      onceDate: "",
      visiblePop: false,
      list: [],
      current: {},
      timeArr: [],
      weekTimeArr: [],
      callbackTime: "",
      idArr: [],
      timeType: "",
      isDefault: false,
      freqCtrlVal: "",
    };
  },
  watch: {
    applyTime: {
      handler(val) {
        if (!val || +this.longTemporaryCode !== 0) return;
        this.timeArr = val.split(",");
        this.callbackTime = val;
      },
    },
    frequencyCode: {
      handler(v, oldv) {
        if (v) {
          if (v === "once") {
            this.onceDate = `${dayjs(this.onceFreqDay).format("YYYY-MM-DD")} ${
              this.defaultValue
            }`;
            return;
          }
          // 频次没有变化并且有值
          if (this.defaultValue && !this.isDefault) return;
          this.initList().then(() => {
            // 切换frequencyCode时
            if (this.frequencyCode && this.list.length) {
              this.current =
                this.list.find(
                  (item) => item.frequencyCode === this.frequencyCode
                ) || {};
            }
          });
        } else {
          this.current = {};
        }
      },
      immediate: true,
    },
    list: {
      handler(item) {
        if (this.defaultValue && !this.isDefault) return;
        if (this.frequencyCode && item.length !== 0) {
          const data = item.filter(
            (item) => item.frequencyCode === this.frequencyCode
          );
          this.current = data[0];
        }
      },
      immediate: true,
    },
    current: {
      handler(item) {
        this.getActTime().then((d) => {
          const getTime = () => {
            if (
              this.defaultValue?.indexOf(";") > -1 ||
              this.defaultValue?.indexOf(",") > -1
            ) {
              return this.defaultValue;
            }
            if (
              item?.recordTime?.indexOf(";") > -1 ||
              item?.recordTime?.indexOf(",") > -1
            ) {
              return item.recordTime;
            }
            return this.defaultValue || d;
          };
          const df = getTime();
          this.timeArr = df.split(",");
          const isWeekTime = this.timeArr[0].split(";");
          this.isWeekTime(isWeekTime, df);
        });
      },
      immediate: true,
    },
    callbackTime: {
      handler(val) {
        this.$emit("change", this.timeArr.toString());
      },
      immediate: true,
    },
    freqCtrl: {
      handler(val) {
        this.freqCtrlVal = val;
      },
      immediate: true,
    },
  },
  created() {
    if (this.defaultValue) {
      this.callbackTime = this.defaultValue;
      this.timeArr = this.defaultValue.split(",");
      const isWeekTime = this.timeArr[0].split(";");
      this.current.recordTime = this.defaultValue;
      this.isWeekTime(isWeekTime, this.defaultValue);
      this.$nextTick(() => {
        this.isDefault = true;
      });
    } else {
      this.isDefault = true;
    }
  },
  methods: {
    disabledDate(time) {
      return (
        time.getTime() < dayjs(new Date()).add(-1, "day").valueOf() ||
        time.getTime() >
          dayjs(new Date()).add(Number(this.onceMaxDay), "day").valueOf()
      );
    },
    onceTimeChange(val) {
      this.$emit("onceFreqDayChange", val);
    },
    onClick() {
      if (this.disabled) return;
      this.visiblePop = !this.visiblePop;
    },
    daySwitch(num) {
      switch (num) {
        case "1":
          return "一";
        case "2":
          return "二";
        case "3":
          return "三";
        case "4":
          return "四";
        case "5":
          return "五";
        case "6":
          return "六";
        case "7":
          return "七";
      }
    },
    // 有星期的时间，1;08:00转换为一/08:00
    callBackWeekTime() {
      let newTime = [];
      this.weekTimeArr.forEach((item) => {
        newTime.push(this.daySwitch(item[0]) + "/" + item[1]);
      });
      this.callbackTime = newTime.join("; ");
    },
    // 时分秒前补0
    addZero(n) {
      if (n <= 9) {
        return `0${n}`;
      }
      return n;
    },
    // 当频次为St，返回当前时分
    async getActTime() {
      const { timeString } = await this.$act.getCtxTime();
      const date = new Date(timeString);
      return (
        this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes())
      );
    },
    async isWeekTime(arr, defaultTime = "") {
      if (arr.length > 1) {
        this.weekTimeArr = [];
        this.timeArr.forEach((item) => {
          item = item.split(";");
          this.weekTimeArr.push(item);
        });
        this.timeType = "weekTime";
        this.callBackWeekTime();
      } else {
        this.timeType = "time";
        if (this.frequencyCode === "st") {
          this.callbackTime = defaultTime || (await this.getActTime());
        } else {
          this.callbackTime = this.current.recordTime;
        }
      }
    },
    selectTime({ value, id }) {
      this.timeArr[id - 1] = value;
    },
    selectWeekTime({ value, id }) {
      this.weekTimeArr[id - 1] = value;
      this.timeArr[id - 1] = value[0] + ";" + value[1];
    },
    closePop() {
      if (!this.required) {
        this.visiblePop = false;
        return true;
      }
      if (this.timeType === "time") {
        const dataMap = this.timeArr.filter((item) => item);
        if (dataMap.length !== this.timeArr.length) return false;
        this.visiblePop = false;
        return true;
      } else {
        const week = this.weekTimeArr.map((item) => item[0]);
        const weekMap = week.filter((item) => item);
        const time = this.weekTimeArr.map((item) => item[1]);
        const timeMap = time.filter((item) => item);
        if (weekMap.length !== week.length || timeMap.length !== time.length)
          return false;
        this.visiblePop = false;
        return true;
      }
    },
    btnSubmit() {
      const gotoFlag = this.closePop();
      if (!gotoFlag) return;
      if (this.timeType === "time") {
        this.callbackTime = this.timeArr.toString();
      } else {
        this.callBackWeekTime();
      }
      this.$emit("save", {
        freqTimeDescn: this.timeArr.toString(),
        freqCtrl: this.freqCtrlVal,
      });
    },
    async initList() {
      if (this.cacheList.length > 0) {
        this.list = this.cacheList;
        this.$emit("update:cacheList", this.list || []);
        return;
      }
      const { data } = await getFrequencyDict();
      this.list = data || [];
      this.$emit("update:cacheList", data || []);
    },
  },
};
</script>
<style lang="less">
.el-popover.poperClass {
  padding: 0;
}
</style>
>
<style lang="less" scoped>
.wgFrequencyDict {
  .frequencyDiv {
    height: 28px;
    line-height: 28px;
    border: 1px solid #bfc3c5;
    padding: 0 8px;
    cursor: pointer;
    position: relative;
    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 16px;
      display: block;
    }
    .editIcon {
      position: absolute;
      color: #22ace3;
      right: 8px;
      top: 6px;
    }
  }
  .is-disabled {
    color: #ffffff;
    background: #eef0f1;
    border-color: #bfc3c5;
    cursor: not-allowed;
    .editIcon {
      color: #ffffff;
    }
  }
}
.titleDiv {
  display: flex;
  justify-content: space-between;
  padding: 6px 16px;
  ._title {
    font-size: 16px;
    color: #222325;
    letter-spacing: 0;
    font-weight: 500;
  }
  ._icon {
    color: #b8bbbc;
    cursor: pointer;
  }
}
.timeDiv {
  border-top: 1px solid #e5ecef;
  padding-bottom: 24px;
  padding-top: 19px;
  max-height: 161px;
  overflow-y: auto;
  .timeLi {
    padding: 0 37px;
  }
  .timeLi + .timeLi {
    margin-top: 16px;
  }
}
.btnDiv {
  display: flex;
  justify-content: end;
  padding: 16px;
  border-top: 1px solid #e5ecef;
}
/deep/ .el-input__validateIcon {
  display: none;
}
</style>
