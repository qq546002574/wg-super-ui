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
   * PDF 转 DOCX（通过先生成PDF，然后处理内容）
   * @param {HTMLElement} element - 要转换的DOM元素
   * @param {Object} options - 配置选项
   * @returns {Promise<Blob>} DOCX Blob
   */
  async pdfToDocx(element, options = {}) {
    try {
      // 先生成PDF
      const pdfBlob = await this.htmlToPdf(element, options);
      
      // 由于纯前端PDF转DOCX比较复杂，这里我们采用一个变通的方法：
      // 1. 提取HTML内容
      // 2. 使用现有的DOCX导出器
      
      // 这里需要引入现有的DOCX导出器
      const { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } = await import('docx');
      
      // 解析HTML内容为DOCX元素
      const docxElements = this.parseHtmlToDocxElements(element);
      
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
      });

      return await Packer.toBlob(doc);
    } catch (error) {
      console.error('PDF转DOCX失败:', error);
      throw new Error('PDF转DOCX失败: ' + error.message);
    }
  }

  /**
   * 解析HTML为DOCX元素
   * @param {HTMLElement} element - HTML元素
   * @returns {Array} DOCX元素数组
   */
  parseHtmlToDocxElements(element) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = require('docx');
    const elements = [];
    
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          return new TextRun({ text });
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
                size: (32 - (level - 1) * 2) * 2
              })],
              heading: HeadingLevel[`HEADING_${level}`]
            });
            
          case 'p':
            const children = [];
            for (let child of node.childNodes) {
              const processed = processNode(child);
              if (processed) children.push(processed);
            }
            return new Paragraph({
              children: children.length > 0 ? children : [new TextRun("")]
            });
            
          case 'table':
            // 简化的表格处理
            const rows = Array.from(node.rows).map(row => {
              const cells = Array.from(row.cells).map(cell => {
                return new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun(cell.textContent)]
                  })]
                });
              });
              return new TableRow({ children: cells });
            });
            return new Table({ rows });
            
          default:
            // 递归处理子节点
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
    
    return elements.length > 0 ? elements : [new Paragraph({ children: [new TextRun("")] })];
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