<script>
// import { hex_md5 } from '@common';
// import { userMngApi } from '@/api/index';
// let messageBox;
import renderTagMin from '@/mixin/renderTagMixin.js';

// 引入动图
const readingSrc = require('@/static/assets/images/gif/reading.gif');
const sccuessEndSrc = require('@/static/assets/images/gif/sccuessEnd.gif');
// 引入定格图
const sccuessStop = require('@/static/assets/images/gif/sccuessStop.png');

export default {
  mixins: [renderTagMin],
  props: {
    visible: Boolean,
    title: String,
    type: {
      type: String,
      default: 'boder',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    width: [Number, String],
    openBack: Function, // dialog打开的回调
    callback: Function, // 确认回调
    closeCallback: Function, // 关闭回到
    labelWidth: {
      type: [Number, String],
      default: '',
    },
    searchs: {
      type: Array,
      default: () => [],
    },
    reflsh: {
      type: Boolean,
      default: true,
    },
    validateOnRuleChange: {
      type: Boolean,
      default: false,
    },
    isRefund: Boolean, // 是否退款
    formData: {
      // 回写的formData
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.closeOnHashChange) {
        window.addEventListener('hashchange', this.close);
      }
    });
  },

  beforeDestroy() {
    // console.log('销毁');
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close);
    }
  },
  data() {
    return {
      loading: false,
      loadingSucess: false,
      iconSrc: readingSrc,
    };
  },
  watch: {
    visible: {
      handler(v) {
        if (this.reflsh && v) {
          this.value = {
            paymentCode: '',
          };
        }

        if (this.openBack && v) {
          this.$nextTick(() => {
            this.openBack(this);
            // 获取焦点
            this.$refs['scanCodeBody'].getElementsByClassName('el-input__inner')[0].focus();
          });
        }
      },
      immediate: true,
    },
    value: {
      handler(v) {
        // console.log('value值发生变化',v)
        if (this.searchs.length > 0 && v[this.searchs[0].prop]) {
          this.iconSrc = sccuessEndSrc;
          this.loadingSucess = true;
          setTimeout(() => {
            this.loadingSucess = false;
            // 因为有延时所以要规避一下
            if (!v[this.searchs[0].prop]) {
              this.iconSrc = readingSrc;
            } else {
              // 定格图片
              this.iconSrc = sccuessStop;
            }
          }, 1500);
        } else {
          this.loadingSucess = false;
          this.iconSrc = readingSrc;
        }
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler(v) {
        this.value = this.getValue();
      },
    },
  },
  methods: {
    // TODO：关闭 如果关闭之前需要做一些判断，在这里做，需要同时实现beforeClose
    handleCloseAction() {
      this.action = 'close';
      this.doClose();
    },
    async handleSureAction() {
      if(this.loading) return;
      if (this.validate(this.value[this.searchs[0].prop])) {
        this.loading = true;
        console.log('callback', this.callback);
        try {
          const res =  await this.callback(this.value);
          console.log(res)
          if(res) this.visible = false;
        } finally {
          this.loading = false;
        }
      } else {
        this.$message.warning('当前二维码不是医保电子凭证，请核实！');
        return false;
      }
    },
    validate(value){
      if(!value) return false;
      // 医保电子凭证格式
      return value.length === 28 && !isNaN(Number(value,10))
    },
    doClose() {
      if (!this.visible) return;
      this.action === 'sure' ? this.callback() : this.closeCallback();
      this.visible = false;
    },
    handleKeyUp(e) {
      console.log(e);
      if (e.keyCode === 13) {
        this.handleSureAction();
      }
    },
    renderBodyDialog() {
      const { searchs } = this;
      if (!searchs.length) {
        return;
      }
      return (
        <div class="scanCodeBody" ref="scanCodeBody">
          <div class="scanCodeBody__icon">
            <img class={this.iconSrc == sccuessStop ? 'sccuessStop' : ''} src={this.iconSrc} alt=""></img>
          </div>
          <div class="scanCodeBody__txt">{this.value[searchs[0].prop] ? '扫码完成' : '等待扫码...'}</div>
          <div class="scanCodeBody__codeBox">
            <div class="scanCodeBody__codeBox__val">
              <wg-el-input
                class="scanCodeInput"
                v-model={this.value[searchs[0].prop]}
                nativeOnKeyup={this.handleKeyUp}
              ></wg-el-input>
            </div>
          </div>
        </div>
      );
    },
  },

  render() {
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };

    const { visible, loading, searchs, className } = this;
    const { handleCloseAction, handleSureAction } = this;

    if (this.isRefund) {
      props.title = '患者退款编码';
      props.closeOnPressEscape = false;
      props.showClose = false;
    }

    if (searchs.length > 0) {
      return (
        <wg-el-dialog {...{ props }} {...{ on }} visible={visible} onClose={handleCloseAction} class={className}>
          <div class="proDialog mb12">{this.renderBodyDialog()}</div>
          <span slot="footer" class="dialog-footer">
            {!this.isRefund && <wg-button onClick={handleCloseAction}>取消</wg-button>}
            <wg-button loading={loading} primary onClick={handleSureAction} disabled={!this.value[searchs[0].prop]}>
              确认
            </wg-button>
          </span>
        </wg-el-dialog>
      );
    }
  },
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
