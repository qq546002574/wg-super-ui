<script>
import Dialog from '@/element/utils/aria-dialog';
let messageBox;
export default {
  props: {
    width:{
      type:[String],
      default:'360px',
    }
  },
  watch: {
    visible:function(val){
      if(val){
        this.$nextTick(() => {
          this.$refs.confirm.$el.focus();
        });
        this.focusAfterClosed = document.activeElement;
        messageBox = new Dialog(this.$el.childNodes[0], this.focusAfterClosed, this.getFirstFocus());
      }else{
        messageBox.closeDialog(); // 解绑
      }
    }
  },
  data() {
    return {
      loading: false,
      patient: {},
      sys: '',
    };
  },
  mounted(){
  },
  methods: {
    getFirstFocus() {
      const btn = this.$el.querySelector('.el-message-box__btns .el-button');
      const title = this.$el.querySelector('.el-message-box__btns .el-message-box__title');
      return btn || title;
    },
    // TODO：关闭 如果关闭之前需要做一些判断，在这里做，需要同时实现beforeClose
    handleCloseAction() {
      this.closeCallback(false);
      this.visible = false;
      this.customCallback('cancel');
    },
    handleSureAction() {
      this.callback(true);
      this.visible = false;
      this.customCallback('confirm');
      
    },
    customCallback(action){
      const object = this.params?.object || {};
      const funCb = object.callback || function(){};
      funCb(action)
    },
    getIconName(type){
      switch(type){
        case 'warning':
          return 'icon-zhuyi';
        default:
          return 'icon-zhuyi';
      }
    }
  },
  render() {
    const props = {
      ...this.$attrs,
      ...this.$props,
    };
    const on = {
      ...this.$listeners,
    };

    const { visible, loading, reflsh } = this;
    const { handleCloseAction, handleSureAction, doClose } = this;
    const object = this.params?.object || {};
    const type = object?.type || 'warning';
    const iconName = this.getIconName(type);
    return (
      <wg-el-dialog
        tabIndex="-1"
        ref="msgDialog"
        class="noticeDialog"
        {...{ props }}
        {...{ on }}
        alignCenter
        width={this.width}
        visible={visible}
        onClose={handleCloseAction}
      >
        <div slot="title">
           {iconName && (<wg-icon class="mr4" name={iconName}/>)}
            <span domPropsInnerHTML={ this.title || '提示' }></span>
        </div>
        <div class="mb24 content">
          <span domPropsInnerHTML={this.params?.content || '这是一段信息'} />
        </div>
        <span slot="footer" class="dialog-footer">
          <wg-button onClick={handleCloseAction}>
            {object?.cancelButtonText || '取消'}
          </wg-button>
          <wg-button ref="confirm" v-loading={loading} primary onClick={handleSureAction}>
            {object?.confirmButtonText || '确认'}
          </wg-button>
        </span>
      </wg-el-dialog>
    );
  },
};
</script>
<style lang="less" scoped>
.noticeDialog{
  .content{
    margin-left:28px;
    line-height: 26px;
  }
}
</style>