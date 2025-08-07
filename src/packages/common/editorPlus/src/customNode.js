// 图片
import Image from "@tiptap/extension-image";

import { Node, mergeAttributes, Extension } from '@tiptap/core';

// 自定义图片
export const CustomImage = Image.extend({
    name: 'customImage',
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            style: {
                default: 'cursor: pointer',
            },
            class: {
                // default: 'drawio-image-container',
            },
            // 添加自定义 ondblclick 属性
            ondblclick: {
                default: null,
                renderHTML: attributes => {
                    return {
                        ondblclick: attributes.ondblclick,
                    }
                }
            }
        }
    }
});

// 流程图容器
export const UploadContainer = Node.create({
    name: 'uploadContainer',
    group: 'block', // 表示该节点为块级节点
    content: '',  // 允许插入子树节点为哪种类型 可正则表示自定义uploadedImage+或自带block+或inline+或paragraph+
    // 添加这个配置来支持 text-align
    draggable: true,
    selectable: true,  // 确保节点可选择
    // 添加命令 可以添加多个
    addCommands() {
        return {
            setUploadContainer: (attrs = {}) => ({ chain, editor }) => {
                // 获取当前选中的节点
                const { selection } = editor.state;
                let currentTextAlign = 'left';  // 默认值

                // 查找当前的 uploadContainer 节点
                editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
                    if (node.type.name === 'uploadContainer') {
                        currentTextAlign = node.attrs.textAlign || 'left';
                        return false; // 停止遍历
                    }
                });

                return chain()
                    .insertContent({
                        type: 'uploadContainer',
                        attrs: {
                            class: 'upload-container',
                            ondblclick: `window.handleDrawioImageClick && window.handleDrawioImageClick(${JSON.stringify(attrs.svgContent)})`,
                            imageContent: attrs.imageContent,
                            svgContent: attrs.svgContent,
                            textAlign: currentTextAlign
                        }
                    })
                    .run()
            },
            removeUploadContainer: (attrs = {}) => ({ chain }) => {
                return chain()
                    .deleteSelection()
                    .run()
            },
        }
    },
    // 添加选项 可以添加多个
    addOptions() {
        return {
            HTMLAttributes: {
                class: 'upload-container'
            }
        }
    },
    // 添加属性 可以添加多个
    addAttributes() {
        return {
            class: {
                default: this.options.HTMLAttributes.class
            },
            ondblclick: {
                default: null,
                renderHTML: attributes => ({
                    ondblclick: attributes.ondblclick
                })
            },
            imageContent: {
                default: null
            },
            svgContent: {
                default: null
            },
            'data-action': {
                default: null
            },
            'data-svg-content': {
                default: null
            },
            id: {
                default: null
            },
            textAlign: {
                default: 'left',
                parseHTML: element => element.style.textAlign,
                renderHTML: attributes => ({
                    style: `text-align: ${attributes.textAlign}`
                })
            }
        }
    },
    // 解析HTML 可以添加多个
    // parseHTML() {
    //     return [{
    //         tag: 'div.upload-container',
    //     }]
    // },
    // 渲染HTML 可以添加多个
    renderHTML({ HTMLAttributes, node }) {
        const { imageContent, svgContent, textAlign } = node.attrs;
        return [
            'p',
            {
                style: `display: flex; justify-content: ${textAlign || 'left'}`
            },
            ['div',
                mergeAttributes(
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                    {
                        class: `upload-container`,
                        'data-svg-content': JSON.stringify(svgContent),
                        'data-action': 'open-editor',
                        style: 'cursor: move;'
                    }
                ),
                [
                    'div',
                    {
                        class: 'uploaded-image',
                    },
                    [
                        'div',
                        { class: 'svg-content' },
                        ['img', { src: imageContent }]
                    ],
                    [
                        'div',
                        { class: 'image-actions' },
                        [
                            'span',
                            {
                                style: 'cursor: pointer;'
                            },
                            ['i', { class: 'el-icon-zoom-in', 'data-action': 'preview' }]
                        ],
                        [
                            'span',
                            {
                                style: 'cursor: pointer;'
                            },
                            ['i', { class: 'el-icon-delete', 'data-action': 'remove' }]
                        ]
                    ]
                ]
            ]
        ]
    }
});

