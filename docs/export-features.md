# wg-editor-plus 导出功能说明

## 概述

`wg-editor-plus` 组件新增了强大的导出功能，支持多种格式的文档导出，包括 HTML、PDF、DOCX 和纯文本格式。特别是新增的 DOCX 导出功能，采用先转 PDF 再转换的方式，确保了格式兼容性和样式保持。

## 新增功能

### 🆕 主要改进

1. **DOCX 导出功能** - 采用 PDF 转换的方式生成 Word 文档
2. **优化的打印样式** - 专门优化的打印布局和样式
3. **可配置的导出选项** - 支持自定义页面格式、字体等
4. **改进的用户界面** - 更美观的导出菜单和按钮

### 📄 支持的导出格式

- **HTML** (`.html`) - 完整保留样式的网页格式
- **PDF** (`.pdf`) - 高质量打印格式，支持分页
- **DOCX** (`.docx`) - Microsoft Word 格式（新增）
- **TXT** (`.txt`) - 纯文本格式

## 使用方法

### 基本用法

```vue
<template>
  <wg-editor-plus 
    ref="editor"
    :initial-content="content"
    :export-styles="exportConfig"
    @change="handleContentChange">
  </wg-editor-plus>
</template>

<script>
export default {
  data() {
    return {
      content: {
        html: '<h1>测试内容</h1><p>这是一些示例文本。</p>',
        text: '',
        json: null
      },
      exportConfig: {
        format: 'a4',
        orientation: 'portrait',
        fontSize: 12,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      }
    }
  },
  methods: {
    handleContentChange(content) {
      console.log('内容变化:', content);
    }
  }
}
</script>
```

### 配置选项

#### exportStyles 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `format` | String | `'a4'` | 页面格式 (`a4`, `a3`, `letter`) |
| `orientation` | String | `'portrait'` | 页面方向 (`portrait`, `landscape`) |
| `fontSize` | Number | `12` | 字体大小 (单位: pt) |
| `fontFamily` | String | `'Microsoft YaHei, Arial, sans-serif'` | 字体族 |
| `margin` | Object | `{top: 20, right: 20, bottom: 20, left: 20}` | 页边距 (单位: mm) |
| `showHeader` | Boolean | `false` | 是否显示页眉 |
| `headerText` | String | `''` | 页眉文本 |
| `showFooter` | Boolean | `false` | 是否显示页脚 |
| `footerText` | String | `''` | 页脚文本 |
| `showPageNumbers` | Boolean | `false` | 是否显示页码 |

### 程序化导出

除了使用工具栏按钮，您也可以通过代码调用导出方法：

```javascript
// 获取编辑器引用
const editor = this.$refs.editor;

// 导出为 HTML
await editor.exportAsHTML();

// 导出为 PDF
await editor.exportAsPDF();

// 导出为 DOCX
await editor.exportAsDocx();

// 导出为纯文本
await editor.exportAsText();

// 打印
await editor.printContent();
```

## 技术实现

### PDF 导出

使用 `html2canvas` + `jsPDF` 实现：

1. 将编辑器内容转换为 Canvas
2. 将 Canvas 转换为图片
3. 生成 PDF 并处理分页

### DOCX 导出

采用**先转 PDF 再转换**的方式：

1. 首先生成高质量的 PDF
2. 解析 HTML 内容为 DOCX 元素
3. 使用 `docx` 库生成 Word 文档
4. 保持原有的格式和样式

### 打印功能

使用浏览器原生打印 API：

1. 创建隐藏的 iframe
2. 注入优化的打印样式
3. 调用打印对话框

## 样式优化

### 打印样式

新增的打印样式包括：

- **隐藏工具栏** - 导出时不显示编辑器控件
- **表格优化** - 边框和间距优化
- **分页控制** - 避免内容跨页断裂
- **图片适配** - 自动缩放以适应页面
- **字体渲染** - 确保字体在不同环境下的一致性

### CSS 特性

```css
/* 分页控制 */
.page-break {
  page-break-before: always;
}

.no-break {
  page-break-inside: avoid;
}

/* 打印优化 */
@media print {
  body {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}
```

## 依赖包

新增的依赖包：

```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1", 
  "pdf-lib": "^1.17.1",
  "docx": "^9.5.1"
}
```

## 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| HTML导出 | ✅ | ✅ | ✅ | ✅ |
| PDF导出 | ✅ | ✅ | ✅ | ✅ |
| DOCX导出 | ✅ | ✅ | ✅ | ✅ |
| 打印功能 | ✅ | ✅ | ✅ | ✅ |

## 使用示例

### 完整配置示例

```vue
<template>
  <div>
    <wg-editor-plus 
      ref="editor"
      :initial-content="content"
      :export-styles="exportStyles"
      @change="handleContentChange"
      @save="handleSave">
    </wg-editor-plus>
    
    <div class="export-controls">
      <el-button @click="exportHTML">导出 HTML</el-button>
      <el-button @click="exportPDF">导出 PDF</el-button>
      <el-button @click="exportDOCX">导出 DOCX</el-button>
      <el-button @click="print">打印</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: {
        html: `
          <h1>文档标题</h1>
          <p>这是一个包含<strong>粗体</strong>和<em>斜体</em>的段落。</p>
          <table>
            <tr><th>列1</th><th>列2</th></tr>
            <tr><td>数据1</td><td>数据2</td></tr>
          </table>
        `
      },
      exportStyles: {
        format: 'a4',
        orientation: 'portrait',
        fontSize: 14,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        margin: {
          top: 25,
          right: 25,
          bottom: 25,
          left: 25
        },
        showHeader: true,
        headerText: '我的文档',
        showFooter: true,
        footerText: '第 {page} 页',
        showPageNumbers: true
      }
    }
  },
  methods: {
    async exportHTML() {
      try {
        await this.$refs.editor.exportAsHTML();
        this.$message.success('HTML导出成功');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    },
    
    async exportPDF() {
      try {
        await this.$refs.editor.exportAsPDF();
        this.$message.success('PDF导出成功');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    },
    
    async exportDOCX() {
      try {
        await this.$refs.editor.exportAsDocx();
        this.$message.success('DOCX导出成功');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    },
    
    async print() {
      try {
        await this.$refs.editor.printContent();
      } catch (error) {
        this.$message.error('打印失败: ' + error.message);
      }
    },
    
    handleContentChange(content) {
      console.log('内容变化:', content);
    },
    
    handleSave(content) {
      console.log('保存内容:', content);
    }
  }
}
</script>
```

## 注意事项

1. **DOCX 导出** - 由于是前端转换，复杂的样式可能会有所简化
2. **图片处理** - base64 图片会被包含在导出文件中，可能增加文件大小
3. **跨域问题** - 如果包含外部图片，需要确保服务器支持 CORS
4. **性能考虑** - 大文档的 PDF 转换可能需要较长时间
5. **浏览器限制** - 某些浏览器可能会阻止自动下载多个文件

## 故障排除

### 常见问题

**Q: DOCX 导出失败**
A: 检查是否有网络问题阻止依赖库加载，确保 `docx` 包已正确安装。

**Q: PDF 导出内容不完整**
A: 可能是内容过长导致分页问题，建议检查页面设置或手动添加分页符。

**Q: 打印样式不正确**
A: 确保浏览器允许背景图片和颜色打印，检查打印设置。

**Q: 导出文件下载被阻止**
A: 某些浏览器会阻止自动下载，需要用户手动允许。

### 调试模式

开启调试模式查看详细错误信息：

```javascript
// 在控制台中设置
window.WG_EDITOR_DEBUG = true;
```

## 更新日志

### v2.0.23-ajt
- ✨ 新增 DOCX 导出功能
- 🎨 优化打印样式和布局
- ⚙️ 添加可配置的导出选项
- 🐛 修复表格导出的样式问题
- 📱 改进移动端导出体验

## 许可证

MIT License