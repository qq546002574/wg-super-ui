<template>
  <div>
    <wg-button primary icon="icon-xinzeng1" @click="readOnly = !readOnly">切换只读</wg-button>
    <wg-button type="primary" @click="exportWord">导出Word</wg-button>
    <wg-editor-plus
        ref="editor"
        customUpload
        :readOnly="readOnly"
        style="height: 500px"></wg-editor-plus>
  </div>
</template>

<script>
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

export default {
  name: 'App',
  data() {
    return {
      readOnly: false
    }
  },
  methods: {
    // 处理文本节点
    processTextNode(node) {
      if (!node.textContent.trim()) return null;
      return new TextRun({
        text: node.textContent.replace(/\s+/g, ' '),
        size: 24 * 2,
        font: 'SimSun'
      });
    },

    // 处理表格
    processTable(tableNode) {
      const rows = Array.from(tableNode.rows).map(row => {
        const cells = Array.from(row.cells).map(cell => {
          return new TableCell({
            children: this.parseHtmlToDocxElements(cell.innerHTML),
            width: {
              size: 100 / row.cells.length,
              type: WidthType.PERCENTAGE
            }
          });
        });
        return new TableRow({ children: cells });
      });
      return new Table({ rows });
    },

    // 处理段落
    processParagraph(node, style) {
      return new Paragraph({
        children: Array.from(node.childNodes)
          .map(child => this.processNode(child))
          .filter(Boolean),
        alignment: style.textAlign === 'center' ? AlignmentType.CENTER : 
                  style.textAlign === 'right' ? AlignmentType.RIGHT : 
                  AlignmentType.LEFT,
        spacing: { line: 360, before: 200, after: 200 }
      });
    },

    // 处理标题
    processHeading(node, level) {
      return new Paragraph({
        children: [new TextRun({
          text: node.textContent.replace(/\s+/g, ' '),
          size: (32 - (level - 1) * 2) * 2,
          bold: true,
          font: 'SimSun'
        })],
        heading: HeadingLevel[`HEADING_${level}`],
        spacing: { before: 400, after: 200 }
      });
    },

    // 主处理函数
    processNode(node) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          return this.processTextNode(node);

        case Node.ELEMENT_NODE:
          const style = window.getComputedStyle(node);
          const tagName = node.tagName.toLowerCase();

          switch (tagName) {
            case 'p':
              return this.processParagraph(node, style);
            
            case 'table':
              return this.processTable(node);

            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              return this.processHeading(node, parseInt(tagName.charAt(1)));

            case 'strong':
            case 'b':
              return new TextRun({
                text: node.textContent,
                bold: true,
                size: 24 * 2,
                font: 'SimSun'
              });

            case 'em':
            case 'i':
              return new TextRun({
                text: node.textContent,
                italics: true,
                size: 24 * 2,
                font: 'SimSun'
              });

            default:
              if (node.childNodes?.length) {
                return this.processParagraph(node, style);
              }
          }
          break;
      }
      return null;
    },

    // HTML解析为Word元素
    parseHtmlToDocxElements(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const elements = [];

      Array.from(doc.body.childNodes).forEach(node => {
        const element = this.processNode(node);
        if (element) elements.push(element);
      });

      return elements;
    },

    // 导出Word文档
    async exportWord() {
      try {
        // 1. 获取编辑器HTML内容
        const editorContent = this.$refs.editor.editor.getHTML();
        if (!editorContent?.trim()) {
          throw new Error('编辑器内容为空');
        }

        // 2. 预处理HTML内容
        const cleanContent = editorContent
          .replace(/<br\s*\/?>/gi, '</p><p>')
          .replace(/<div[^>]*>/gi, '<p>')
          .replace(/<\/div>/gi, '</p>')
          .replace(/[\u200B-\u200D\uFEFF]/g, '')
          .replace(/\n/g, ' ')
          .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');

        // 3. 创建Word文档
        const doc = new Document({
          sections: [{
            properties: {
              page: {
                size: {
                  width: 11906,  // A4宽度
                  height: 16838, // A4高度
                },
                margin: {
                  top: 1440,    // 1英寸 = 1440缇
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: this.parseHtmlToDocxElements(cleanContent)
          }],
        });

        // 4. 生成文档二进制数据
        const blob = await Packer.toBlob(doc);

        // 5. 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '导出文档.docx';

        // 6. 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 7. 清理资源
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error('导出失败:', error);
      }
    }
  }
}
</script>
