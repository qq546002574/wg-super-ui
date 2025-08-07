<template>
  <wg-el-dialog v-bind="$attrs" v-on="$listeners" class="noticeDialog" @open="dialogOpen" @close="dialogClose">
    <template slot="title">
      <wg-icon v-if="iconName" :name="iconName"></wg-icon>
      <span>{{ $attrs.title || '提示' }}</span>
    </template>
    <slot><span>这是一段信息</span></slot>
    <span slot="footer" class="dialog-footer">
      <slot name="btnOpt">
        <wg-button v-if="cancelBtn" size="large" @click="btnCancel">取消</wg-button>
        <wg-button ref="submitBtn" :autofocus="true" :loading="loading" :disabled="loading" v-if="submitBtn" size="large" primary @click="btnSubmit"
          >确认</wg-button
        >
        <wg-button v-if="deleteBtn" size="large" type="isDelete" @click="btnDelete">删除</wg-button>
      </slot>
    </span>
  </wg-el-dialog>
</template>
<script>
import KeyBoard from 'keyboardjs';
export default {
  name: 'wgNoticeDialog',
  props: {
    iconName: {
      type: String,
      default: 'icon-zhuyi',
    },
    cancelBtn: {
      type: Boolean,
      default: true,
    },
    submitBtn: {
      type: Boolean,
      default: true,
    },
    deleteBtn: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
		enterEvent: {
			type: Boolean,
			default: true
		}
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
		dialogOpen() {
			const _this = this;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.submitBtn.$el.focus();
				}, 100)
			})
			if(this.enterEvent) {
				KeyBoard.watch();
				KeyBoard.bind('enter', function (e) {
				  _this.btnSubmit();
				});
			}
		},
		dialogClose() {
			if(this.enterEvent) {
				KeyBoard.stop();
				KeyBoard.reset();
			}
		},
    btnCancel() {
      this.$emit('btnCancel');
    },
    btnSubmit() {
      this.$emit('btnSubmit');
    },
    btnDelete() {
      this.$emit('btnDelete');
    },
  },
};
</script>
<style lang="less" scoped>
.noticeDialog {
  /deep/ .el-dialog__body {
    padding-bottom: 16px;
  }
}
</style>
