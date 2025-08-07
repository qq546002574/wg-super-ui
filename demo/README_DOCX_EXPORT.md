# wg-editor-plus DOCX 导出功能

这个项目实现了从 `wg-editor-plus` 富文本编辑器导出 Word (DOCX) 文档的功能，采用纯前端解决方案，使用 `docx` 和 `JSZip` 库。

## 功能特性

### ✨ 主要功能
- **纯前端实现**: 无需服务器端处理，完全在浏览器中生成 DOCX 文件
- **多种导出方式**: 基础导出、增强导出、自定义样式导出
- **HTML 转换**: 将 wg-editor-plus 的 HTML 内容转换为 Word 文档结构
- **样式保持**: 保留文本格式、颜色、对齐方式等样式
- **表格支持**: 完整的表格结构和样式转换
- **图像处理**: 支持图片导出（base64 和链接）
- **链接保持**: 保留超链接并在 Word 中正确显示

### 📋 支持的元素
- 段落（p）和 div
- 标题（h1-h6）
- 文本格式（粗体、斜体、下划线、颜色）
- 列表（有序和无序）
- 表格（包含表头样式）
- 链接
- 图片
- 引用块
- 分割线
- 换行

## 技术实现

### 依赖库
```json
{
  "docx": "^9.5.1",
  "jszip": "^3.x.x",
  "html-to-docx": "^1.8.0"
}
```

### 核心技术栈
- **docx**: 用于生成 Word 文档的主要库
- **JSZip**: 用于 ZIP 文件操作和增强功能
- **DOMParser**: 用于解析 HTML 内容
- **wg-editor-plus**: TipTap 基础的富文本编辑器

## 安装和使用

### 1. 安装依赖
```bash
npm install jszip --save
```
> 注意：`docx` 和 `html-to-docx` 已经在项目中安装

### 2. 基本使用
```javascript
// 在 Vue 组件中
export default {
  methods: {
    async exportWord() {
      try {
        // 获取编辑器内容
        const editorContent = this.$refs.editor.editor.getHTML();
        
        // 调用导出方法
        await this.exportWordAdvanced();
        
        this.$message.success('导出成功！');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    }
  }
}
```

### 3. 使用 DocxExporter 类
```javascript
import DocxExporter from './docx-export-example.js';

// 创建导出器实例
const exporter = new DocxExporter(this.$refs.editor);

// 基础导出
await exporter.exportBasic('my-document.docx');

// 增强导出
await exporter.exportAdvanced('enhanced-document.docx', {
  title: '我的自定义标题'
});

// 自定义样式导出
await exporter.exportWithCustomStyle('styled-document.docx', {
  titleColor: 'FF0000',
  titleSize: 40,
  fontFamily: 'Arial',
  title: '红色大标题文档'
});
```

## API 参考

### DocxExporter 类

#### 构造函数
```javascript
new DocxExporter(editorRef)
```
- `editorRef`: wg-editor-plus 编辑器的引用

#### 方法

##### `getEditorContent()`
获取编辑器内容
```javascript
const content = exporter.getEditorContent();
// 返回: { html: string, text: string, json: object }
```

##### `exportBasic(filename, options)`
基础导出方法
```javascript
await exporter.exportBasic('document.docx', {
  pageSize: { width: 11906, height: 16838 },
  margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
});
```

##### `exportAdvanced(filename, options)`
增强导出方法（带样式和元数据）
```javascript
await exporter.exportAdvanced('document.docx', {
  title: '自定义标题'
});
```

##### `exportWithCustomStyle(filename, styleOptions)`
自定义样式导出
```javascript
await exporter.exportWithCustomStyle('document.docx', {
  titleColor: 'FF6600',
  titleSize: 36,
  fontFamily: 'Microsoft YaHei',
  title: '自定义样式文档'
});
```

## 实现细节

### HTML 解析流程
1. **获取内容**: 从 wg-editor-plus 获取 HTML 内容
2. **预处理**: 清理和标准化 HTML 结构
3. **DOM 解析**: 使用 DOMParser 解析 HTML
4. **节点转换**: 递归转换 DOM 节点为 docx 元素
5. **样式应用**: 应用字体、颜色、对齐等样式
6. **文档生成**: 使用 docx 库生成最终文档

### 样式转换映射
```javascript
// CSS 到 Word 样式的映射
const styleMapping = {
  'font-weight: bold' => { bold: true },
  'font-style: italic' => { italics: true },
  'text-decoration: underline' => { underline: {} },
  'text-align: center' => AlignmentType.CENTER,
  'color: #FF0000' => { color: 'FF0000' }
};
```

### 表格处理
- 自动检测表头（th 元素）
- 应用表头样式（灰色背景）
- 设置边框和内边距
- 按比例分配列宽

### 颜色处理
- 支持十六进制颜色 (#FF0000)
- 支持 RGB 颜色 (rgb(255, 0, 0))
- 自动转换为 Word 支持的格式

## 文件结构

```
demo/
├── App.vue                    # 主要演示文件
├── docx-export-example.js     # DocxExporter 类实现
└── README_DOCX_EXPORT.md      # 本文档
```

## 导出选项

### 基础版导出
- 基本的 HTML 到 Word 转换
- 保留基本格式和结构
- 文件名: `导出文档_基础版.docx`

### 增强版导出
- 包含文档标题和导出时间
- 自定义样式表
- 优化的浏览器兼容性（避免Buffer问题）
- 文件名: `导出文档_增强版.docx`

### 自定义样式导出
- 完全自定义的样式选项
- 自定义标题颜色和字体
- 品牌化页脚
- 文件名: `导出文档_自定义样式.docx`

### ZIP包导出 🆕
- 包含多种格式的完整导出包
- 包含文件：
  - `document.docx`: 主要的Word文档
  - `original.html`: 可在浏览器中预览的HTML文件
  - `metadata.json`: 文档元数据（JSON格式）
  - `readme.txt`: 详细说明文件
- 使用JSZip生成，支持压缩
- 文件名: `wg-editor-plus-export-{timestamp}.zip`

## 浏览器兼容性

- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 14+

## 性能优化

### 内存管理
- 及时清理 Blob URLs
- 使用 setTimeout 延迟清理资源
- 避免重复解析大型 HTML 内容

### 文件大小优化
- 压缩图片（如果使用 base64）
- 移除不必要的样式
- 优化表格结构

## 故障排除

### 常见问题

#### 1. 导出失败 - "编辑器内容为空"
```javascript
// 检查编辑器是否正确初始化
if (!this.$refs.editor || !this.$refs.editor.editor) {
  console.error('编辑器未正确初始化');
}
```

#### 2. 样式丢失
- 确保 CSS 样式被正确解析
- 检查 `window.getComputedStyle` 的支持
- 验证颜色格式转换

#### 3. 表格格式问题
- 确保表格 HTML 结构正确
- 检查 `tbody` 和 `thead` 元素
- 验证单元格内容

#### 4. ⚠️ "nodebuffer is not supported by this platform" 错误
这是最常见的错误，发生在浏览器环境中使用 Node.js 的 Buffer 功能时。

**问题原因**: 使用了 `Packer.toBuffer()` 方法，该方法在浏览器中不受支持。

**解决方案**: 使用 `Packer.toBlob()` 代替:
```javascript
// ❌ 错误做法 - 在浏览器中会报错
const buffer = await Packer.toBuffer(doc);

// ✅ 正确做法 - 浏览器兼容
const blob = await Packer.toBlob(doc);
```

**JSZip 集成的正确方式**:
```javascript
// 生成docx文档的blob
const docxBlob = await Packer.toBlob(doc);

// 转换为ArrayBuffer用于JSZip
const arrayBuffer = await docxBlob.arrayBuffer();

// 添加到ZIP文件
const zip = new JSZip();
zip.file("document.docx", arrayBuffer);

// 生成ZIP
const zipBlob = await zip.generateAsync({type: "blob"});
```

### 调试技巧

#### 1. 启用详细日志
```javascript
// 在 DocxExporter 中添加调试日志
console.log('HTML content:', content.html);
console.log('Parsed elements:', elements);
```

#### 2. 检查中间结果
```javascript
// 检查 HTML 预处理结果
const cleanContent = this.preprocessHtml(content.html);
console.log('Clean content:', cleanContent);
```

#### 3. 验证生成的文档结构
```javascript
// 检查生成的 docx 结构
const json = doc.getJSON();
console.log('Document JSON:', json);
```

## 扩展功能

### 自定义字体
```javascript
const customFontOptions = {
  fontFamily: 'Times New Roman',
  fontSize: 24,
  lineHeight: 360
};
```

### 添加页眉页脚
```javascript
const docWithHeaders = new Document({
  sections: [{
    headers: {
      default: new Header({
        children: [new Paragraph("页眉内容")]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph("页脚内容")]
      })
    },
    children: [...]
  }]
});
```

### 添加目录
```javascript
// 可以通过分析标题结构生成目录
const headings = extractHeadings(content.html);
const toc = generateTableOfContents(headings);
```

## 版本历史

### v1.0.0
- 初始实现
- 基础 HTML 转 DOCX 功能
- 支持文本格式和表格

### v1.1.0
- 添加增强导出功能
- JSZip 集成
- 自定义样式支持

### v1.2.0
- 改进错误处理
- 性能优化
- 扩展浏览器兼容性

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。