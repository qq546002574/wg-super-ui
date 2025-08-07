/**
 * wg-editor-plus DOCX导出功能示例
 * 
 * 本文件演示了如何使用 docx + JSZip 实现纯前端 DOCX 文档生成
 * 支持从 wg-editor-plus 富文本编辑器获取 HTML 内容并转换为 Word 文档
 */

import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun, ExternalHyperlink, BorderStyle, ShadingType } from 'docx';
import JSZip from 'jszip';

/**
 * DOCX 导出器类
 * 提供多种导出方式和自定义选项
 */
class DocxExporter {
  constructor(editorRef) {
    this.editorRef = editorRef;
    this.defaultOptions = {
      pageSize: {
        width: 11906,  // A4宽度
        height: 16838, // A4高度
      },
      margins: {
        top: 1440,     // 1英寸 = 1440缇
        right: 1440,
        bottom: 1440,
        left: 1440,
      },
      fontSize: 24,    // 默认字体大小 (12pt * 2)
      fontFamily: 'Microsoft YaHei',
    };
  }

  /**
   * 获取编辑器内容
   * @returns {Object} 包含 html、text、json 格式的内容
   */
  getEditorContent() {
    if (!this.editorRef || !this.editorRef.editor) {
      throw new Error('编辑器引用无效');
    }
    
    const editor = this.editorRef.editor;
    return {
      html: editor.getHTML(),
      text: editor.getText(),
      json: editor.getJSON()
    };
  }

  /**
   * 预处理 HTML 内容
   * @param {string} html - 原始 HTML 内容
   * @returns {string} 清理后的 HTML 内容
   */
  preprocessHtml(html) {
    return html
      .replace(/<br\s*\/?>/gi, '</p><p>')
      .replace(/<div[^>]*>/gi, '<p>')
      .replace(/<\/div>/gi, '</p>')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\n/g, ' ')
      .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
  }

  /**
   * 颜色转换工具
   * @param {string} color - CSS 颜色值
   * @returns {string|undefined} 十六进制颜色值
   */
  convertColorToHex(color) {
    if (!color) return undefined;
    if (color.startsWith('#')) return color.substring(1);
    
    // 处理 rgb() 格式
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      return r + g + b;
    }
    return undefined;
  }

  /**
   * 处理带格式的文本节点
   * @param {Node} node - DOM 节点
   * @param {Object} parentStyles - 父级样式
   * @returns {TextRun|Array<TextRun>|null} 文本运行对象
   */
  processFormattedTextNode(node, parentStyles = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return null;
      return new TextRun({
        text: node.textContent.replace(/\s+/g, ' '),
        size: parentStyles.fontSize || this.defaultOptions.fontSize,
        font: parentStyles.fontFamily || this.defaultOptions.fontFamily,
        bold: parentStyles.bold || false,
        italics: parentStyles.italics || false,
        underline: parentStyles.underline ? {} : undefined,
        color: parentStyles.color || undefined
      });
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      const computedStyle = window.getComputedStyle ? window.getComputedStyle(node) : {};
      
      // 解析样式
      const styles = {
        ...parentStyles,
        bold: parentStyles.bold || tagName === 'strong' || tagName === 'b' || computedStyle.fontWeight === 'bold',
        italics: parentStyles.italics || tagName === 'em' || tagName === 'i' || computedStyle.fontStyle === 'italic',
        underline: parentStyles.underline || tagName === 'u',
        color: computedStyle.color ? this.convertColorToHex(computedStyle.color) : parentStyles.color
      };

      // 递归处理子节点
      const children = [];
      for (let child of node.childNodes) {
        const processed = this.processFormattedTextNode(child, styles);
        if (processed) {
          if (Array.isArray(processed)) {
            children.push(...processed);
          } else {
            children.push(processed);
          }
        }
      }
      return children;
    }
    return null;
  }

  /**
   * 处理表格
   * @param {HTMLTableElement} tableNode - 表格元素
   * @returns {Table} 表格对象
   */
  processTable(tableNode) {
    const rows = Array.from(tableNode.rows).map(row => {
      const cells = Array.from(row.cells).map(cell => {
        const isHeader = cell.tagName.toLowerCase() === 'th';
        const cellContent = this.parseHtmlToDocxElements(cell.innerHTML);
        
        return new TableCell({
          children: cellContent.length > 0 ? cellContent : [new Paragraph({ children: [new TextRun("")] })],
          width: {
            size: Math.floor(100 / row.cells.length),
            type: WidthType.PERCENTAGE
          },
          shading: isHeader ? {
            type: ShadingType.SOLID,
            color: "E6E6E6"
          } : undefined,
          margins: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100
          }
        });
      });
      return new TableRow({ children: cells });
    });
    
    return new Table({ 
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 }
      }
    });
  }

  /**
   * 处理段落
   * @param {HTMLElement} node - 段落元素
   * @param {Object} style - 样式对象
   * @returns {Paragraph} 段落对象
   */
  processParagraph(node, style) {
    const children = [];
    
    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const textRun = this.processFormattedTextNode(child);
        if (textRun) children.push(textRun);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const processed = this.processFormattedTextNode(child);
        if (Array.isArray(processed)) {
          children.push(...processed);
        } else if (processed) {
          children.push(processed);
        }
      }
    }

    return new Paragraph({
      children: children.length > 0 ? children : [new TextRun("")],
      alignment: style.textAlign === 'center' ? AlignmentType.CENTER : 
                style.textAlign === 'right' ? AlignmentType.RIGHT : 
                style.textAlign === 'justify' ? AlignmentType.JUSTIFIED :
                AlignmentType.LEFT,
      spacing: { line: 360, before: 200, after: 200 }
    });
  }

  /**
   * 处理标题
   * @param {HTMLElement} node - 标题元素
   * @param {number} level - 标题级别
   * @returns {Paragraph} 段落对象
   */
  processHeading(node, level) {
    const children = [];
    for (let child of node.childNodes) {
      const processed = this.processFormattedTextNode(child, {
        fontSize: (32 - (level - 1) * 2) * 2,
        bold: true
      });
      if (Array.isArray(processed)) {
        children.push(...processed);
      } else if (processed) {
        children.push(processed);
      }
    }

    return new Paragraph({
      children: children.length > 0 ? children : [new TextRun("")],
      heading: HeadingLevel[`HEADING_${level}`],
      spacing: { before: 400, after: 200 }
    });
  }

  /**
   * 处理链接
   * @param {HTMLAnchorElement} node - 链接元素
   * @returns {ExternalHyperlink|TextRun} 链接或文本对象
   */
  processLink(node) {
    const href = node.getAttribute('href');
    const text = node.textContent || href;
    
    if (href) {
      return new ExternalHyperlink({
        children: [new TextRun({
          text: text,
          style: "Hyperlink",
          color: "0000FF",
          underline: {}
        })],
        link: href
      });
    } else {
      return new TextRun({ text: text });
    }
  }

  /**
   * 处理列表项
   * @param {HTMLLIElement} node - 列表项元素
   * @param {boolean} isOrdered - 是否为有序列表
   * @returns {Paragraph} 段落对象
   */
  processListItem(node, isOrdered = false) {
    const children = [];
    for (let child of node.childNodes) {
      const processed = this.processFormattedTextNode(child);
      if (Array.isArray(processed)) {
        children.push(...processed);
      } else if (processed) {
        children.push(processed);
      }
    }

    return new Paragraph({
      children: children.length > 0 ? children : [new TextRun("")],
      bullet: isOrdered ? undefined : { level: 0 },
      numbering: isOrdered ? { reference: "default-numbering", level: 0 } : undefined,
      spacing: { before: 100, after: 100 }
    });
  }

  /**
   * 处理DOM节点
   * @param {Node} node - DOM节点
   * @returns {Paragraph|Table|Array|null} 文档元素
   */
  processNode(node) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return this.processFormattedTextNode(node);

      case Node.ELEMENT_NODE:
        const style = window.getComputedStyle ? window.getComputedStyle(node) : {};
        const tagName = node.tagName.toLowerCase();

        switch (tagName) {
          case 'p':
            return this.processParagraph(node, style);
          
          case 'div':
            if (node.children.length === 0) {
              return this.processParagraph(node, style);
            } else {
              const elements = [];
              for (let child of node.childNodes) {
                const processed = this.processNode(child);
                if (processed) {
                  if (Array.isArray(processed)) {
                    elements.push(...processed);
                  } else {
                    elements.push(processed);
                  }
                }
              }
              return elements;
            }
          
          case 'table':
            return this.processTable(node);

          case 'ul':
            const ulItems = [];
            for (let li of node.querySelectorAll('li')) {
              ulItems.push(this.processListItem(li, false));
            }
            return ulItems;

          case 'ol':
            const olItems = [];
            for (let li of node.querySelectorAll('li')) {
              olItems.push(this.processListItem(li, true));
            }
            return olItems;

          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return this.processHeading(node, parseInt(tagName.charAt(1)));

          case 'a':
            return this.processLink(node);

          case 'br':
            return new Paragraph({ children: [new TextRun("")] });

          case 'hr':
            return new Paragraph({
              children: [new TextRun("────────────────────────────────")],
              alignment: AlignmentType.CENTER
            });

          case 'blockquote':
            return new Paragraph({
              children: [new TextRun({
                text: node.textContent,
                italics: true
              })],
              indent: { left: 720 },
              border: {
                left: {
                  color: "CCCCCC",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6
                }
              }
            });

          default:
            if (node.childNodes?.length) {
              return this.processParagraph(node, style);
            }
        }
        break;
    }
    return null;
  }

  /**
   * 解析HTML为Word元素
   * @param {string} html - HTML内容
   * @returns {Array} Word文档元素数组
   */
  parseHtmlToDocxElements(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = [];

    Array.from(doc.body.childNodes).forEach(node => {
      const element = this.processNode(node);
      if (element) {
        if (Array.isArray(element)) {
          elements.push(...element);
        } else {
          elements.push(element);
        }
      }
    });

    return elements.length > 0 ? elements : [new Paragraph({ children: [new TextRun("")] })];
  }

  /**
   * 基础导出方法
   * @param {string} filename - 文件名
   * @param {Object} options - 自定义选项
   * @returns {Promise<void>}
   */
  async exportBasic(filename = '导出文档_基础版.docx', options = {}) {
    try {
      const content = this.getEditorContent();
      if (!content.html?.trim()) {
        throw new Error('编辑器内容为空');
      }

      const cleanContent = this.preprocessHtml(content.html);
      const mergedOptions = { ...this.defaultOptions, ...options };

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: mergedOptions.pageSize,
              margin: mergedOptions.margins,
            },
          },
          children: this.parseHtmlToDocxElements(cleanContent)
        }],
      });

      const blob = await Packer.toBlob(doc);
      this.downloadFile(blob, filename);
      
      return { success: true, message: '基础版Word文档导出成功！' };
    } catch (error) {
      console.error('基础导出失败:', error);
      throw new Error('基础导出失败: ' + error.message);
    }
  }

  /**
   * 增强导出方法（带样式和元数据）
   * @param {string} filename - 文件名
   * @param {Object} options - 自定义选项
   * @returns {Promise<void>}
   */
  async exportAdvanced(filename = '导出文档_增强版.docx', options = {}) {
    try {
      const content = this.getEditorContent();
      if (!content.html?.trim()) {
        throw new Error('编辑器内容为空');
      }

      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "customTitle",
              name: "Custom Title",
              basedOn: "Normal",
              next: "Normal",
              run: {
                size: 32,
                bold: true,
                color: "2E74B5",
                font: "Microsoft YaHei"
              },
              paragraph: {
                spacing: { before: 400, after: 400 },
                alignment: AlignmentType.CENTER
              }
            }
          ]
        },
        sections: [{
          properties: {
            page: {
              size: this.defaultOptions.pageSize,
              margin: this.defaultOptions.margins,
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({
                text: options.title || "wg-editor-plus 导出文档",
                size: 32,
                bold: true,
                color: "2E74B5",
                font: "Microsoft YaHei"
              })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 400 }
            }),
            new Paragraph({
              children: [new TextRun({
                text: `导出时间: ${new Date().toLocaleString()}`,
                size: 20,
                italics: true,
                color: "666666",
                font: "Microsoft YaHei"
              })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 600 }
            }),
            new Paragraph({
              children: [new TextRun("═══════════════════════════════════════")],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 }
            }),
            ...this.parseHtmlToDocxElements(content.html)
          ]
        }],
      });

      // 使用JSZip进行额外处理
      const buffer = await Packer.toBuffer(doc);
      const zip = new JSZip();
      
      // 添加主文档
      zip.file("document.docx", buffer);
      
      // 添加元数据文件
      zip.file("metadata.json", JSON.stringify({
        title: options.title || "wg-editor-plus 导出文档",
        exportTime: new Date().toISOString(),
        contentLength: content.text.length,
        wordCount: content.text.split(/\s+/).length,
        version: "1.0.0"
      }, null, 2));
      
      // 添加说明文件
      zip.file("readme.txt", `wg-editor-plus 导出文档包\n\n` +
        `导出时间: ${new Date().toLocaleString()}\n` +
        `文档长度: ${content.text.length} 字符\n` +
        `字数统计: ${content.text.split(/\s+/).length} 词\n\n` +
        `文件说明:\n` +
        `- document.docx: 主要的Word文档\n` +
        `- metadata.json: 文档元数据\n` +
        `- readme.txt: 说明文件`);

      // 直接下载docx文件
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      this.downloadFile(blob, filename);
      
      return { success: true, message: '增强版Word文档导出成功！' };
    } catch (error) {
      console.error('增强导出失败:', error);
      throw new Error('增强导出失败: ' + error.message);
    }
  }

  /**
   * 自定义样式导出
   * @param {string} filename - 文件名
   * @param {Object} styleOptions - 样式选项
   * @returns {Promise<void>}
   */
  async exportWithCustomStyle(filename = '导出文档_自定义样式.docx', styleOptions = {}) {
    try {
      const content = this.getEditorContent();
      if (!content.html?.trim()) {
        throw new Error('编辑器内容为空');
      }

      const styles = {
        titleColor: styleOptions.titleColor || "FF6600",
        titleSize: styleOptions.titleSize || 36,
        fontFamily: styleOptions.fontFamily || "Microsoft YaHei",
        ...styleOptions
      };

      const doc = new Document({
        styles: {
          characterStyles: [
            {
              id: "strikeUnderlineCharacter",
              name: "Strike Underline Character",
              basedOn: "DefaultParagraphFont",
              run: {
                strike: true,
                underline: { type: "single" }
              }
            }
          ],
          paragraphStyles: [
            {
              id: "customHeading1",
              name: "Custom Heading 1",
              basedOn: "Normal",
              next: "Normal",
              run: {
                size: 28,
                bold: true,
                color: styles.titleColor,
                font: styles.fontFamily
              },
              paragraph: {
                spacing: { before: 600, after: 300 },
                border: {
                  bottom: {
                    color: styles.titleColor,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6
                  }
                }
              }
            }
          ]
        },
        sections: [{
          properties: {
            page: {
              size: this.defaultOptions.pageSize,
              margin: this.defaultOptions.margins,
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({
                text: styles.title || "自定义样式文档",
                size: styles.titleSize,
                bold: true,
                color: styles.titleColor,
                font: styles.fontFamily
              })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 600 },
              border: {
                bottom: {
                  color: styles.titleColor,
                  space: 1,
                  style: BorderStyle.DOUBLE,
                  size: 6
                }
              }
            }),
            ...this.parseHtmlToDocxElements(content.html),
            new Paragraph({
              children: [new TextRun({
                text: "─────────────────────────────────────────",
                color: "CCCCCC"
              })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 800, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({
                text: "Powered by wg-editor-plus & docx & JSZip",
                size: 18,
                italics: true,
                color: "999999",
                font: "Arial"
              })],
              alignment: AlignmentType.CENTER
            })
          ]
        }],
      });

      const blob = await Packer.toBlob(doc);
      this.downloadFile(blob, filename);
      
      return { success: true, message: '自定义样式Word文档导出成功！' };
    } catch (error) {
      console.error('自定义样式导出失败:', error);
      throw new Error('自定义样式导出失败: ' + error.message);
    }
  }

  /**
   * 下载文件
   * @param {Blob} blob - 文件blob
   * @param {string} filename - 文件名
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }
}

/**
 * 使用示例
 * 
 * // 在Vue组件中使用
 * const exporter = new DocxExporter(this.$refs.editor);
 * 
 * // 基础导出
 * await exporter.exportBasic('my-document.docx');
 * 
 * // 增强导出
 * await exporter.exportAdvanced('enhanced-document.docx', {
 *   title: '我的自定义标题'
 * });
 * 
 * // 自定义样式导出
 * await exporter.exportWithCustomStyle('styled-document.docx', {
 *   titleColor: 'FF0000',
 *   titleSize: 40,
 *   fontFamily: 'Arial',
 *   title: '红色大标题文档'
 * });
 */

export default DocxExporter;