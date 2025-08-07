<template>
  <quill-editor
    ref="myQuillEditor"
    v-model="editorVal"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
    :class="{ 'editor-disabled': disabled }"
  />
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';
import * as Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

// 定义附件 Blot
const AttachmentBlot = Quill.import('blots/embed');

class CustomAttachmentBlot extends AttachmentBlot {
  static blotName = 'attachment';
  static tagName = 'a';
  static className = 'attachment';

  static create(value) {
    const node = super.create();
    node.setAttribute('href', value.url);
    node.setAttribute('target', '_blank');
    node.setAttribute('download', value.name);
    node.setAttribute('data-size', value.size);
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-url', value.url);
    node.setAttribute('rel', 'noopener noreferrer');
    node.textContent = value.name;
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('href'),
      name: node.getAttribute('download'),
      size: node.getAttribute('data-size')
    };
  }
}

// 注册 Blot
Quill.register(CustomAttachmentBlot);

export default {
  name: 'wgEditor',
  props: {
    defaultModel: String,
    customUpload: Boolean,
    customLink: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    viewMode: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'defaultModel',
    event: 'tagInput',
  },
  components: {
    quillEditor,
  },
  data() {
    const getConfig = () => {
      const config = {};
      if (this.customUpload) {
        config.image = () => {
          if (this.disabled) return;
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('id', 'file-input');
          input.setAttribute('accept', 'image/*');
          const existingInput = document.getElementById('file-input');
          if (existingInput) {
            existingInput.remove();
          }
          document.body.appendChild(input);
          input.click();

          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              this.$emit('uploadImage', file, (attachmentInfo) => {
                this.addImage(attachmentInfo);
              });
            }
          };
        };
      }
      if (this.customLink) {
        config.link = () => {
          if (this.disabled) return;
          console.log('please add link');
          const url = prompt('请输入链接地址:', 'https://');
          const text = prompt('请输入链接文案内容:');
          if (url) {
            if (this.disabled) return;
            // this.$emit("uploadLink", url, text);
            this.addLink(url, text);
          }
        };
      }
      config.attachment = () => {
        if (this.disabled) return;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('id', 'file-input');
        const existingInput = document.getElementById('file-input');
        if (existingInput) {
          existingInput.remove();
        }
        document.body.appendChild(input);
        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            this.$emit('uploadAttachment', file, (attachmentInfo) => {
              this.insertAttachment(attachmentInfo);
            });
          }
        };
      };
      return config;
    };
    return {
      editorVal: '',
      // editor: null,
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['undo', 'redo'],
              ['bold', 'italic', 'underline', 'strike'], // 字体
              ['blockquote', 'code-block'],
              ['image'],
              [{ header: 1 }, { header: 2 }], // 样式标题
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }], // 下标、上标
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }], // 字体
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'], // 格式清除
              ['link'],
              ['attachment'], // 添加附件按钮
            ],
            handlers: {
              undo(value) {
                this.quill.history.undo();
              },
              redo(value) {
                this.quill.history.redo();
              },
              ...getConfig(),
            },
          },
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
            },
            modules: ['Resize', 'DisplaySize'],
          },
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true,
          },
        },
        placeholder: !this.disabled ? '请输入' : '',
      },
    };
  },
  watch: {
    defaultModel: {
      handler(val) {
        if (this.normalizeContent(val) !== this.normalizeContent(this.editorVal)) {
          this.editorVal = val;
        }
      },
      immediate: true,
    },
    editorVal: {
      handler(val) {
        if (this.normalizeContent(val) !== this.normalizeContent(this.defaultModel)) {
          this.$emit('tagInput', val);
        }
      },
      immediate: true,
    },
    disabled: {
      handler(val) {
        this.$nextTick(() => {
          if (this.editor) {
            this.editor.enable(!val);
          }
        });
      },
      immediate: true,
    },
    viewMode: {
      handler(val) {
        this.$nextTick(() => {
          if (this.editor) {
            this.editor.enable(!val);
          }
          if (val) {
            // 禁用状态隐藏工具栏
            const toolbar = this.editor?.theme.modules.toolbar;
            if (toolbar && toolbar.container) {
              toolbar.container.style.display = 'none';
            }
            if (this.editor) {
              this.editor.root.dataset.placeholder = '';
            }
          } else {
            // 启用状态显示工具栏
            const toolbar = this.editor?.theme.modules.toolbar;
            if (toolbar && toolbar.container) {
              toolbar.container.style.display = 'block';
            }
            if (this.editor) {
              this.editor.root.dataset.placeholder = '请输入';
            }
          }
        });
      },
      immediate: true,
    },
    myQuillEditor: {
      handler(val) {
        if (val) {
          this.editor = val.quill;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    // console.log('this is current quill instance object', this.editor);
    this.editor.root.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    this.editor.root.removeEventListener('paste', this.handlePaste);
  },
  methods: {
    addLink(url, text) {
      const { editor } = this;
      const range = editor.getSelection(true);

      // 如果提供了文本,则先插入文本
      if (text) {
        editor.insertText(range.index, text);
        // 选中插入的文本
        editor.setSelection(range.index, text.length);
      }

      // 为选中内容添加链接格式
      editor.format('link', url);
    },
    addImage(src) {
      const { editor } = this;
      const range = editor.getSelection(true);
      // 只插入图片，不设置对齐方式
      editor.insertEmbed(range.index, 'image', src, Quill.sources.USER);
    },
    onEditorBlur(quill) {
      this.$emit('editorBlur', quill);
    },
    onEditorFocus(quill) {
      this.$emit('editorFocus', quill);
    },
    onEditorReady(quill) {
      this.editor.enable(!this.viewMode || !this.disabled); // 预览模式不能编辑
      this.$emit('editorReady', quill);
    },
    onEditorChange({ html, text, quill }) {
      if (this.normalizeContent(html) !== this.normalizeContent(this.defaultModel)) {
        this.$emit('editorChange', { html, text, quill });
      }
    },
    normalizeContent(html) {
      if (!html) return '';
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.innerHTML;
    },
    handlePaste(e) {
      const { clipboardData } = e;
      if (!clipboardData) return;

      // 获取粘贴的图片文件
      const { items } = clipboardData;
      let file = null;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }

      if (file) {
        e.preventDefault(); // 阻止默认粘贴行为

        // 触发自定义上传事件
        this.$emit('pasteImage', file, (imageUrl) => {
          // 上传完成后的回调,插入图片
          this.addImage(imageUrl);
        });
      }
    },
    insertAttachment(attachmentInfo) {
      const { name, url, size } = attachmentInfo;
      const { editor } = this;
      const range = editor.getSelection(true);

      // 使用 insertEmbed 插入附件
      editor.insertEmbed(range.index, 'attachment', {
        url,
        name,
        size
      }, Quill.sources.USER);

      // 插入换行
      editor.insertText(range.index + 1, '\n');
      editor.setSelection(range.index + 2, 0);
    },
  },
};
</script>
<style lang="less" scoped>
/* 自定义 .ql-tooltip 之前的文字内容 */
/deep/ .ql-snow .ql-tooltip::before {
  content: '访问链接：';
}

/deep/ .ql-snow .ql-tooltip a.ql-action:after {
  content: '编辑链接';
}

/deep/ .ql-snow .ql-tooltip a.ql-remove:before {
  content: '移除链接';
}

/deep/ .ql-snow .ql-tooltip[data-mode='link']:before {
  content: '输入链接';
}

/deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action:after {
  content: '保存';
}

/deep/ .editor-disabled {
  .ql-toolbar,
  .ql-container {
    border-color: #e4e7ed !important;
    background-color: #f5f7fa;
    cursor: not-allowed;
  }

  .ql-toolbar {
    .ql-picker,
    button {
      pointer-events: none;
      opacity: 0.6;
    }
  }

  .ql-editor {
    color: #909399;
    cursor: not-allowed;

    &::before {
      // placeholder颜色
      color: #c0c4cc !important;
    }
  }
}

/deep/ .ql-attachment {
  &:after {
    content: '📎';
  }
}

/deep/ .attachment {
  display: inline-block;
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 4px 0;
  color: #666;
  text-decoration: none;

  &:hover {
    background: #e8e8e8;
  }

  &:before {
    content: '📎';
    margin-right: 4px;
  }
}

/deep/ .ql-undo,
/deep/ .ql-redo {
  position: relative;

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 26px;
  }
}

/deep/ .ql-undo:after {
  content: '↶'; // 撤销图标
}

/deep/ .ql-redo:after {
  content: '↷'; // 恢复图标
}

/deep/ .ql-tooltip {
  z-index: 9999 !important; // 提高链接弹出框的层级
  
  &.ql-editing {
    z-index: 9999 !important;
  }
}

// 确保链接弹出框在编辑器内部正确显示
/deep/ .ql-container {
  position: relative;
  
  .ql-tooltip {
    position: absolute;
    left: 0 !important;
    top: 0 !important;
    transform: translateY(-100%);
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 5px 12px;
  }
}
</style>
