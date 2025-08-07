import wgProDialog from './index.js';
import confirmDialog from './components/confirm.vue';
const messageBox = {};
const confirm = function(content, title, object){
  if (typeof title === 'object') {
    object = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  return new Promise((resolve, reject) => {
    wgProDialog(
        {
        title,
        params:  {content,object},
        callback: (rsp) => {
            resolve(rsp);
        },
        closeCallback: (msg) => {
            reject(msg);
        },
        },
        confirmDialog,
    );
  });
}
messageBox.confirm = confirm;

export default messageBox;
export { confirm };