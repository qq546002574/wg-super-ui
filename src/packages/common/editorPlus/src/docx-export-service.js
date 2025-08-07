/**
 * 独立的 DOCX 导出服务
 * 用于将富文本编辑器内容导出为 Word 文档
 */

export class DocxExportService {
  constructor() {
    this.defaultOptions = {
      fontSize: 24, // 12pt (Word 中 1pt = 2 单位)
      fontFamily: 'Microsoft YaHei',
      pageWidth: 11906,  // A4宽度
      pageHeight: 16838, // A4高度
      margins: {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440,
      }
    };
  }

  /**
   * 导出编辑器内容为 DOCX
   * @param {Object} editor - 编辑器实例
   * @param {Object} options - 导出选项
   * @returns {Promise<void>}
   */
  async exportToDocx(editor, options = {}) {
    if (!editor || !editor.editor) {
      throw new Error('无效的编辑器实例');
    }

    try {
      // 动态导入 docx 库
      const { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = await import('docx');
      
      // 获取编辑器内容
      const content = {
        html: editor.editor.getHTML(),
        text: editor.editor.getText(),
        json: editor.editor.getJSON()
      };

      if (!content.html || !content.html.trim()) {
        throw new Error('编辑器内容为空');
      }

      // 解析内容为 Word 元素
      const docElements = this.parseContentToElements(content.html, { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle });

      // 创建 Word 文档
      const doc = new Document({
        creator: "wg-editor-plus",
        title: options.title || "导出文档",
        description: "由 wg-editor-plus 生成",
        sections: [{
          properties: {
            page: {
              size: {
                width: this.defaultOptions.pageWidth,
                height: this.defaultOptions.pageHeight,
              },
              margin: this.defaultOptions.margins
            }
          },
          children: docElements
        }]
      });

      // 生成 DOCX blob
      const blob = await Packer.toBlob(doc);
      
      // 下载文件
      const filename = options.filename || `document_${new Date().toISOString().slice(0, 10)}.docx`;
      this.downloadFile(blob, filename);

      return { success: true, message: 'DOCX导出成功' };

    } catch (error) {
      console.error('DOCX导出失败:', error);
      throw new Error(`DOCX导出失败: ${error.message}`);
    }
  }

  /**
   * 解析 HTML 内容为 Word 元素
   * @param {string} htmlContent - HTML 内容
   * @param {Object} docxClasses - DOCX 类
   * @returns {Array} Word 元素数组
   */
  parseContentToElements(htmlContent, docxClasses) {
    const { Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docxClasses;
    
    // 创建临时 DOM 元素来解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const elements = [];

    const processElement = (element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          const level = parseInt(tagName.charAt(1));
          return new Paragraph({
            children: [new TextRun({
              text: element.textContent || '',
              bold: true,
              size: Math.max(16, 32 - (level - 1) * 4),
              font: this.defaultOptions.fontFamily
            })],
            heading: HeadingLevel[`HEADING_${level}`],
            spacing: { before: 240, after: 120 }
          });

        case 'p':
          const runs = this.extractTextRuns(element, TextRun);
          return new Paragraph({
            children: runs.length > 0 ? runs : [new TextRun({ text: '' })],
            spacing: { after: 120 }
          });

        case 'table':
          return this.createTable(element, { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, BorderStyle });

        case 'ul':
        case 'ol':
          return this.createList(element, tagName === 'ol', { Paragraph, TextRun });

        case 'blockquote':
          return new Paragraph({
            children: [new TextRun({
              text: element.textContent || '',
              italics: true,
              color: '666666'
            })],
            indent: { left: 720 },
            spacing: { before: 120, after: 120 }
          });

        case 'pre':
          return new Paragraph({
            children: [new TextRun({
              text: element.textContent || '',
              font: 'Courier New',
              size: 20
            })],
            spacing: { before: 120, after: 120 }
          });

        case 'hr':
          return new Paragraph({
            children: [new TextRun({ text: '────────────────────────────────────' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 }
          });

        case 'br':
          return new Paragraph({ children: [new TextRun({ text: '' })] });

        default:
          // 处理其他元素的文本内容
          if (element.textContent && element.textContent.trim()) {
            return new Paragraph({
              children: [new TextRun({ 
                text: element.textContent.trim(),
                font: this.defaultOptions.fontFamily,
                size: this.defaultOptions.fontSize
              })],
              spacing: { after: 120 }
            });
          }
          return null;
      }
    };

    // 遍历所有子元素
    const processAllChildren = (parent) => {
      for (let child of parent.children || []) {
        if (child.nodeType === 1) { // Element node
          const element = processElement(child);
          if (element) {
            if (Array.isArray(element)) {
              elements.push(...element);
            } else {
              elements.push(element);
            }
          }
        }
      }
    };

    processAllChildren(doc.body);

    // 如果没有元素，添加一个空段落
    if (elements.length === 0) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: '文档内容为空' })]
      }));
    }

    return elements;
  }

  /**
   * 提取文本运行
   * @param {Element} element - DOM 元素
   * @param {Function} TextRun - TextRun 类
   * @returns {Array} TextRun 数组
   */
  extractTextRuns(element, TextRun) {
    const runs = [];
    
    const traverse = (node, style = {}) => {
      if (node.nodeType === 3) { // Text node
        const text = node.textContent;
        if (text && text.trim()) {
          runs.push(new TextRun({
            text: text,
            font: this.defaultOptions.fontFamily,
            size: this.defaultOptions.fontSize,
            ...style
          }));
        }
      } else if (node.nodeType === 1) { // Element node
        const tagName = node.tagName.toLowerCase();
        const newStyle = { ...style };
        
        // 应用样式
        if (tagName === 'strong' || tagName === 'b') newStyle.bold = true;
        if (tagName === 'em' || tagName === 'i') newStyle.italics = true;
        if (tagName === 'u') newStyle.underline = {};
        if (tagName === 'code') {
          newStyle.font = 'Courier New';
          newStyle.size = 20;
        }
        
        for (let child of node.childNodes) {
          traverse(child, newStyle);
        }
      }
    };

    traverse(element);
    return runs;
  }

  /**
   * 创建表格
   * @param {Element} tableElement - 表格元素
   * @param {Object} classes - DOCX 类
   * @returns {Object} Table 对象
   */
  createTable(tableElement, classes) {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, BorderStyle } = classes;
    
    try {
      const rows = [];
      
      for (let row of tableElement.rows) {
        const cells = [];
        
        for (let cell of row.cells) {
          const isHeader = cell.tagName.toLowerCase() === 'th';
          cells.push(new TableCell({
            children: [new Paragraph({
              children: [new TextRun({
                text: cell.textContent || '',
                bold: isHeader,
                font: this.defaultOptions.fontFamily,
                size: this.defaultOptions.fontSize
              })]
            })],
            width: {
              size: 2000,
              type: WidthType.DXA
            }
          }));
        }
        
        rows.push(new TableRow({ children: cells }));
      }

      return new Table({
        rows,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
        }
      });
    } catch (error) {
      console.warn('表格创建失败:', error);
      return new Paragraph({
        children: [new TextRun({ text: tableElement.textContent || '' })]
      });
    }
  }

  /**
   * 创建列表
   * @param {Element} listElement - 列表元素
   * @param {boolean} isOrdered - 是否为有序列表
   * @param {Object} classes - DOCX 类
   * @returns {Array} Paragraph 数组
   */
  createList(listElement, isOrdered, classes) {
    const { Paragraph, TextRun } = classes;
    const items = [];
    
    const listItems = listElement.querySelectorAll('li');
    listItems.forEach((li, index) => {
      const bullet = isOrdered ? `${index + 1}.` : '•';
      items.push(new Paragraph({
        children: [new TextRun({
          text: `${bullet} ${li.textContent || ''}`,
          font: this.defaultOptions.fontFamily,
          size: this.defaultOptions.fontSize
        })],
        spacing: { after: 60 }
      }));
    });

    return items;
  }

  /**
   * 下载文件
   * @param {Blob} blob - 文件 blob
   * @param {string} filename - 文件名
   */
  downloadFile(blob, filename) {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('文件下载失败:', error);
      throw new Error('文件下载失败');
    }
  }
}

export default DocxExportService;