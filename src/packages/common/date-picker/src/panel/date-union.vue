<template>
  <div class="date_union">
    <wg-input-number
      btnType="column"
      v-model="hour"
      :disabled="copyReadonly"
      :min="min"
      :max="hourMax"
      @input="inputChange('hour', $event)"
      @focus="inputFocus('hour', $event)"
    >
    </wg-input-number>
    <wg-input-number
      btnType="column"
      :disabled="copyReadonly"
      :min="min"
      :max="max"
      v-model="minutes"
      @input="inputChange('minutes', $event)"
      @focus="inputFocus('minutes', $event)"
    >
    </wg-input-number>
    <wg-input-number
      btnType="column"
      :disabled="copyReadonly"
      :min="min"
      :max="max"
      v-model="seconds"
      @input="inputChange('seconds', $event)"
      @focus="inputFocus('seconds', $event)"
    >
    </wg-input-number>
  </div>
</template>
<script>
import { modifyTime } from "@/element/utils/date-util";

export default {
  props: {
    date: Date,
    right: Boolean,
    defaultValue: String,
    readonly: Boolean,
  },
  data() {
    const hour = this.right ? `23` : `00`;
    const minutes = this.right ? `59` : `00`;
    const seconds = this.right ? `59` : `00`;
    return {
      hourChange: false,
      hour,
      min: `00`,
      hourMax: 23,
      minutes,
      seconds,
      max: 59,
      copyReadonly: false,
    };
  },
  computed: {},
  watch: {
    // date(v) {
    //   if (v) {
    //     this.getTime(v);
    //   }
    // },
    date: {
      handler(v) {
        this.getTime(v);
      },
      immediate: true,
    },
    readonly: {
      handler(v) {
        this.copyReadonly = v;
      },
      immediate: true,
    },
  },
  methods: {
    // 获取时间
    getTime(v) {
      const date = v ? new Date(v) : new Date();
      this.hour = this.addZero(date.getHours());
      this.minutes = this.addZero(date.getMinutes());
      this.seconds = this.addZero(date.getSeconds());
    },
    // 重置时间
    resetTime() {
      this.hour = this.right ? `23` : `00`;
      this.minutes = this.right ? `59` : `00`;
      this.seconds = this.right ? `59` : `00`;
      this.hourChange = false;
    },
    // 时分秒前补0
    addZero(n) {
      if (n <= 9) {
        return `0${n}`;
      }
      return n;
    },
    inputChange(type, val) {
      if (type === "hour") {
        this.hour = this.addZero(val);
        this.$emit("select-time", {
          type: "hour",
          value: modifyTime(new Date(), this.hour, this.minutes, this.seconds),
        });
      } else if (type === "minutes") {
        this.minutes = this.addZero(val);
        this.$emit("select-time", {
          type: "minutes",
          value: modifyTime(new Date(), this.hour, this.minutes, this.seconds),
        });
      } else {
        this.seconds = this.addZero(val);
        this.$emit("select-time", {
          type: "seconds",
          value: modifyTime(new Date(), this.hour, this.minutes, this.seconds),
        });
      }
      this.hourChange = true;
    },
    inputFocus(type, event) {
      if (this.hourChange || this.hour !== "00") return;
      if (!this.copyReadonly) {
        this.getTime();
      }
      this.$emit("select-time", { type: "hour", value: new Date() });
    },
  },
};
</script>
<style lang="less" scoped>
.date_union {
  display: flex;
  justify-content: space-around;
  .wg-input-number + .wg-input-number {
    margin-left: 16px;
  }
}
</style>
