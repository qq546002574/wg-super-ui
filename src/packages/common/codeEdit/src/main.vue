<template>
  <div class="code-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

import 'codemirror/mode/javascript/javascript'; // mode js
import 'codemirror/mode/sql/sql'; // mode sql
import 'codemirror/mode/xml/xml'; // mode xml
import 'codemirror/mode/htmlmixed/htmlmixed'; // mode html
import 'codemirror/mode/css/css'; // mode css
// 主题
import 'codemirror/theme/neo.css';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag'; // 自动补全对应的标签
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
// 自动补全
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/css-hint.js'

export default {
  name: 'wgCodeEdit',
  components: {},
  props: {
    mode: {
      type: String,
      default: 'application/json',
    },
    jsonCode: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: true,
    },
    lineNumbers: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      codeEditor: '',
    };
  },
  watch: {
    jsonCode(newVal) {
      const editorValue = this.codeEditor.getValue();
      if (newVal !== editorValue) {
        this.codeEditor.setValue(this.jsonCode);
        setTimeout(() => {
          this.codeEditor.refresh();
        }, 1);
      }
    },
    immediate: true,
    deep: true,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: this.mode,
        theme: 'neo', // 主题样式
        lint: true,
        tabSize: 4,
        lineNumbers: this.lineNumbers, // 显示行号
        readOnly: this.readonly, // 只读
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true, // 当前行高亮
        lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        autoCloseBrackets: true, // 输入和退格时成对
        autoCloseTags: true, // 自动补全对应的标签
        extraKeys: {"Tab": "autocomplete"}, //
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      });
      this.codeEditor.on("keypress", () =>{
        // 自动补全
        this.codeEditor.showHint();
      });
      this.codeEditor.setValue(this.jsonCode);
      this.codeEditor.on('change', (cm) => {
        this.$emit('change', cm.getValue());
      });
    },
    // 刷新编辑器
    refresh() {
      this.codeEditor && this.codeEditor.refresh();
    },
  },
};
</script>

<style lang="less" scoped>
.code-editor {
  height: 100%;
  position: relative;
  /deep/ .CodeMirror {
    height: auto;
  }
  // .cm-s-neo
  /deep/ .CodeMirror-cursor {
    width: 2px;
  }
}
</style>
<style lang="less">
.CodeMirror-hints{
  z-index: 9999!important;
}
</style>
