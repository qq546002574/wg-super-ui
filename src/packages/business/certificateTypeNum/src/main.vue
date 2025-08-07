<template>
  <div class="wgCertifacateTypeNum">
    <wg-el-input
      :class="['input-with-select', { boderRed: errMsg }]"
      placeholder="请输入证件号码"
      clearable
      v-bind="$attrs"
      v-model="inputVal"
      @blur="onValidate"
      @input="onInput"
      @clear="onClear"
    >
      <wg-code-select
        slot="prepend"
        v-model="selectVal"
        placeholder="请选择证件类型"
        :config="{ code: 'CV02.01.101' }"
        @change="selectChange"
      ></wg-code-select>
    </wg-el-input>
    <div v-if="errMsg" class="el-form-item__error">{{ errMsg }}</div>
  </div>
</template>
<script>
import {
  isTWCard,
  isOfficerCard,
  isCardID,
  isHKCard,
  isDriversLicense,
  isPassPortCard,
  isAccountCard,
} from "@/utils/check";

export default {
  name: "wgCertificateTypeNum",
  data() {
    return {
      inputVal: "",
      selectVal: "",
      errMsg: "",
    };
  },
  props: {
    selectDefault: {
      type: String,
      default: "01",
    },
    inputDefault: [String, Number],
  },
  watch: {
    selectDefault: {
      handler(val) {
        this.selectVal = val;
      },
      immediate: true,
    },
    inputDefault: {
      handler(val) {
        this.inputVal = val;
        // this.onValidate('initType');
      },
      immediate: true,
    },
  },
  methods: {
    renderErr(event) {
      if (this.selectVal === "07" && !isTWCard(this.inputVal)) {
        this.errMsg = "台湾居民来往大陆通行证号码不合规";
      } else if (this.selectVal === "04" && !isOfficerCard(this.inputVal)) {
        //"军官证"
        this.errMsg = "军官证号不合规";
      } else if (this.selectVal === "01" && !isCardID(this.inputVal)) {
        //"母亲身份证","居民身份证"
        this.errMsg = "证件号码不合规";
      } else if (this.selectVal === "06" && !isHKCard(this.inputVal)) {
        //"港澳居民来往内地通行证"
        this.errMsg = "港澳居民来往内地通行证号码不合规";
      } else if (this.selectVal === "05" && !isDriversLicense(this.inputVal)) {
        //"驾驶证"
        this.errMsg = "驾驶证号码不合规";
      } else if (this.selectVal === "03" && !isPassPortCard(this.inputVal)) {
        //"护照"
        this.errMsg = "护照号码不合规";
      } else if (this.selectVal === "02" && !isAccountCard(this.inputVal)) {
        //"居民户口簿"
        this.errMsg = "居民户口簿号码不合规";
      } else {
        this.errMsg = "";
      }
      this.$emit("blur", { event: event, selectType: this.selectVal });
    },
    onValidate(event) {
      this.renderErr(event);
    },
    onInput(val) {
      this.errMsg = val ? "" : "请输入证件号码";
      this.$emit("input", { value: val, selectType: this.selectVal });
    },
    onClear() {
      this.$emit("clear", { value: "", selectType: this.selectVal });
    },
    selectChange() {
      this.inputVal = "";
      this.errMsg = "";
      this.$emit("select", this.selectVal);
    },
  },
};
</script>
<style lang="less" scoped>
.wgCertifacateTypeNum {
  position: relative;
  .input-with-select {
    /deep/ .wg-el-select {
      .el-input {
        width: 150px;
        padding-left: 8px;
      }
      .el-input__suffix {
        right: 13px;
      }
    }
  }
  .boderRed {
    /deep/ .el-input__inner:nth-child(2) {
      border-color: red;
    }
    /deep/ .el-input-group__prepend {
      border-right-color: red;
    }
  }
  .el-form-item__error {
    left: 130px;
  }
}
</style>
