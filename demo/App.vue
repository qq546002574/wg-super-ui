<template>
  <div>
    <wg-button primary icon="icon-xinzeng1" @click="readOnly = !readOnly">切换只读</wg-button>
    <wg-button type="primary" @click="exportWord">导出Word (基础版)</wg-button>
    <wg-button type="success" @click="exportWordAdvanced">导出Word (增强版)</wg-button>
    <wg-button type="info" @click="exportWithCustomStyle">导出Word (自定义样式)</wg-button>
    <wg-button type="warning" @click="getEditorContent">获取编辑器内容</wg-button>
    <wg-editor-plus
        ref="editor"
        customUpload
        :readOnly="readOnly"
        style="height: 500px"></wg-editor-plus>
    
    <!-- 内容预览区域 -->
    <div v-if="previewContent" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
      <h3>编辑器内容预览：</h3>
      <div style="background: #f5f5f5; padding: 10px; margin: 10px 0;">
        <strong>HTML内容：</strong>
        <pre style="white-space: pre-wrap; font-size: 12px;">{{ previewContent.html }}</pre>
      </div>
      <div style="background: #f5f5f5; padding: 10px; margin: 10px 0;">
        <strong>纯文本内容：</strong>
        <pre style="white-space: pre-wrap;">{{ previewContent.text }}</pre>
      </div>
      <div style="background: #f5f5f5; padding: 10px; margin: 10px 0;">
        <strong>JSON内容：</strong>
        <pre style="white-space: pre-wrap; font-size: 12px;">{{ JSON.stringify(previewContent.json, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun, ExternalHyperlink, BorderStyle, ShadingType } from 'docx';
import JSZip from 'jszip';

export default {
  name: 'App',
  data() {
    return {
      readOnly: false,
      previewContent: null
    }
  },
  methods: {
    // 获取编辑器内容的方法
    getEditorContent() {
      try {
        const editor = this.$refs.editor.editor;
        this.previewContent = {
          html: editor.getHTML(),
          text: editor.getText(),
          json: editor.getJSON()
        };
        this.$message.success('内容获取成功！请查看下方预览');
      } catch (error) {
        console.error('获取编辑器内容失败:', error);
        this.$message.error('获取编辑器内容失败');
      }
    },

    // 处理文本节点
    processTextNode(node) {
      if (!node.textContent.trim()) return null;
      return new TextRun({
        text: node.textContent.replace(/\s+/g, ' '),
        size: 24 * 2,
        font: 'SimSun'
      });
    },

    // 处理带格式的文本节点
    processFormattedTextNode(node, parentStyles = {}) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.trim()) return null;
        return new TextRun({
          text: node.textContent.replace(/\s+/g, ' '),
          size: parentStyles.fontSize || 24,
          font: parentStyles.fontFamily || 'SimSun',
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
          if (processed) children.push(processed);
        }
        return children;
      }
      return null;
    },

    // 颜色转换工具
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
    },

    // 增强的表格处理
    processTable(tableNode) {
      const rows = Array.from(tableNode.rows).map(row => {
        const cells = Array.from(row.cells).map(cell => {
          // 检查是否是表头单元格
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
    },

    // 增强的段落处理
    processParagraph(node, style) {
      const children = [];
      
      for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const textRun = this.processTextNode(child);
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
    },

    // 处理列表
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
    },

    // 处理标题
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
    },

    // 处理链接
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
    },

    // 主处理函数
    processNode(node) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          return this.processTextNode(node);

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
                // 递归处理div的子元素
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
    },

    // HTML解析为Word元素
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
    },

    // 基础版导出Word文档（原有功能）
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
        link.download = '导出文档_基础版.docx';

        // 6. 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 7. 清理资源
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        
        this.$message.success('基础版Word文档导出成功！');
      } catch (error) {
        console.error('导出失败:', error);
        this.$message.error('导出失败: ' + error.message);
      }
    },

    // 增强版导出Word文档（使用JSZip进行更多控制）
    async exportWordAdvanced() {
      try {
        const editorContent = this.$refs.editor.editor.getHTML();
        if (!editorContent?.trim()) {
          throw new Error('编辑器内容为空');
        }

        // 创建带有自定义样式的文档
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
                  font: "Arial"
                },
                paragraph: {
                  spacing: { before: 400, after: 400 },
                  alignment: AlignmentType.CENTER
                }
              },
              {
                id: "customSubtitle",
                name: "Custom Subtitle",
                basedOn: "Normal",
                next: "Normal",
                run: {
                  size: 24,
                  italics: true,
                  color: "666666",
                  font: "Arial"
                },
                paragraph: {
                  spacing: { before: 200, after: 200 }
                }
              }
            ]
          },
          sections: [{
            properties: {
              page: {
                size: {
                  width: 11906,
                  height: 16838,
                },
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: [
              // 添加文档标题
              new Paragraph({
                children: [new TextRun({
                  text: "wg-editor-plus 导出文档",
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
              // 分割线
              new Paragraph({
                children: [new TextRun("═══════════════════════════════════════")],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 400 }
              }),
              // 解析后的内容
              ...this.parseHtmlToDocxElements(editorContent)
            ]
          }],
        });

        // 使用JSZip生成文档
        const buffer = await Packer.toBuffer(doc);
        const zip = new JSZip();
        
        // 可以在这里添加额外的文件到ZIP中
        zip.file("document.docx", buffer);
        zip.file("readme.txt", "这是由wg-editor-plus生成的Word文档\n导出时间: " + new Date().toISOString());
        
        // 生成ZIP文件
        const zipBuffer = await zip.generateAsync({type: "blob"});
        
        // 但为了简单起见，我们直接下载docx文件
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '导出文档_增强版.docx';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        
        this.$message.success('增强版Word文档导出成功！');
      } catch (error) {
        console.error('增强版导出失败:', error);
        this.$message.error('增强版导出失败: ' + error.message);
      }
    },

    // 自定义样式导出
    async exportWithCustomStyle() {
      try {
        const editorContent = this.$refs.editor.editor.getHTML();
        if (!editorContent?.trim()) {
          throw new Error('编辑器内容为空');
        }

        const doc = new Document({
          styles: {
            characterStyles: [
              {
                id: "strikeUnderlineCharacter",
                name: "Strike Underline Character",
                basedOn: "DefaultParagraphFont",
                run: {
                  strike: true,
                  underline: {
                    type: "single"
                  }
                }
              }
            ],
            paragraphStyles: [
              {
                id: "wellSpaced",
                name: "Well Spaced",
                basedOn: "Normal",
                quickFormat: true,
                paragraph: {
                  spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 }
                }
              },
              {
                id: "customHeading1",
                name: "Custom Heading 1",
                basedOn: "Normal",
                next: "Normal",
                run: {
                  size: 28,
                  bold: true,
                  color: "FF6600",
                  font: "Microsoft YaHei"
                },
                paragraph: {
                  spacing: { before: 600, after: 300 },
                  border: {
                    bottom: {
                      color: "FF6600",
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
                size: {
                  width: 11906,
                  height: 16838,
                },
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: [
              new Paragraph({
                children: [new TextRun({
                  text: "自定义样式文档",
                  size: 36,
                  bold: true,
                  color: "FF6600",
                  font: "Microsoft YaHei"
                })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 600 },
                border: {
                  bottom: {
                    color: "FF6600",
                    space: 1,
                    style: BorderStyle.DOUBLE,
                    size: 6
                  }
                }
              }),
              ...this.parseHtmlToDocxElements(editorContent),
              // 添加页脚信息
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
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '导出文档_自定义样式.docx';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        
        this.$message.success('自定义样式Word文档导出成功！');
      } catch (error) {
        console.error('自定义样式导出失败:', error);
        this.$message.error('自定义样式导出失败: ' + error.message);
      }
    }
  }
}
</script>
