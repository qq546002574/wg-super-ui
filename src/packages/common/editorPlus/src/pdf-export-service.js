/**
 * PDF 导出服务
 * 支持 HTML 转 PDF，PDF 转 DOCX 等功能
 */
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';

class PdfExportService {
  constructor() {
    this.defaultOptions = {
      format: 'a4',
      orientation: 'portrait',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      fontSize: 12,
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      quality: 0.95,
      useCORS: true,
      allowTaint: true
    };
  }

  /**
   * HTML 转 PDF
   * @param {HTMLElement} element - 要转换的DOM元素
   * @param {Object} options - 配置选项
   * @returns {Promise<Blob>} PDF Blob
   */
  async htmlToPdf(element, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    try {
      // 创建canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: config.useCORS,
        allowTaint: config.allowTaint,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // 创建PDF
      const imgData = canvas.toDataURL('image/png', config.quality);
      const pdf = new jsPDF({
        orientation: config.orientation,
        unit: 'mm',
        format: config.format
      });

      // 计算图片在PDF中的尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginX = config.margin.left;
      const marginY = config.margin.top;
      const availableWidth = pdfWidth - config.margin.left - config.margin.right;
      const availableHeight = pdfHeight - config.margin.top - config.margin.bottom;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(availableWidth / (imgWidth * 0.264583), availableHeight / (imgHeight * 0.264583));
      
      const scaledWidth = imgWidth * 0.264583 * ratio;
      const scaledHeight = imgHeight * 0.264583 * ratio;

      // 如果内容高度超过一页，需要分页
      if (scaledHeight > availableHeight) {
        const pageCount = Math.ceil(scaledHeight / availableHeight);
        const pageHeight = imgHeight / pageCount;
        
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const sourceY = i * pageHeight;
          const sourceHeight = Math.min(pageHeight, imgHeight - sourceY);
          
          // 创建临时canvas来截取部分图片
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imgWidth;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          const tempImgData = tempCanvas.toDataURL('image/png', config.quality);
          
          pdf.addImage(
            tempImgData,
            'PNG',
            marginX,
            marginY,
            scaledWidth,
            sourceHeight * 0.264583 * ratio
          );
        }
      } else {
        pdf.addImage(imgData, 'PNG', marginX, marginY, scaledWidth, scaledHeight);
      }

      return pdf.output('blob');
    } catch (error) {
      console.error('HTML转PDF失败:', error);
      throw new Error('PDF生成失败: ' + error.message);
    }
  }

  /**
   * 使用浏览器原生打印生成PDF
   * @param {HTMLElement} element - 要打印的DOM元素
   * @param {Object} options - 配置选项
   * @returns {Promise<void>}
   */
  async printToPdf(element, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    try {
      // 创建打印样式
      const printStyles = this.createPrintStyles(config);
      
      // 创建隐藏的iframe用于打印
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'absolute';
      printIframe.style.top = '-9999px';
      printIframe.style.left = '-9999px';
      printIframe.style.width = '210mm';
      printIframe.style.height = '297mm';
      document.body.appendChild(printIframe);
      
      // 设置iframe内容
      const iframeDocument = printIframe.contentDocument || printIframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${config.title || 'PDF导出'}</title>
          <style>${printStyles}</style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
        </html>
      `);
      iframeDocument.close();
      
      // 等待iframe加载完成
      return new Promise((resolve, reject) => {
        printIframe.onload = () => {
          try {
            // 调用打印，用户可选择保存为PDF
            printIframe.contentWindow.print();
            
            // 延迟移除iframe
            setTimeout(() => {
              document.body.removeChild(printIframe);
              resolve();
            }, 1000);
          } catch (error) {
            document.body.removeChild(printIframe);
            reject(error);
          }
        };
      });
    } catch (error) {
      console.error('打印PDF失败:', error);
      throw new Error('打印PDF失败: ' + error.message);
    }
  }

  /**
   * HTML 转 DOCX（直接转换，不经过PDF）
   * @param {HTMLElement} element - 要转换的DOM元素
   * @param {Object} options - 配置选项
   * @returns {Promise<Blob>} DOCX Blob
   */
  async pdfToDocx(element, options = {}) {
    try {
      // 动态导入 docx 库
      const { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = await import('docx');
      
      // 解析HTML内容为DOCX元素
      const docxElements = await this.parseHtmlToDocxElements(element, { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle });
      
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                width: 11906,  // A4宽度
                height: 16838, // A4高度
              },
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: docxElements
        }],
        creator: "wg-editor-plus",
        title: options.title || "导出文档",
        description: "由 wg-editor-plus 生成的文档"
      });

      return await Packer.toBlob(doc);
    } catch (error) {
      console.error('HTML转DOCX失败:', error);
      throw new Error('DOCX生成失败: ' + error.message);
    }
  }

  /**
   * 解析HTML为DOCX元素
   * @param {HTMLElement} element - HTML元素
   * @param {Object} docxClasses - DOCX类库对象
   * @returns {Array} DOCX元素数组
   */
  async parseHtmlToDocxElements(element, docxClasses) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } = docxClasses;
    const elements = [];
    
    const getTextStyle = (node) => {
      const style = {
        bold: false,
        italics: false,
        underline: undefined,
        color: undefined,
        size: 24 // 默认12pt
      };
      
      // 检查节点标签
      let currentNode = node;
      while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        const tagName = currentNode.tagName.toLowerCase();
        if (tagName === 'strong' || tagName === 'b') {
          style.bold = true;
        }
        if (tagName === 'em' || tagName === 'i') {
          style.italics = true;
        }
        if (tagName === 'u') {
          style.underline = {};
        }
        currentNode = currentNode.parentNode;
      }
      
      return style;
    };
    
    const processTextNode = (node, parentStyle = {}) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          return new TextRun({ 
            text,
            ...parentStyle
          });
        }
        return null;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const style = { ...parentStyle };
        
        // 更新样式
        if (tagName === 'strong' || tagName === 'b') style.bold = true;
        if (tagName === 'em' || tagName === 'i') style.italics = true;
        if (tagName === 'u') style.underline = {};
        if (tagName === 'code') {
          style.font = 'Courier New';
          style.size = 20; // 10pt
        }
        if (tagName === 'mark') {
          style.highlight = 'yellow';
        }
        
        const children = [];
        for (let child of node.childNodes) {
          const processed = processTextNode(child, style);
          if (processed) {
            children.push(processed);
          }
        }
        return children;
      }
      
      return null;
    };
    
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          return new Paragraph({
            children: [new TextRun({ text })]
          });
        }
        return null;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
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
                text: node.textContent,
                bold: true,
                size: (32 - (level - 1) * 2),
                font: 'Microsoft YaHei'
              })],
              heading: HeadingLevel[`HEADING_${level}`],
              spacing: { before: 240, after: 120 }
            });
            
          case 'p':
            const textRuns = [];
            for (let child of node.childNodes) {
              const processed = processTextNode(child);
              if (processed) {
                if (Array.isArray(processed)) {
                  textRuns.push(...processed);
                } else {
                  textRuns.push(processed);
                }
              }
            }
            return new Paragraph({
              children: textRuns.length > 0 ? textRuns : [new TextRun("")],
              spacing: { after: 120 }
            });
            
          case 'table':
            try {
              const rows = Array.from(node.rows).map(row => {
                const cells = Array.from(row.cells).map((cell, index) => {
                  const isHeader = cell.tagName.toLowerCase() === 'th';
                  const cellChildren = [];
                  
                  for (let child of cell.childNodes) {
                    const processed = processTextNode(child, isHeader ? { bold: true } : {});
                    if (processed) {
                      if (Array.isArray(processed)) {
                        cellChildren.push(...processed);
                      } else {
                        cellChildren.push(processed);
                      }
                    }
                  }
                  
                  return new TableCell({
                    children: [new Paragraph({
                      children: cellChildren.length > 0 ? cellChildren : [new TextRun(cell.textContent || "")]
                    })],
                    width: {
                      size: 2500, // 固定宽度
                      type: WidthType.DXA
                    },
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
                  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
                },
                margins: {
                  bottom: 240
                }
              });
            } catch (tableError) {
              console.warn('表格处理失败:', tableError);
              return new Paragraph({
                children: [new TextRun({ text: node.textContent || "" })]
              });
            }
            
          case 'ul':
          case 'ol':
            const listItems = [];
            const listItems_nodes = Array.from(node.querySelectorAll('li'));
            listItems_nodes.forEach((li, index) => {
              const bullet = tagName === 'ul' ? '•' : `${index + 1}.`;
              listItems.push(new Paragraph({
                children: [new TextRun({ text: `${bullet} ${li.textContent}` })],
                spacing: { after: 60 }
              }));
            });
            return listItems;
            
          case 'blockquote':
            return new Paragraph({
              children: [new TextRun({
                text: node.textContent,
                italics: true,
                color: "666666"
              })],
              indent: { left: 720 },
              spacing: { before: 120, after: 120 }
            });
            
          case 'pre':
          case 'code':
            return new Paragraph({
              children: [new TextRun({
                text: node.textContent,
                font: 'Courier New',
                size: 20
              })],
              spacing: { before: 120, after: 120 }
            });
            
          case 'br':
            return new Paragraph({
              children: [new TextRun({ text: "" })]
            });
            
          case 'hr':
            return new Paragraph({
              children: [new TextRun({ text: "──────────────────────────────────" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 120 }
            });
            
          default:
            // 对于其他元素，递归处理子节点
            const childElements = [];
            for (let child of node.childNodes) {
              const processed = processNode(child);
              if (processed) {
                if (Array.isArray(processed)) {
                  childElements.push(...processed);
                } else {
                  childElements.push(processed);
                }
              }
            }
            return childElements;
        }
      }
      return null;
    };
    
    // 处理主要内容
    for (let child of element.childNodes) {
      const processed = processNode(child);
      if (processed) {
        if (Array.isArray(processed)) {
          elements.push(...processed);
        } else {
          elements.push(processed);
        }
      }
    }
    
    // 确保至少有一个段落
    if (elements.length === 0) {
      elements.push(new Paragraph({ 
        children: [new TextRun({ text: "文档内容为空" })] 
      }));
    }
    
    return elements;
  }

  /**
   * 创建打印样式
   * @param {Object} config - 配置选项
   * @returns {string} CSS样式字符串
   */
  createPrintStyles(config) {
    return `
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: ${config.fontFamily};
        font-size: ${config.fontSize}pt;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: ${config.margin.top}mm ${config.margin.right}mm ${config.margin.bottom}mm ${config.margin.left}mm;
        background: white;
      }
      
      @page {
        size: ${config.format} ${config.orientation};
        margin: ${config.margin.top}mm ${config.margin.right}mm ${config.margin.bottom}mm ${config.margin.left}mm;
      }
      
      /* 隐藏编辑器工具栏 */
      .control-group,
      .button-group {
        display: none !important;
      }
      
      /* 优化表格样式 */
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1em;
        page-break-inside: avoid;
      }
      
      table, th, td {
        border: 1px solid #ddd;
      }
      
      th, td {
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }
      
      th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      
      /* 图片样式 */
      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
      
      /* 标题样式 */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      h1 { font-size: 24pt; }
      h2 { font-size: 20pt; }
      h3 { font-size: 16pt; }
      h4 { font-size: 14pt; }
      h5 { font-size: 12pt; }
      h6 { font-size: 11pt; }
      
      /* 段落样式 */
      p {
        margin-bottom: 1em;
        orphans: 3;
        widows: 3;
      }
      
      /* 代码块样式 */
      pre {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        overflow-wrap: break-word;
        page-break-inside: avoid;
        font-family: "Courier New", monospace;
        font-size: 10pt;
      }
      
      code {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: "Courier New", monospace;
        font-size: 10pt;
      }
      
      /* 引用样式 */
      blockquote {
        border-left: 3px solid #ddd;
        margin-left: 0;
        padding-left: 10px;
        color: #666;
        font-style: italic;
      }
      
      /* 列表样式 */
      ul, ol {
        margin-bottom: 1em;
        padding-left: 2em;
      }
      
      li {
        margin-bottom: 0.5em;
      }
      
      /* 分页控制 */
      .page-break {
        page-break-before: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
      
      /* 链接样式 */
      a {
        color: #0066cc;
        text-decoration: underline;
      }
      
      /* 高亮样式 */
      mark {
        background-color: yellow;
        padding: 1px 2px;
      }
      
      /* 流程图容器样式 */
      .upload-container {
        page-break-inside: avoid;
        margin: 1em 0;
        text-align: center;
      }
      
      .upload-container img {
        max-width: 100%;
        height: auto;
      }
      
      /* 隐藏交互元素 */
      .image-actions,
      button,
      .el-dialog {
        display: none !important;
      }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        * {
          text-shadow: none !important;
          box-shadow: none !important;
        }
      }
    `;
  }

  /**
   * 下载文件
   * @param {Blob} blob - 文件blob
   * @param {string} filename - 文件名
   */
  downloadFile(blob, filename) {
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
  }
}

export default PdfExportService;