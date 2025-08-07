export default {
  data() {
    return {
      fullscreen: false,
      dialog: {
        title: '', // 弹窗标题
        component: null, // 弹窗内嵌组件
        visible: false, // 是否显示
        width: '600px', // 弹窗宽度
        // todo 更多设置
      },
    };
  },
  methods: {
    /**
     * 显示弹窗
     * @param title String 弹窗标题
     * @param component 窗体内容组件
     * @param width 弹窗宽度
     */
    showDialog(title = '', component = null, width = '600px') {
      this.dialog = {
        visible: true,
        component,
        width,
        title,
      };
    },
    /**
     * 关闭弹窗
     */
    hideDialog() {
      this.dialog.visible = false;
    },
    /**
     * 销毁组件
     */
    destroyComponent() {
      this.dialog.component = null;
    },
    /**
     * 弹窗方法 todo 更多配置参数 动态参数处理
     * @param visible <Boolean> 是否显示
     * @param title String 弹窗标题
     * @param component 窗体内容组件
     * @param width 弹窗宽度
     */
    setDialog(visible = false, title = '', component = null, width = '600px') {
      if (visible) {
        this.dialog = { visible, title, component, width };
      } else {
        this.dialog = { ...this.dialog, visible };
        // 动画延迟
        setTimeout(() => {
          this.dialog = { ...this.dialog, component, width, title };
        }, 300);
      }
    },
    /**
     * 弹窗方法 todo 更多配置参数 动态参数处理
     */
    setDialogParams(option) {
      // 默认配置
      const defaultOption = {
        visible: false,
        title: '',
        component: null,
        width: '600px',
      };
      // 合并配置
      let asOption = Object.assign(defaultOption, option);
      if (asOption.visible) {
        // 打开弹出层
        this.dialog = asOption;
      } else {
        // 关闭弹出层
        // 先控制弹出层隐藏动画
        this.dialog = { ...this.dialog, visible: asOption.visible };
        // 动画延迟之后修改其他配置 减少弹出层闪烁
        setTimeout(() => {
          this.dialog = { ...this.dialog, ...asOption };
        }, 300);
      }
    },
    switchFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
  },
};
