<template>
  <div class="wg-input-number">
    <div :class="['iconDiv', 'left', {'is-disabled' : disabled}]" v-if="btnType !== 'column'" @click="onDown">
      <wg-icon name="icon-a-bianzu62" :class="['icon-level', {'is-disabled' : disabled}]"></wg-icon>
    </div>
    <wg-el-input
      :class="['inputNumber', btnType  === 'column' ? 'width80' : 'width56']"
      type="number" 
      :value="inputValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      v-bind="$attrs"
      v-on="$listeners"
      @input="myInput"
      @blur="myBlur"
      @wheel="wheelChange($event)">
    </wg-el-input>
    <div :class="['iconDiv', 'right', {'is-disabled' : disabled}]" v-if="btnType !== 'column'"  @click="onUp">
      <wg-icon name="icon-a-bianzu61" :class="['icon-level', {'is-disabled' : disabled}]"></wg-icon>
    </div>
    <div :class="['hoverNum', {'is-disabled' : disabled}]" v-if="btnType === 'column'">
      <wg-icon name="icon-shangjiantou" :class="['hoverNumIcon', {'is-disabled' : disabled}]" @click="onUp"></wg-icon>
      <div class="line"></div>
      <wg-icon name="icon-xiajiantou" :class="['hoverNumIcon', {'is-disabled' : disabled}]" @click="onDown"></wg-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wgInputNumber',
  props: {
    value: [Number, String],
    min: [Number, String],
    max: [Number, String],
    fixed:[Number, String],
    btnType: String,
    disabled: Boolean,
  },
  model: {
    prop: 'value',
  },
  data() {
    return {
      inputValue: 0,
    }
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        this.inputValue = val;
      },
      immediate: true,
    },
  },
  methods: {
    myInput(v) {
      let val = v;
      this.$nextTick(()=>{
        if (!val) {
          val = this.min;
        }
        if(val < this.min){
          val = this.min;
        }else if(val > this.max){
          val = this.max;
        }
        this.inputValue = val;
        this.$emit('input', this.inputValue);
      })
    },
    myBlur(){
      if(this.fixed || +this.fixed === 0 && this.inputValue) {
        this.inputValue = Number(this.inputValue).toFixed(this.fixed);
        this.$emit('input', this.inputValue);
      }
    },
    // 鼠标滚动事件
    wheelChange(e) {
      if (e.deltaY < 0 ) {
        if (e.target.value > e.target.max) {
          e.target.value = this.hourMax;
        }
      } else {
        if (e.target.value < e.target.min) {
          e.target.value = 0;
        }
      }
      this.$emit('wheel', e);
    },
    onUp() {
      if (this.disabled) return;
      if (this.inputValue >= this.max) {
        this.inputValue = this.max;
      } else {
        this.inputValue ++;
      }
      this.$emit('input', this.inputValue);
    },
    onDown() {
      if (this.disabled) return;
      if (this.inputValue <= this.min) {
        this.inputValue = this.min;
      } else {
        this.inputValue --;
      }
      this.$emit('input', this.inputValue);
    },
  }
}
</script>
<style lang="less" scoped>
.wg-input-number{
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  .is-disabled {
    cursor: not-allowed;
  }
  .iconDiv {
    width: 28px;
    height: 28px;
    background: #F8F9FA;
    border: 1px solid #C0C4CC;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-level {
      // width: 10px;
      color: #505356;
      &:hover {
        cursor: pointer;
        color: #202122;
      }
    }
  }
  .left {
    margin-right: 4px;
  }
  .right {
    margin-left: 4px;
  }
  .inputNumber.width80 {
    // width: 80px;
    /deep/ .el-input__inner {
      padding-left: 25px!important;
    }
  }
  .inputNumber.width56 {
    // width: 56px;
    /deep/ .el-input__inner {
      text-align: center;
    }
  }
  // 去掉input为number下的滚动图标样式
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  // 自定义滚动数字图标样式
  .hoverNum {
    position: absolute;
    z-index: 2;
    // left: 62px;
    // left: calc(100% - 18px);
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 27px;
    bottom: 1px;
    width: 17px;
    border-left: 1px solid #C0C4CC;
    .line {
      width: 100%;
      height: 1px;
      background-color: #C0C4CC;
    }
    .hoverNumIcon {
      width: 8px;
      height: 6px;
      color: #bfc3c5;
      &:hover{
        cursor: pointer;
        color: #959899;
      }
    }
  }
}
</style>