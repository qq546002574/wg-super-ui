<template>
  <div v-if="editor" class="container" @click="handleEditorClick" @dblclick="handleEditorDblclick">
    <div class="control-group">
      <div class="button-group">
        <!-- 撤销/重做按钮 -->
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="readOnly || !editor.can().chain().focus().undo().run()"
          title="撤销"
        >
          <i class="fas fa-undo"></i>
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="readOnly || !editor.can().chain().focus().redo().run()"
          title="重做"
        >
          <i class="fas fa-redo"></i>
        </button>

        <!-- 文本格式化按钮 -->
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="readOnly || !editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          title="加粗"
        >
          <i class="fas fa-bold"></i>
        </button>

        <!-- 修改斜体按钮 -->
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="readOnly || !editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          title="斜体"
        >
          <i class="fas fa-italic"></i>
        </button>

        <!-- 修改删除线按钮 -->
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="readOnly || !editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          title="删除线"
        >
          <i class="fas fa-strikethrough"></i>
        </button>

        <!-- 修改代码按钮 -->
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :disabled="readOnly || !editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
          title="行内代码"
        >
          <i class="fas fa-code"></i>
        </button>

        <!-- 清除格式按钮 -->
        <button 
          :disabled="readOnly"
          @click="editor.chain().focus().unsetAllMarks().run()"
          title="清除格式"
        >
          <i class="fas fa-remove-format"></i>
        </button>

        <!-- 清除节点按钮 -->
        <button 
          :disabled="readOnly"
          @click="editor.chain().focus().clearNodes().run()"
          title="清除样式"
        >
          <i class="fas fa-eraser"></i>
        </button>

        <!-- 段落按钮 -->
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
          title="正文段落"
        >
          <i class="fas fa-paragraph"></i>
        </button>

        <!-- 标题按钮 -->
        <div class="heading-picker">
          <button 
            :disabled="readOnly"
            class="heading-picker-trigger"
            @click="toggleHeadingPicker"
            title="标题级别"
          >
            <i class="fas fa-heading"></i>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div v-if="showHeadingPicker" class="heading-menu">
            <button
              v-for="level in 6"
              :key="level"
              @click="setHeading(level)"
              :class="{ 'is-active': editor.isActive('heading', { level }) }"
              class="heading-item"
              :title="`标题 ${level}`"
            >
              <i class="fas fa-heading"></i>{{ level }}
            </button>
          </div>
        </div>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }"
          title="文字高亮"
        >
          <i class="fas fa-highlighter"></i>
        </button>
          <!-- 色按钮 -->
        <div class="color-picker text-color-picker">
          <button
            class="color-picker-trigger"
            :disabled="readOnly"
            @click="toggleColorPicker"
            title="文字颜色"
          >
            <i class="fas fa-palette"></i>
          </button>
          <div v-if="showColorPicker" class="color-palette">
            <button
              v-for="color in colors"
              :key="color.value"
              class="color-btn"
              :style="{ backgroundColor: color.value }"
              :title="color.label"
              @click="setTextColor(color.value)"
            >
              <i
                v-if="editor.isActive('textStyle', { color: color.value })"
                class="fas fa-check"
              ></i>
            </button>
          </div>
        </div>
        <!-- 超链接按钮 -->
        <button
          :disabled="readOnly"
          @click="insertLink"
          :class="{  'is-active': editor.isActive('link') }"
          title="插入超链接"
        >
          <i class="fas fa-link"></i>
        </button>

        <!-- 对齐按钮 -->
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          title="左对齐"
        >
          <i class="fas fa-align-left"></i>
        </button>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          title="居中对齐"
        >
          <i class="fas fa-align-center"></i>
        </button>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          title="右对齐"
        >
          <i class="fas fa-align-right"></i>
        </button>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          title="两端对齐"
        >
          <i class="fas fa-align-justify"></i>
        </button>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          title="无序列表"
        >
          <i class="fas fa-list-ul"></i>
        </button>
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          title="有序列表"
        >
          <i class="fas fa-list-ol"></i>
        </button>

        <!-- 代码块按钮 -->
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          title="代码块"
        >
          <i class="fas fa-file-code"></i>
        </button>

        <!-- 引用按钮 -->
        <button
          :disabled="readOnly"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          title="引用"
        >
          <i class="fas fa-quote-right"></i>
        </button>

        <!-- 分割线按钮 -->
        <button 
          :disabled="readOnly"
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="分割线"
        >
          <i class="fas fa-minus"></i>
        </button>

        <!-- 换行按钮 -->
        <button 
          :disabled="readOnly"
          @click="editor.chain().focus().setHardBreak().run()"
          title="换行"
        >
          <i class="fas fa-level-down-alt"></i>
        </button>
        <!-- 表格相关按钮 -->
        <div class="table-picker">
          <button 
            :disabled="readOnly"
            @click="toggleTablePicker" 
            title="插入表格"
          >
            <i class="fas fa-table"></i>
          </button>
          <!-- 表格选择器 -->
          <div v-if="showTablePicker" class="table-grid-picker">
            <div class="table-grid">
              <div v-for="row in 10" :key="`row-${row}`" class="table-grid-row">
                <div
                  v-for="col in 10"
                  :key="`${row}-${col}`"
                  class="table-grid-cell"
                  :class="{ hovered: row <= hoveredRows && col <= hoveredCols }"
                  @mouseover="updateHovered(row, col)"
                  @click="insertTableWithSize(row, col)"
                ></div>
              </div>
            </div>
            <div class="table-grid-size">
              {{ hoveredCols }} x {{ hoveredRows }}
            </div>
          </div>
        </div>
        <button
          @click="editor.chain().focus().addColumnBefore().run()"
          :disabled="readOnly || !editor.can().addColumnBefore()"
          title="在左侧插入列"
        >
          <i class="fas fa-plus"></i><i class="fas fa-columns"></i>
        </button>
        <button
          @click="editor.chain().focus().addColumnAfter().run()"
          :disabled="readOnly || !editor.can().addColumnAfter()"
          title="在右侧插入列"
        >
          <i class="fas fa-columns"></i><i class="fas fa-plus"></i>
        </button>
        <button
          @click="editor.chain().focus().deleteColumn().run()"
          :disabled="readOnly || !editor.can().deleteColumn()"
          title="删除列"
        >
          <i class="fas fa-columns"></i><i class="fas fa-times"></i>
        </button>
        <button
          @click="editor.chain().focus().addRowBefore().run()"
          :disabled="readOnly || !editor.can().addRowBefore()"
          title="在上方插入行"
        >
          <i class="fas fa-plus"></i><i class="fas fa-grip-lines"></i>
        </button>
        <button
          @click="editor.chain().focus().addRowAfter().run()"
          :disabled="readOnly || !editor.can().addRowAfter()"
          title="在下方插入行"
        >
          <i class="fas fa-grip-lines"></i><i class="fas fa-plus"></i>
        </button>
        <button
          @click="editor.chain().focus().deleteRow().run()"
          :disabled="readOnly || !editor.can().deleteRow()"
          title="删除行"
        >
          <i class="fas fa-grip-lines"></i><i class="fas fa-times"></i>
        </button>
        <button
          @click="editor.chain().focus().deleteTable().run()"
          :disabled="readOnly || !editor.can().deleteTable()"
          title="删除表格"
        >
          <i class="fas fa-table"></i><i class="fas fa-times"></i>
        </button>
        <button
          @click="editor.chain().focus().mergeCells().run()"
          :disabled="readOnly || !editor.can().mergeCells()"
          title="合并单元格"
        >
          <i class="fas fa-compress-arrows-alt"></i>
        </button>
        <button
          @click="editor.chain().focus().splitCell().run()"
          :disabled="readOnly || !editor.can().splitCell()"
          title="拆分单元格"
        >
          <i class="fas fa-expand-arrows-alt"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleHeaderColumn().run()"
          :disabled="readOnly || !editor.can().toggleHeaderColumn()"
          title="切换表头列"
        >
          <i class="fas fa-columns"></i><i class="fas fa-heading"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleHeaderRow().run()"
          :disabled="readOnly || !editor.can().toggleHeaderRow()"
          title="切换表头行"
        >
          <i class="fas fa-grip-lines"></i><i class="fas fa-heading"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleHeaderCell().run()"
          :disabled="readOnly || !editor.can().toggleHeaderCell()"
          title="切换表头单元格"
        >
          <i class="fas fa-th"></i><i class="fas fa-heading"></i>
        </button>
        <button
          @click="editor.chain().focus().mergeOrSplit().run()"
          :disabled="readOnly || !editor.can().mergeOrSplit()"
          title="合并或拆分单元格"
        >
          <i class="fas fa-object-group"></i>
        </button>
        <!-- 表格背景色调色板 -->
        <div class="color-picker cell-bg-color-picker">
          <button
            :disabled="readOnly"
            class="color-picker-trigger"
            @click="toggleCellBgColorPicker"
            title="单元格背景色"
          >
            <i class="fas fa-fill-drip"></i>
          </button>
          <div v-if="showCellBgColorPicker" class="color-palette">
            <button
              v-for="color in cellBackgroundColors"
              :key="color.value"
              class="color-btn"
              :style="{ backgroundColor: color.value }"
              :title="color.label"
              @click="setCellBackground(color.value)"
            >
              <i
                v-if="
                  editor.isActive('tableCell', { backgroundColor: color.value })
                "
                class="fas fa-check"
              ></i>
            </button>
          </div>
        </div>
        <button
          @click="editor.chain().focus().fixTables().run()"
          :disabled="readOnly || !editor.can().fixTables()"
          title="修复表格"
        >
          <i class="fas fa-wrench"></i>
        </button>
        <button
          @click="editor.chain().focus().goToNextCell().run()"
          :disabled="readOnly || !editor.can().goToNextCell()"
          title="下一个单元格"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
        <button
          @click="editor.chain().focus().goToPreviousCell().run()"
          :disabled="readOnly || !editor.can().goToPreviousCell()"
          title="上一个单元格"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <button 
          :disabled="readOnly"
          @click="addImage" 
          title="插入图片"
        >
          <i class="fas fa-image"></i>
        </button>

        <!-- 在工具栏按钮组中添加流程图按钮 -->
        <button 
          :disabled="readOnly"
          @click="(e) => openDrawioEditor()"
          title="插入流程图"
        >
          <i class="fas fa-project-diagram"></i>
        </button>

        <!-- 添加导出按钮 -->
        <div class="export-picker">
          <button 
            @click="toggleExportOptions" 
            title="导出"
          >
            <i class="fas fa-file-export"></i>
          </button>
          <!-- 导出选项菜单 -->
          <div v-if="showExportOptions" class="export-menu">
            <button
              @click="exportAsHTML"
              class="export-item"
              title="导出为HTML"
            >
              <i class="fas fa-file-code"></i> HTML
            </button>
            <button
              @click="exportAsText"
              class="export-item"
              title="导出为纯文本"
            >
              <i class="fas fa-file-alt"></i> 纯文本
            </button>
            <button
              @click="exportAsPDF"
              class="export-item"
              title="导出为PDF"
            >
              <i class="fas fa-file-pdf"></i> PDF
            </button>
          </div>
        </div>

        <!-- 添加打印按钮 -->
        <button 
          @click="printContent" 
          title="打印"
        >
          <i class="fas fa-print"></i>
        </button>

        <!-- 添加保存按钮 -->
        <button
          v-if="enableAutoSave"
          :disabled="readOnly"
          @click="saveContent"
          class="save-button"
          :class="{ 'has-changes': hasUnsavedChanges }"
          :title="hasUnsavedChanges ? '保存更改' : '已保存'"
        >
          <i class="fas fa-save"></i>
          <span v-if="isSaving">保存中...</span>
          <span v-else-if="hasUnsavedChanges">未保存</span>
          <span v-else>已保存</span>
        </button>
      </div>
    </div>
    <editor-content class="editor-content" :editor="editor" />

    <!-- 添加保存提示 -->
    <div v-if="saveMessage" :class="['save-message', saveMessage.type]">
      {{ saveMessage.text }}
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <div width="100%" v-html="dialogImageUrl" />
    </el-dialog>
  </div>
</template>
<script>
// 导入Font Awesome
import "@fortawesome/fontawesome-free/css/all.css";
// 颜色
import { Color } from "@tiptap/extension-color";
// 列表项
import ListItem from "@tiptap/extension-list-item";
// 文本样式
import TextStyle from "@tiptap/extension-text-style";
// 文档
import Document from "@tiptap/extension-document";
// 任务
import TaskItem from "@tiptap/extension-task-item";
// 光标
import Dropcursor from "@tiptap/extension-dropcursor";
// 图片
import Image from "@tiptap/extension-image";
// 段落
import Paragraph from "@tiptap/extension-paragraph";
// 链接
import Link from "@tiptap/extension-link";
// 文本
import Text from "@tiptap/extension-text";
// 任务列表
import TaskList from "@tiptap/extension-task-list";
// 排版
import Typography from "@tiptap/extension-typography";
// 高亮
import Highlight from "@tiptap/extension-highlight";
// 对齐
import TextAlign from "@tiptap/extension-text-align";
// 表格
import Table from "@tiptap/extension-table";
// 表格单元格
import TableCell from "@tiptap/extension-table-cell";
// 表格头
import TableHeader from "@tiptap/extension-table-header";
// 表格行
import TableRow from "@tiptap/extension-table-row";
// 初始化
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-2";

import debounce from "lodash/debounce";
import drawioEmbed from 'drawio-embed';

import {  UploadContainer  } from './customNode';
export default {
  name: "wgEditorPlus",
  components: {
    EditorContent,
  },
  props: {
    // 初始内容
    initialContent: {
      type: [Object, String],
      default: () => ({
        html: '',
        text: '',
        json: null
      }),
      validator: (value) => {
        if (typeof value === 'string') return true;
        if (typeof value === 'object') {
          return value.hasOwnProperty('html') || 
                value.hasOwnProperty('text') || 
                value.hasOwnProperty('json');
        }
        return false;
      }
    },
    // 自动保存延迟（毫秒）
    autoSaveDelay: {
      type: Number,
      default: 3000,
    },
    // 添加是否启用自动保存的配置
    enableAutoSave: {
      type: Boolean,
      default: false,
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    drawioUrl: {
      type: String,
    }
  },
  watch: {
    // 监听 readOnly 变化
    readOnly: {
      immediate: true,
      handler(val) {
        if (this.editor) {
          this.updateReadonlyState(val);
        }
      }
    },
    initialContent: {
      immediate: true,
      deep: true,
      handler(contentObj) {
        // 处理字符串类型的内容
        // const contentObj = typeof newContent === 'string' ? {
        //   html: newContent,
        //   text: '',
        //   json: null
        // } : newContent;
        
        // 避免重复处理相同的内容
        // if (JSON.stringify(contentObj) === JSON.stringify(this.currentContent)) {
        //   return;
        // }

        this.currentContent = contentObj;
        if (this.editor) {
          this.updateEditorContent(contentObj);
        }
      }
    },
  },
  computed: {
  },
  data() {
    return {
      editor: null,
      tableHTML: ``,
      showColorPicker: false,
      showCellBgColorPicker: false,
      colors: [
        { label: "默认黑", value: "#000000" },
        { label: "深灰", value: "#666666" },
        { label: "浅灰", value: "#999999" },
        { label: "红色", value: "#FF0000" },
        { label: "橙色", value: "#FF8C00" },
        { label: "黄色", value: "#FFD700" },
        { label: "绿色", value: "#008000" },
        { label: "青色", value: "#00CED1" },
        { label: "蓝色", value: "#0000FF" },
        { label: "紫色", value: "#800080" },
        { label: "粉色", value: "#FFC0CB" },
        { label: "棕色", value: "#A52A2A" },
      ],
      cellBackgroundColors: [
        { label: "无填充", value: "transparent" },
        { label: "浅灰", value: "#F5F5F5" },
        { label: "浅黄", value: "#FFF9E6" },
        { label: "浅绿", value: "#E6FFE6" },
        { label: "浅蓝", value: "#E6F3FF" },
        { label: "浅粉", value: "#FFE6E6" },
        { label: "浅紫", value: "#F2E6FF" },
        { label: "浅青", value: "#E6FFFF" },
        { label: "米色", value: "#FAF594" },
        { label: "淡橙", value: "#FFE4CC" },
        { label: "淡青", value: "#CCF2FF" },
        { label: "淡紫", value: "#E6CCF2" },
      ],
      hasUnsavedChanges: false,
      isSaving: false,
      saveMessage: null,
      lastSavedContent: "",
      showTablePicker: false,
      hoveredRows: 0,
      hoveredCols: 0,
      autoSaveTimer: null,
      showHeadingPicker: false,
      drawioInstance: null,
      imageContent: {},
      svgContent: {},
      dialogVisible: false,
      dialogImageUrl: '',
      flowcharts: [], // 存储多个流程图数据
      currentContent: null,
      showExportOptions: false, // 控制导出选项菜单的显示
    };
  },

  created() {
    // 初始化 
    const drawioUrl = this.drawioUrl ? this.drawioUrl :window.location.origin;
    this.drawioInstance = drawioEmbed(drawioUrl + '/drawio');
    window.addEventListener('drawioImageCreated', this.handleDrawioImageCreated);
    this.initAutoSave();
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph", 'block', 'uploadContainer', 'tableCell', 'image'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
        Typography,
        TaskItem,
        TaskList,
        Highlight,
        Table.configure({
          resizable: true,
          allowTableNodeSelection: true,
        }),
        TableRow,
        TableHeader,
        // Default TableCell
        TableCell,
        // Custom TableCell with backgroundColor attribute
        Document,
        Paragraph,
        Link.configure({
          openOnClick: false,
          defaultProtocol: 'https',
        }),
        Text,
        Dropcursor,
        Image.configure({
          inline: true,
          allowBase64: true, // 允许 base64 图片
          // 添加调整大小配置
          resizable: true,
          HTMLAttributes: {
            class: "editor-image",
            draggable: true, // 启用拖拽
          },
        }),
        UploadContainer,
      ],
      editorProps: {
        handlePaste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          const imageItems = items.filter(
            (item) => item.type.indexOf("image") === 0
          );

          if (imageItems.length === 0) {
            return false;
          }

          event.preventDefault();

          imageItems.forEach((item) => {
            const blob = item.getAsFile();
            if (blob) {
              // 方案1: 直接转为 base64（适用于简单场景
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result;
                this.editor.chain().focus().setImage({ src: base64 }).run();
              };
              reader.readAsDataURL(blob);

              // 方案2: 上传到服务器（推荐生产环境使用）
              /*
              const formData = new FormData()
              formData.append('file', blob)
              
              // 发起上传请求
              this.uploadImage(formData).then(url => {
                this.editor.chain().focus().setImage({ src: url }).run()
              })
              */
            }
          });

          return true;
        },
      },
      // content: this.currentContent?.json || '',
      // editable: !this.readOnly, // 导致表格无法拖拽
      // content: this.initialContent,
      onUpdate: ({ editor }) => {
        if (!this.readOnly) {
          this.handleUpdate({ editor });
        }
      },
      onCreate: ({ editor }) => {
        // 在编辑器容器上添加点击事件监听
        editor.view.dom.addEventListener('dblclick', this.handleLinkDblClick);
        editor.view.dom.addEventListener('click', this.handleLinkClick);
      }
    });

    // 初始化时设置只读状态
    this.$nextTick(() => {
      this.updateReadonlyState(this.readOnly);
    });
    // 如果有初始内容，更新编辑器
    if (this.currentContent) {
      this.updateEditorContent(this.currentContent);
    }

    document.addEventListener("click", this.handleClickOutside);

    // 添加离开页面前的提示
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  methods: {
    updateEditorContent(content) {
      if (!this.editor) return;
      
      try {
        // 如果是字符串，直接设置为 HTML 内容
        if (typeof content === 'string') {
          this.$nextTick(() => {
            this.editor.commands.setContent(content);
          });
          return;
        }
        const processedContent = this.processUploadContainerData(content);
        
        this.$nextTick(() => {
          if (processedContent.json) {
            this.editor.commands.setContent(processedContent.json);
          } else if (processedContent.html) {
            this.editor.commands.setContent(processedContent.html);
          }
        });
      } catch (error) {
        console.error('Error updating editor content:', error);
      }
    },
    // 处理流程图数据的辅助方法
    processUploadContainerData(content) {
      if (!content.json) return content;

      // 创建一个深拷贝，避免修改原始数据
      const processedContent = JSON.parse(JSON.stringify(content));

      const processNode = (node) => {
        if (node.type === 'uploadContainer') {
          node.attrs = {
            ...node.attrs,
            class: 'upload-container',
            ondblclick: node.attrs.svgContent ? 
              `window.handleDrawioImageClick && window.handleDrawioImageClick(${JSON.stringify(node.attrs.svgContent)})` : 
              null
          };
        }
        
        if (node.content) {
          node.content = node.content.map(processNode);
        }
        
        return node;
      };

      if (Array.isArray(processedContent.json.content)) {
        processedContent.json.content = processedContent.json.content.map(processNode);
      }

      return processedContent;
    },
    // 处理双击事件
    handleEditorDblclick(event) {
      const target = event.target;
      const actionElement = target.closest('[data-action]');
      if (!actionElement) return;

      const action = actionElement.dataset.action;
      const container = target.closest('.upload-container');
      if (!container) return;

      const svgContent = container.dataset.svgContent;
      switch (action) {
        case 'open-editor':
          this.openDrawioEditor(JSON.parse(svgContent));
          break;
        }
    },
    // 处理点击事件
    handleEditorClick(event) {
      const target = event.target;
      const actionElement = target.closest('[data-action]');
      if (!actionElement) return;

      const action = actionElement.dataset.action;
      const container = target.closest('.upload-container');
      if (!container) return;

      const svgContent = container.dataset.svgContent;

      switch(action) {
        case 'preview':
          if (svgContent) this.handlePictureCardPreview(JSON.parse(svgContent));
          break;
        case 'remove':
          if (svgContent) this.handleRemove();
          break;
      }
    },
    handleRemove() {
      if (this.readOnly) return;
      this.editor.chain()
        .focus()
        .removeUploadContainer()
        .run()
    },
    handlePictureCardPreview(file) {
      // if (this.readOnly) return;
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },
    // 处理 drawio 图片创建
    handleDrawioImageCreated(evt) {
      const { imageContent, imageType } = evt;
      if (!imageContent) return;
      
      // 生成唯一ID用于关联同一个流程图的不同格式
      const chartId = Date.now().toString();
      
      // 查找或创建新的流程图对象
      let chart = this.flowcharts.find(c => !c.complete);
      if (!chart) {
        chart = {
          id: chartId,
          imageContent: null,
          svgContent: null,
          complete: false
        };
        this.flowcharts.push(chart);
      }
      
      // 更新对应格式的内容
      if (imageType !== 'svg') {
        chart.imageContent = {
          // fileName: `流程图_${chartId}`,
          type: 'base64',
          filePath: imageContent,
        };
      } else {
        chart.svgContent = {
          // fileName: `流程图_${chartId}`,
          type: 'svg',
          filePath: imageContent,
        };
      }
      
      // 检查是否两种格式都已保存
      if (chart.imageContent && chart.svgContent) {
        chart.complete = true;
        // 插入到编辑器
        this.editor.chain()
          .focus()
          .setUploadContainer({
            imageContent: chart.imageContent.filePath,
            svgContent: chart.svgContent.filePath,
          })
          .run();
        // 可选：从数组中移除已完成的流程图数据
        this.flowcharts = this.flowcharts.filter(c => !c.complete);
      }
    },
    // 打开 drawio 编辑器
    async openDrawioEditor(filePath) {
      if (this.readOnly) return;
      if (this.drawioInstance && this.drawioInstance.isLoaded()) {
        this.drawioInstance(filePath)
          ?.then((res) => {
            console.log('Draw.io editor opened with initial data', res);
          })
          ?.catch(() => {
            // console.log('编辑器还在初始化中，请稍后再打开...');
            this.$message.warning('编辑器还在初始化中，请稍后再打开...');
            // window.open('http://172.26.0.178/drawio');
          });
      }
    },
    // 上传图片到服务器的方法
    async uploadImage(formData) {
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    },
    addImage() {
      const url = window.prompt("URL");

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
    setTextColor(color) {
      this.editor.chain().focus().setColor(color).run();
      this.showColorPicker = false;
    },
    setCellBackground(color) {
      this.editor
        .chain()
        .focus()
        .setCellAttribute("backgroundColor", color)
        .run();
      this.showCellBgColorPicker = false;
    },
    // 添加点击外部关闭调色板的方法
    handleClickOutside(event) {
      const textColorPicker = this.$el.querySelector(".text-color-picker");
      const cellBgColorPicker = this.$el.querySelector(".cell-bg-color-picker");
      const tablePicker = this.$el.querySelector(".table-picker");
      const headingPicker = this.$el.querySelector('.heading-picker');
      const exportPicker = this.$el.querySelector('.export-picker');

      if (textColorPicker && !textColorPicker.contains(event.target)) {
        this.showColorPicker = false;
      }

      if (cellBgColorPicker && !cellBgColorPicker.contains(event.target)) {
        this.showCellBgColorPicker = false;
      }

      if (tablePicker && !tablePicker.contains(event.target)) {
        this.showTablePicker = false;
      }

      if (headingPicker && !headingPicker.contains(event.target)) {
        this.showHeadingPicker = false;
      }

      if (exportPicker && !exportPicker.contains(event.target)) {
        this.showExportOptions = false;
      }
    },

    // 导出相关方法
    toggleExportOptions() {
      this.showExportOptions = !this.showExportOptions;
      if (this.showExportOptions) {
        this.updatePickerPosition('export-picker');
      }
    },

    // 导出为HTML
    exportAsHTML() {
      if (!this.editor) return;
      
      const content = this.editor.getHTML();
      const fileName = `document_${new Date().toISOString().slice(0, 10)}.html`;
      
      // 创建完整的HTML文档
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 3px solid #ddd;
      margin-left: 0;
      padding-left: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
      `;
      
      this.downloadFile(htmlContent, fileName, 'text/html');
      this.showExportOptions = false;
      this.showSaveMessage("HTML导出成功", "success");
    },
    
    // 导出为纯文本
    exportAsText() {
      if (!this.editor) return;
      
      const content = this.editor.getText();
      const fileName = `document_${new Date().toISOString().slice(0, 10)}.txt`;
      
      this.downloadFile(content, fileName, 'text/plain');
      this.showExportOptions = false;
      this.showSaveMessage("文本导出成功", "success");
    },
    
    // 导出为PDF
    exportAsPDF() {
      if (!this.editor) return;
      
      // 创建一个隐藏的iframe用于打印
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'absolute';
      printIframe.style.top = '-9999px';
      printIframe.style.left = '-9999px';
      document.body.appendChild(printIframe);
      
      // 获取编辑器内容
      const content = this.editor.getHTML();
      
      // 设置iframe内容
      const iframeDocument = printIframe.contentDocument || printIframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>PDF导出</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1em;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            pre {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
            blockquote {
              border-left: 3px solid #ddd;
              margin-left: 0;
              padding-left: 10px;
              color: #666;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
      iframeDocument.close();
      
      // 等待iframe加载完成
      printIframe.onload = () => {
        try {
          // 调用打印，但设置为保存PDF
          printIframe.contentWindow.print();
          
          // 显示成功消息
          this.showSaveMessage("PDF导出成功", "success");
          
          // 延迟移除iframe
          setTimeout(() => {
            document.body.removeChild(printIframe);
          }, 1000);
        } catch (error) {
          console.error('PDF导出失败:', error);
          this.showSaveMessage("PDF导出失败，请重试", "error");
          document.body.removeChild(printIframe);
        }
      };
      
      this.showExportOptions = false;
    },
    
    // 打印内容
    printContent() {
      if (!this.editor) return;
      
      // 创建一个隐藏的iframe用于打印
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'absolute';
      printIframe.style.top = '-9999px';
      printIframe.style.left = '-9999px';
      document.body.appendChild(printIframe);
      
      // 获取编辑器内容
      const content = this.editor.getHTML();
      
      // 设置iframe内容
      const iframeDocument = printIframe.contentDocument || printIframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>打印文档</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1em;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            pre {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
            blockquote {
              border-left: 3px solid #ddd;
              margin-left: 0;
              padding-left: 10px;
              color: #666;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
      iframeDocument.close();
      
      // 等待iframe加载完成
      printIframe.onload = () => {
        try {
          // 调用打印
          printIframe.contentWindow.print();
          
          // 延迟移除iframe
          setTimeout(() => {
            document.body.removeChild(printIframe);
          }, 1000);
        } catch (error) {
          console.error('打印失败:', error);
          document.body.removeChild(printIframe);
        }
      };
    },
    
    // 下载文件的通用方法
    downloadFile(content, fileName, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    },
    
    // 显示保存消息
    showSaveMessage(text, type = 'success') {
      this.saveMessage = { text, type };
      
      // 3秒后自动隐藏消息
      setTimeout(() => {
        this.saveMessage = null;
      }, 3000);
    },
    // 优化后的保存方法
    async saveContent() {
      if (!this.hasUnsavedChanges || this.isSaving) return;

      this.isSaving = true;
      const content = this.editor.getHTML();

      try {
        // 触发保存前事件
        this.$emit("before-save", content);

        // 触发保存事件,让父组件处理保存逻辑
        this.$emit("save", {
          content,
          html: content,
          text: this.editor.getText(),
          json: this.editor.getJSON(),
        });

        this.lastSavedContent = content;
        this.hasUnsavedChanges = false;
        this.showSaveMessage("保存成功", "success");

        // 触发保存成功事件
        this.$emit("save-success", content);
      } catch (error) {
        console.error("保存失败:", error);
        this.showSaveMessage("保存失败，请重试", "error");

        // 触发保存失败事件
        this.$emit("save-error", error);
      } finally {
        this.isSaving = false;
        // 触发保存完成事件
        this.$emit("after-save", content);
      }
    },

    // 优化自动保存
    initAutoSave() {
      if (this.enableAutoSave) {
        this.debouncedAutoSave = debounce(() => {
          if (this.hasUnsavedChanges) {
            this.saveContent();
          }
        }, this.autoSaveDelay);
      }
    },

    // 优化编辑器内容更新处理
    handleUpdate({ editor }) {
      const content = editor.getHTML();

      // 触发内容变化事件
      this.$emit("change", {
        html: content,
        text: editor.getText(),
        json: editor.getJSON(),
      });

      // 检查是否有未保存的更改
      if (content !== this.lastSavedContent) {
        this.hasUnsavedChanges = true;

        // 如果启用了自动保存,触发自动保存
        if (this.enableAutoSave) {
          this.debouncedAutoSave();
        }
      }

      // 触发 v-model 更新
      this.$emit("input", content);
    },

    // 页面离开提示
    handleBeforeUnload(e) {
      if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "有未保存的更改，确定要离开吗？";
      }
    },

    updateHovered(row, col) {
      this.hoveredRows = row;
      this.hoveredCols = col;
    },
    // 修改插入表格的方法
    insertTableWithSize(rows, cols) {
      // 计算每列的百分比宽度
      const colWidth = 100 / cols;
      
      let tableHtml = '<table>';
      
      // 添加表格内容
      for (let i = 0; i < rows; i++) {
        tableHtml += "<tr>";
        for (let j = 0; j < cols; j++) {
          tableHtml += `<td colwidth="${colWidth}"><p></p></td>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table><p></p>";

      this.editor.chain().focus().insertContent(`${tableHtml}`).run();
      this.showTablePicker = false;
    },
    // 添加新方法用于计算弹窗位置
    updateTablePickerPosition() {
      this.$nextTick(() => {
        const picker = this.$el.querySelector('.table-grid-picker');
        if (!picker) return;
        
        const pickerRect = picker.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // 检查右边界
        if (pickerRect.right > viewportWidth) {
          picker.style.left = 'auto';
          picker.style.right = '0';
        }
        
        // 检查左边界
        if (pickerRect.left < 0) {
          picker.style.left = '0';
          picker.style.right = 'auto';
        }
      });
    },
    
    // 修改显示表格选择器的方法
    toggleTablePicker() {
      this.showTablePicker = !this.showTablePicker;
      if (this.showTablePicker) {
        this.updateTablePickerPosition();
      }
    },
    
    // 通用的 picker 定位方法
    updatePickerPosition(pickerClass) {
      this.$nextTick(() => {
        const picker = this.$el.querySelector(`.${pickerClass} .color-palette, .${pickerClass} .table-grid-picker, .${pickerClass} .heading-menu`);
        if (!picker) return;
        
        const pickerRect = picker.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 检查右边界
        if (pickerRect.right > viewportWidth) {
          picker.style.left = 'auto';
          picker.style.right = '0';
        }
        
        // 检查左边界
        if (pickerRect.left < 0) {
          picker.style.left = '0';
          picker.style.right = 'auto';
        }
        
        // 检查底部边界
        if (pickerRect.bottom > viewportHeight) {
          picker.style.top = 'auto';
          picker.style.bottom = '100%';
          picker.style.marginTop = '0';
          picker.style.marginBottom = '4px';
        }
      });
    },
    
    // 修改所有 picker 的显示方法
    toggleTablePicker() {
      this.showTablePicker = !this.showTablePicker;
      if (this.showTablePicker) {
        this.updatePickerPosition('table-picker');
      }
    },
    
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker;
      if (this.showColorPicker) {
        this.updatePickerPosition('text-color-picker');
      }
    },
    
    toggleCellBgColorPicker() {
      this.showCellBgColorPicker = !this.showCellBgColorPicker;
      if (this.showCellBgColorPicker) {
        this.updatePickerPosition('cell-bg-color-picker');
      }
    },

    toggleHeadingPicker() {
      this.showHeadingPicker = !this.showHeadingPicker;
      if (this.showHeadingPicker) {
        this.updatePickerPosition('heading-picker');
      }
    },

    setHeading(level) {
      this.editor.chain().focus().toggleHeading({ level }).run();
      this.showHeadingPicker = false;
    },
    // updateContent(content) {
    //   this.$nextTick(() => {
    //     this.editor.commands.setContent(content);
    //   });
    // },
    updateReadonlyState(isReadonly) {
      // 使用 nextTick 确保 DOM 已更新
      this.$nextTick(() => {
        const element = this.$el?.querySelector('.ProseMirror');
        if (element) {
          if (isReadonly) {
            element.setAttribute('contenteditable', 'false');
            
            // 阻止所有可能的编辑操作
            const preventAllEdits = (e) => {
              // 阻止所有键盘操作
              if (e.type === 'keydown') {
                // 只允许复制操作
                if (!(e.ctrlKey && e.key === 'c')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }
              
              // 阻止所有鼠标操作
              if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'click') {
                // 允许点击链接
                if (e.target.tagName === 'A') {
                  return true;
                }
                // 阻止其他所有鼠标操作
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              
              // 阻止所有拖拽操作
              if (e.type === 'dragstart' || e.type === 'drop' || e.type === 'dragover') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              
              // 阻止所有粘贴操作
              if (e.type === 'paste') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              
              // 阻止所有输入操作
              if (e.type === 'input' || e.type === 'beforeinput') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              
              // 阻止所有剪切操作
              if (e.type === 'cut') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            };

            // 添加事件监听器
            const events = [
              'keydown',
              'keyup',
              'keypress',
              'mousedown',
              'mouseup',
              'click',
              'dragstart',
              'drop',
              'dragover',
              'paste',
              'input',
              'beforeinput',
              'cut'
            ];

            events.forEach(eventType => {
              element.addEventListener(eventType, preventAllEdits, true);
            });

            // 存储事件监听器引用，以便后续移除
            element._readonlyEventListeners = {
              handler: preventAllEdits,
              events: events
            };

            // 添加 CSS 样式来禁用选择
            element.style.userSelect = 'text';
            element.style.webkitUserSelect = 'text';
            element.style.mozUserSelect = 'text';
            element.style.msUserSelect = 'text';
            
            // 禁用右键菜单
            element.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              return false;
            }, true);

          } else {
            element.setAttribute('contenteditable', 'true');
            
            // 移除之前添加的事件监听器
            if (element._readonlyEventListeners) {
              const { handler, events } = element._readonlyEventListeners;
              events.forEach(eventType => {
                element.removeEventListener(eventType, handler, true);
              });
              delete element._readonlyEventListeners;
            }

            // 恢复默认样式
            element.style.userSelect = '';
            element.style.webkitUserSelect = '';
            element.style.mozUserSelect = '';
            element.style.msUserSelect = '';
          }
        }
      });
    },
    insertLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link with target="_self"
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ 
          href: url,
          target: '_self',
        })
        .run()
    },
     // 处理链接点击事件
    handleLinkDblClick(event) {
      const link = event.target.closest('a');
      if (link && link.getAttribute('href')) {
        event.preventDefault();
        this.$emit('link-dblClick', link.getAttribute('href'));
      }
    },
    handleLinkClick(event) {
      const link = event.target.closest('a');
      if (link && link.getAttribute('href')) {
        event.preventDefault();
        this.$emit('link-click', link.getAttribute('href'));
      }
    }
  },
  beforeDestroy() {
    if (this.editor) {
      // 移除事件监听
      this.editor.view.dom.removeEventListener('dblclick', this.handleLinkDblClick);
      this.editor.view.dom.removeEventListener('click', this.handleLinkClick);
      this.editor.destroy();
      this.editor = null;
    }
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    window.removeEventListener('drawioImageCreated', this.handleDrawioImageCreated);
    this.drawioInstance.close();
  }
};
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  &:focus {
    outline: none !important;
    border-color: var(--purple) !important; /* 使用紫色或其他你想要的颜色 */
    box-shadow: 0 0 0 2px rgba(149, 141, 241, 0) !important; /* 添加柔和的阴影效果 */
  }

  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }

  /* Table-specific styling */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
    // 确保表格不会影响其他内容的布局
    margin-bottom: 1em; // 添加底部间距
    position: relative; // 确保定位上下文正确

    & + p {
      margin-top: 1em; // 表格后的段落添加上边距
    }

    td,
    th {
      border: 1px solid #c1c7d0;
      box-sizing: border-box;
      // width: 100px;
      min-width: 50px;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: #f4f5f7;
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: var(--gray-2);
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: var(--purple);
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
    }
  }

  .tableWrapper {
    margin: 1.5rem 0;
    overflow-x: auto;
    // 确保表格容器不会阻塞后续内容
    position: relative;
    margin-bottom: 1em;

    &::after {
      content: "";
      display: table;
      clear: both;
    }
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
  /* Task list specific styles */
  ul[data-type="taskList"] {
    list-style: none;
    margin-left: 0;
    padding: 0;

    li {
      align-items: center;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }

    input[type="checkbox"] {
      cursor: pointer;
    }
  }
}

/* 添加按钮样式 */
.button-group {
  button {
    padding: 0.5rem;
    margin: 0.2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    &.is-active {
      background: #e6e6e6;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    i {
      font-size: 1rem;
      width: 1.2rem;
      height: 1.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.color-picker {
  position: relative;
  display: inline-block;
  margin: 0 4px;

  .color-picker-trigger {
    padding: 8px;
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .color-palette {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
    padding: 8px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .color-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      position: relative;

      &:hover {
        transform: scale(1.1);
      }

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

// 可以添加动画效果
.color-palette {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  position: relative;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.has-changes {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  i {
    font-size: 14px;
  }

  span {
    font-size: 12px;
  }
}

.save-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  animation: slideIn 0.3s ease;
  z-index: 1000;

  &.success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }

  &.error {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 修改表格选择器样式 */
.table-picker {
  position: relative;
  display: inline-block;

  .table-grid-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-top: 4px;
    
    // 添加最大宽度和高度限制
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
    
    // 添加过渡效果
    transition: all 0.2s ease;
  }

  .table-grid {
    display: grid;
    grid-template-columns: repeat(10, 16px);
    gap: 2px;
    padding: 4px;
    background: #fafafa;
    border-radius: 2px;
    
    // 确保网格容器大小合适
    min-width: 180px;
    max-width: 200px;
  }

  .table-grid-row {
    display: contents; // 使用grid布局替flex
  }

  .table-grid-cell {
    width: 16px;
    height: 16px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      transform: scale(1.1);
      z-index: 1;
    }

    &.hovered {
      background: #e6f7ff;
      border-color: #91d5ff;
    }
  }

  .table-grid-size {
    text-align: center;
    padding: 4px;
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    border-top: 1px solid #f0f0f0;
  }
}

// 添加响应式样式
@media screen and (max-width: 768px) {
  .table-picker {
    .table-grid-picker {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
    }
    
    .table-grid {
      max-width: 90vw;
    }
  }
}

.color-picker {
  &.text-color-picker {
    // 文本颜色选择器特定样式
  }

  &.cell-bg-color-picker {
    // 单元格背景色选择器特定样式
  }
}

// 通用的 picker 基础样式
%picker-base {
  position: relative;
  display: inline-block;
  
  .color-palette,
  .table-grid-picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-top: 4px;
    
    // 添加最大宽度和高度限制
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
    
    // 添加过渡效果
    transition: all 0.2s ease;
  }
}

// 表格选择器样式
.table-picker {
  @extend %picker-base;
  
  .table-grid {
    display: grid;
    grid-template-columns: repeat(10, 16px);
    gap: 2px;
    padding: 4px;
    background: #fafafa;
    border-radius: 2px;
    min-width: 180px;
    max-width: 200px;
  }
  
  // ... 其他表格选择器特定样式 ...
}

// 颜色选择器样式
.color-picker {
  @extend %picker-base;
  
  &.text-color-picker,
  &.cell-bg-color-picker {
    .color-palette {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 4px;
      min-width: 160px;
      
      .color-btn {
        width: 24px;
        height: 24px;
        padding: 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: transform 0.15s ease;

        &:hover {
          transform: scale(1.1);
          z-index: 1;
        }

        i {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
}

// 响应式样式
@media screen and (max-width: 768px) {
  .table-picker,
  .color-picker {
    .table-grid-picker,
    .color-palette {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
    }
  }
}

// 在现有的样式基础上添加标题选择器的样式
.heading-picker {
  @extend %picker-base;
  
  .heading-picker-trigger {
    padding: 8px;
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      background-color: #f5f5f5;
    }

    .fa-chevron-down {
      font-size: 0.8em;
      margin-left: 2px;
    }
  }

  .heading-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-top: 4px;
    min-width: 120px;
    
    // 添加过渡效果
    animation: fadeIn 0.2s ease-in-out;
  }

  .heading-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    border-radius: 4px;
    
    i {
      width: 16px;
      text-align: center;
    }

    &:hover {
      background-color: #f5f5f5;
    }

    &.is-active {
      background-color: #e6f7ff;
      color: #1890ff;
    }
  }
}

// 响应式样式
@media screen and (max-width: 768px) {
  .heading-picker {
    .heading-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      width: 200px;
    }
  }
}

// 确保点击外部可以关闭菜单
.heading-picker {
  &:focus-within {
    .heading-menu {
      display: block;
    }
  }
}

.container {
  &.is-readonly {
    .ProseMirror {
      // 允许表格拖拽等交互
      &[contenteditable='false'] {
        cursor: default;
        
        // 禁用文本编辑
        caret-color: transparent;
        
        // 允许选择文本
        user-select: text;
        -webkit-user-select: text;
        
        // 保持表格交互功能
        table {
          .column-resize-handle {
            display: none; // 隐藏列宽调整手柄
          }
        }
        
        // 禁用其他编辑功能
        * {
          outline: none !important;
        }
        
        // 保持链接可点击
        a {
          cursor: pointer;
          pointer-events: auto;
        }
        
        // 禁用输入和粘贴
        &:focus {
          outline: none;
        }
      }
    }
  }
  
  // 只读模式下隐藏工具栏
  &.is-readonly .control-group {
    display: none;
  }
}

.upload-container {
  // width: 200px;
  // height: 144px;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.uploaded-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
}

.image-actions {
  position: absolute;
  bottom: -50px;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
  transition: bottom 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 0;
}

.upload-container:hover .image-actions {
  bottom: 0;
}
</style>
