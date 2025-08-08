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
    
    // 图片缓存
    this.imageCache = new Map();
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
      const { 
        Document, 
        Paragraph, 
        TextRun, 
        Packer, 
        HeadingLevel, 
        AlignmentType, 
        Table, 
        TableRow, 
        TableCell, 
        WidthType, 
        BorderStyle,
        ImageRun,
        Media
      } = await import('docx');
      
      // 获取编辑器内容
      const content = {
        html: editor.editor.getHTML(),
        text: editor.editor.getText(),
        json: editor.editor.getJSON()
      };

      if (!content.html || !content.html.trim()) {
        throw new Error('编辑器内容为空');
      }

      // 预处理图片
      await this.preloadImages(content.html);

      // 解析内容为 Word 元素
      const docElements = await this.parseContentToElements(content.html, { 
        Document, 
        Paragraph, 
        TextRun, 
        HeadingLevel, 
        AlignmentType, 
        Table, 
        TableRow, 
        TableCell, 
        WidthType, 
        BorderStyle,
        ImageRun,
        Media
      });

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
   * 预加载图片
   * @param {string} htmlContent - HTML 内容
   * @returns {Promise<void>}
   */
  async preloadImages(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    
    const loadPromises = Array.from(images).map(async (img) => {
      const src = img.src;
      if (src && !this.imageCache.has(src)) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          this.imageCache.set(src, {
            data: arrayBuffer,
            type: blob.type || 'image/png',
            width: img.width || 200,
            height: img.height || 200
          });
        } catch (error) {
          console.warn(`Failed to load image: ${src}`, error);
        }
      }
    });
    
    await Promise.all(loadPromises);
  }

  /**
   * 解析 HTML 内容为 Word 元素
   * @param {string} htmlContent - HTML 内容
   * @param {Object} docxClasses - DOCX 类
   * @returns {Array} Word 元素数组
   */
  async parseContentToElements(htmlContent, docxClasses) {
    const { 
      Paragraph, 
      TextRun, 
      HeadingLevel, 
      AlignmentType, 
      Table, 
      TableRow, 
      TableCell, 
      WidthType, 
      BorderStyle,
      ImageRun
    } = docxClasses;
    
    // 创建临时 DOM 元素来解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const elements = [];

    const processElement = async (element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          const level = parseInt(tagName.charAt(1));
          const headingRuns = await this.extractTextRuns(element, TextRun);
          return new Paragraph({
            children: headingRuns.length > 0 ? headingRuns : [new TextRun({
              text: element.textContent || '',
              bold: true,
              size: Math.max(16, 32 - (level - 1) * 4),
              font: this.defaultOptions.fontFamily
            })],
            heading: HeadingLevel[`HEADING_${level}`],
            spacing: { before: 240, after: 120 }
          });

        case 'p':
          const runs = await this.extractTextRuns(element, TextRun);
          const alignment = this.getAlignment(element, AlignmentType);
          return new Paragraph({
            children: runs.length > 0 ? runs : [new TextRun({ text: '' })],
            spacing: { after: 120 },
            alignment: alignment
          });

        case 'img':
          return await this.createImageParagraph(element, { Paragraph, ImageRun });

        case 'table':
          return await this.createTable(element, { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, BorderStyle });

        case 'ul':
        case 'ol':
          return await this.createList(element, tagName === 'ol', { Paragraph, TextRun });

        case 'blockquote':
          const quoteRuns = await this.extractTextRuns(element, TextRun);
          return new Paragraph({
            children: quoteRuns.length > 0 ? quoteRuns : [new TextRun({
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

        case 'div':
          // 处理 div 元素，检查是否包含子元素
          const divChildren = [];
          for (let child of element.children) {
            const childElement = await processElement(child);
            if (childElement) {
              if (Array.isArray(childElement)) {
                divChildren.push(...childElement);
              } else {
                divChildren.push(childElement);
              }
            }
          }
          
          if (divChildren.length > 0) {
            return divChildren;
          } else if (element.textContent && element.textContent.trim()) {
            const divRuns = await this.extractTextRuns(element, TextRun);
            const alignment = this.getAlignment(element, AlignmentType);
            return new Paragraph({
              children: divRuns.length > 0 ? divRuns : [new TextRun({ 
                text: element.textContent.trim(),
                font: this.defaultOptions.fontFamily,
                size: this.defaultOptions.fontSize
              })],
              spacing: { after: 120 },
              alignment: alignment
            });
          }
          return null;

        default:
          // 处理其他元素的文本内容
          if (element.textContent && element.textContent.trim()) {
            const runs = await this.extractTextRuns(element, TextRun);
            return new Paragraph({
              children: runs.length > 0 ? runs : [new TextRun({ 
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
    const processAllChildren = async (parent) => {
      for (let child of parent.children || []) {
        if (child.nodeType === 1) { // Element node
          const element = await processElement(child);
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

    await processAllChildren(doc.body);

    // 如果没有元素，添加一个空段落
    if (elements.length === 0) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: '文档内容为空' })]
      }));
    }

    return elements;
  }

  /**
   * 创建图片段落
   * @param {Element} imgElement - 图片元素
   * @param {Object} classes - DOCX 类
   * @returns {Object|null} Paragraph 对象或 null
   */
  async createImageParagraph(imgElement, classes) {
    const { Paragraph, ImageRun } = classes;
    const src = imgElement.src;
    
    if (!src || !this.imageCache.has(src)) {
      return null;
    }
    
    const imageData = this.imageCache.get(src);
    const width = Math.min(imgElement.width || imageData.width || 200, 600);
    const height = Math.min(imgElement.height || imageData.height || 200, 400);
    
    try {
      const imageRun = new ImageRun({
        data: imageData.data,
        transformation: {
          width: width,
          height: height,
        },
      });
      
      return new Paragraph({
        children: [imageRun],
        spacing: { before: 120, after: 120 }
      });
    } catch (error) {
      console.warn('Failed to create image:', error);
      return null;
    }
  }

  /**
   * 获取对齐方式
   * @param {Element} element - DOM 元素
   * @param {Object} AlignmentType - 对齐类型
   * @returns {string|undefined} 对齐方式
   */
  getAlignment(element, AlignmentType) {
    const style = element.style;
    const textAlign = style.textAlign || this.getComputedStyleValue(element, 'text-align');
    
    switch (textAlign) {
      case 'center':
        return AlignmentType.CENTER;
      case 'right':
        return AlignmentType.RIGHT;
      case 'justify':
        return AlignmentType.JUSTIFIED;
      default:
        return AlignmentType.LEFT;
    }
  }

  /**
   * 提取文本运行
   * @param {Element} element - DOM 元素
   * @param {Function} TextRun - TextRun 类
   * @returns {Array} TextRun 数组
   */
  async extractTextRuns(element, TextRun) {
    const runs = [];
    
    const traverse = async (node, style = {}) => {
      if (node.nodeType === 3) { // Text node
        const text = node.textContent;
        if (text && text.trim()) {
          runs.push(new TextRun({
            text: text,
            font: style.font || this.defaultOptions.fontFamily,
            size: style.size || this.defaultOptions.fontSize,
            ...style
          }));
        }
      } else if (node.nodeType === 1) { // Element node
        const tagName = node.tagName.toLowerCase();
        const newStyle = { ...style };
        
        // 应用标签样式
        if (tagName === 'strong' || tagName === 'b') newStyle.bold = true;
        if (tagName === 'em' || tagName === 'i') newStyle.italics = true;
        if (tagName === 'u') newStyle.underline = {};
        if (tagName === 's' || tagName === 'strike' || tagName === 'del') newStyle.strike = true;
        if (tagName === 'code') {
          newStyle.font = 'Courier New';
          newStyle.size = 20;
        }
        
        // 应用内联样式
        this.applyInlineStyles(node, newStyle);
        
        for (let child of node.childNodes) {
          await traverse(child, newStyle);
        }
      }
    };

    await traverse(element);
    return runs;
  }

  /**
   * 应用内联样式
   * @param {Element} element - DOM 元素
   * @param {Object} style - 样式对象
   */
  applyInlineStyles(element, style) {
    const inlineStyle = element.style;
    const computedStyle = window.getComputedStyle ? window.getComputedStyle(element) : {};
    
    // 字体颜色
    const color = inlineStyle.color || this.getComputedStyleValue(element, 'color');
    if (color && color !== 'rgb(0, 0, 0)' && color !== 'black') {
      const hexColor = this.rgbToHex(color);
      if (hexColor) {
        style.color = hexColor.replace('#', '');
      }
    }
    
    // 背景颜色
    const backgroundColor = inlineStyle.backgroundColor || this.getComputedStyleValue(element, 'background-color');
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      const hexBgColor = this.rgbToHex(backgroundColor);
      if (hexBgColor) {
        style.highlight = hexBgColor.replace('#', '');
      }
    }
    
    // 字体大小
    const fontSize = inlineStyle.fontSize || this.getComputedStyleValue(element, 'font-size');
    if (fontSize) {
      const size = this.parseSize(fontSize);
      if (size) {
        style.size = size;
      }
    }
    
    // 字体系列
    const fontFamily = inlineStyle.fontFamily || this.getComputedStyleValue(element, 'font-family');
    if (fontFamily) {
      style.font = fontFamily.replace(/['"]/g, '').split(',')[0].trim();
    }
    
    // 字体粗细
    const fontWeight = inlineStyle.fontWeight || this.getComputedStyleValue(element, 'font-weight');
    if (fontWeight && (fontWeight === 'bold' || parseInt(fontWeight) >= 700)) {
      style.bold = true;
    }
    
    // 字体样式
    const fontStyle = inlineStyle.fontStyle || this.getComputedStyleValue(element, 'font-style');
    if (fontStyle === 'italic') {
      style.italics = true;
    }
    
    // 文本装饰
    const textDecoration = inlineStyle.textDecoration || this.getComputedStyleValue(element, 'text-decoration');
    if (textDecoration) {
      if (textDecoration.includes('underline')) {
        style.underline = {};
      }
      if (textDecoration.includes('line-through')) {
        style.strike = true;
      }
    }
  }

  /**
   * 获取计算样式值
   * @param {Element} element - DOM 元素
   * @param {string} property - CSS 属性
   * @returns {string} 样式值
   */
  getComputedStyleValue(element, property) {
    try {
      if (window.getComputedStyle) {
        return window.getComputedStyle(element).getPropertyValue(property);
      }
      return '';
    } catch (error) {
      return '';
    }
  }

  /**
   * RGB 转 HEX
   * @param {string} rgb - RGB 颜色值
   * @returns {string|null} HEX 颜色值
   */
  rgbToHex(rgb) {
    if (!rgb) return null;
    
    // 如果已经是 HEX 格式
    if (rgb.startsWith('#')) {
      return rgb;
    }
    
    // 处理 rgb() 格式
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    
    // 处理颜色名称
    const colorNames = {
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'gray': '#808080',
      'grey': '#808080',
      'white': '#FFFFFF',
      'black': '#000000'
    };
    
    return colorNames[rgb.toLowerCase()] || null;
  }

  /**
   * 解析尺寸
   * @param {string} sizeStr - 尺寸字符串
   * @returns {number|null} Word 尺寸单位
   */
  parseSize(sizeStr) {
    if (!sizeStr) return null;
    
    const match = sizeStr.match(/(\d+(?:\.\d+)?)(px|pt|em|rem|%)?/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2] || 'px';
      
      switch (unit) {
        case 'pt':
          return value * 2; // Word 中 1pt = 2 单位
        case 'px':
          return value * 1.5; // 近似转换
        case 'em':
        case 'rem':
          return value * this.defaultOptions.fontSize;
        default:
          return value;
      }
    }
    
    return null;
  }

  /**
   * 创建表格
   * @param {Element} tableElement - 表格元素
   * @param {Object} classes - DOCX 类
   * @returns {Object} Table 对象
   */
  async createTable(tableElement, classes) {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, BorderStyle } = classes;
    
    try {
      const rows = [];
      
      for (let row of tableElement.rows) {
        const cells = [];
        
        for (let cell of row.cells) {
          const isHeader = cell.tagName.toLowerCase() === 'th';
          const cellRuns = await this.extractTextRuns(cell, TextRun);
          
          cells.push(new TableCell({
            children: [new Paragraph({
              children: cellRuns.length > 0 ? cellRuns : [new TextRun({
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
  async createList(listElement, isOrdered, classes) {
    const { Paragraph, TextRun } = classes;
    const items = [];
    
    const listItems = listElement.querySelectorAll('li');
    for (let i = 0; i < listItems.length; i++) {
      const li = listItems[i];
      const bullet = isOrdered ? `${i + 1}.` : '•';
      const liRuns = await this.extractTextRuns(li, TextRun);
      
      // 为列表项添加项目符号
      const runs = [
        new TextRun({
          text: `${bullet} `,
          font: this.defaultOptions.fontFamily,
          size: this.defaultOptions.fontSize
        }),
        ...liRuns
      ];
      
      items.push(new Paragraph({
        children: runs,
        spacing: { after: 60 }
      }));
    }

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