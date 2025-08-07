const defaults = {
    title:'患者支付编码',
    width:'428px',
    type:'boder',
    closeOnClickModal:false,
    closeOnPressEscape:true,
    openBack:()=>{}, // dialog打开的回调
    callback:()=>{}, // 确认回调
    closeCallback:()=>{},// 关闭回到
    labelWidth:'',
    searchs:[
      {
        label: '',
        prop: 'paymentCode',
        tag: 'wg-el-input',
      },
    ],
    formData:{
      paymentCode: '',
    },
    reflsh:true,
    validateOnRuleChange:false,
};

import Vue from 'vue';
import proDialogVue from './index.vue';
import merge from '@/element/utils/merge';
import { isVNode } from '@/element/utils/vdom';

let currentMsg, instance;
let msgQueue = [];
let refactoring = true; // 默认每次关闭dialog的时候都要销毁他，可以通过proDialog指定参数false
let params = {};

const defaultCallback = action => {
  if (currentMsg) {
    let callback = currentMsg.callback;
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        if (instance.showInput) {
          currentMsg.resolve({ value: instance.inputValue, action });
        } else {
          currentMsg.resolve(action);
        }
      } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
        currentMsg.reject(action);
      }
    }
  }
};

const handleClose = (vNode)=>{
  if(vNode.parentNode) vNode.parentNode.removeChild(vNode);
}

const initInstance = (eleCom) => {
  const ProDialogConstructor = Vue.extend(eleCom);

  const dialogContainer = document.createElement('div');
  
  instance = new ProDialogConstructor({
    el: dialogContainer,
    props: {
      visible: Boolean,
      title: String,
      params: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    propsData: {// 向props传递属性
      params,
    },
    watch: {
      visible:function(val){
        if(!val) this.onClose();
      }
    },
    methods:{
      onClose(){
        if(refactoring) {
          handleClose(this.$el);
        }
      },
    },
  });

  instance.callback = defaultCallback;
  
};

const showNextMsg = (eleCom) => {
  if (!instance || refactoring) {
    initInstance(eleCom);
  }

  instance.action = '';

  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();

      let options = currentMsg.options;
      for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }

      let oldCb = instance.callback;
      instance.callback = async (action, instance) => {
        try {
          const result = await oldCb(action, instance);
          console.log(result);
          if (result) {
            showNextMsg(eleCom);
          }
          return result;
        } catch (err) {
          console.log(err);
        }
      };
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message];
        instance.message = null;
      } else {
        delete instance.$slots.default;
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });
      document.body.appendChild(instance.$el);

      Vue.nextTick(() => {
        instance.visible = true;
      });
    }
  }
};

const ProDialog = function(options, eleCom = proDialogVue, refactor = true) {
  refactoring = refactor;
  params  = options?.params || {};
  if (Vue.prototype.$isServer) return;
  const myOp = merge({}, defaults, ProDialog.defaults, options);

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => { 
      msgQueue.push({
        options: myOp,
        resolve: resolve,
        reject: reject
      });

      showNextMsg(eleCom);
    });
  } else {
    msgQueue.push({
      options: myOp,
    });

    showNextMsg(eleCom);
  }
};

ProDialog.setDefaults = defaults => {
  ProDialog.defaults = defaults;
};

ProDialog.close = () => {
  instance.doClose();
  instance.visible = false;
  msgQueue = [];
  currentMsg = null;
};

export default ProDialog;
export { ProDialog };
