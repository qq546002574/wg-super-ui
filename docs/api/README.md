---
sidebar: auto
---

# API 参考

## RouterTab 配置参数

### alive-id

页面组件缓存的 id

- 类型: `String | Function`

  - 如果类型为 `String` ，则可使用内置的缓存规则，`path` (默认) 和 `fullPath`

  - 如果类型为 `Function` ，则取 `aliveId(route, pagePath)` 返回的字符串。
    - `route` 为页面路由对象。
    - `pagePath` 当页面存在嵌套路由时生效，为匹配页面所在路由链的路径
    - 该函数传入相同的 `route` 应返回固定的字符串，以免页签无法与缓存的页面对应

- 默认值: `'path'`
  
  根据 `route.path` 来缓存页面组件。


### i18n

页签国际化转换

- 类型: `Function`

- 参数: 
  
  - `{String} [key]`: 国际化字段 `key`

  - `{Array} [params]` 国际化字段参数列表

- 返回: `Strong` 国际化转换后的字符串


### language

组件语言

- 类型: `String | Object`

  - 如果类型为 `String` ，可以设置为内置的语言 `'zh-CN'` (默认) 和 `'en'`

  - 如果类型为 `Object` ，可设置自定义的语言

- 默认值: `'zh-CN'`


### tabs

**初始页签数据**，进入页面时默认显示的页签。相同 `aliveId` 的页签只保留第一个

- 类型: `Array <String | Object>`
  
  - tabs子元素类型为 `String` 时，应配置为要打开页面的 `fullPath` ，页签的标题、图标、提示等信息会从对应页面的 `router` 配置中获取

  - tabs子元素类型为 `Object` 时: 
    
    - to: 页签路由地址，跟 `router.push` 的 `location` 参数一致，可以为 `fullPath`，也可以为 `location` 对象 - [参考文档](https://router.vuejs.org/zh/guide/essentials/navigation.html#router-push-location-oncomplete-onabort)
    
    - title: 页签标题，如果页面有设置 `routerTab.title` 动态标题，可在此设置最终的动态标题值，以免与默认从 `router` 获取的标题不一致
    
    - closable: 页签是否允许关闭，默认为 `true`

- 默认值: `[]`


### router-view

内置 `router-view` 组件的配置

- 类型: `Object`
  
  > 配置参考: [Vue Router - \<router-view\> Props](https://router.vuejs.org/zh/api/#router-view-props)

- 默认值: `{}`


### tab-transition

**页签过渡效果**，新增和关闭页签时的过渡

- 类型: `String | Object`

  - 类型为 `String` 时，应配置为 `transition.name`

  - 类型为 `Object` 时，配置参考: [Vue - transition](https://cn.vuejs.org/v2/api/#transition)

- 默认值: `'router-tab-zoom'`


### page-transition

页面过渡效果

- 类型: `String | Object`
  
  同 [`tab-transition`](#tab-transition)

- 默认值: `{
  name: 'router-tab-swap',
  mode: 'out-in'
}`



## RouterTab 实例属性

在组件内部可通过 `this.$routerTab.[prop]` 访问

### routerTab.activedTab

当前激活的页签 id



## RouterTab 实例方法

::: tip
在 Vue 实例内部，您可以通过 `this.$routerTab` 来访问路由页签实例。例如: 调用 `this.$routerTab.close()` 来关闭当前页签。
:::

### routerTab.close

关闭指定 `location` 的页签

- 参数: 
  - `{String | Object} [location]` 路由地址 - [参考文档](https://router.vuejs.org/zh/guide/essentials/navigation.html#router-push-location-oncomplete-onabort)
  - `{Boolean} [fullMatch = true]` 是否全匹配（匹配fullPath去除hash部分）

  
### routerTab.refresh

刷新指定 `location` 的页签

- 参数: 
  - `{String | Object} [location]` 路由地址 - [参考文档](https://router.vuejs.org/zh/guide/essentials/navigation.html#router-push-location-oncomplete-onabort)
  - `{Boolean} [fullMatch = true]` 是否全匹配（匹配fullPath去除hash部分）


### routerTab.refreshAll

刷新所有页签

- 参数: 
  - `{Boolean} [force = false]` 如果 `force` 为 `true`，则忽略页面组件的 `beforePageLeave` 配置，强制刷新所有页签


### routerTab.openIframe

打开 iframe 页签

- 参数: 
  - `{String} [src]` 要打开的 iframe 页签链接
  - `{String} [title]` 页签标题
  - `{String} [icon]` 页签图标


### routerTab.closeIframe

关闭 iframe 页签

- 参数: 
  - `{String} [src]` 要关闭的 iframe 页签链接


### routerTab.refreshIframe

刷新 iframe 页签

- 参数: 
  - `{String} [src]` 要刷新的 iframe 页签链接



## RouterTab 事件

### iframe-mounted

iframe 节点挂载就绪

- 参数: 
  - `{String} [url]` iframe 的链接地址
  - `{HTMLIFrameElement} [iframe]` iframe 节点

### iframe-loaded

iframe 内容加载成功

- 参数: 
  - `{String} [url]` iframe 的链接地址
  - `{HTMLIFrameElement} [iframe]` iframe 节点



## Route.meta 路由元信息

通过路由的 `meta`，我们可以配置路由页签的标题、图标、提示和缓存规则

### meta.title

页签标题

- 类型: `String | Array`
- 默认值: `'新页签'`

该字段支持国际化配置，参考: [教程 - 多语言支持](../guide/essentials/i18n.md)


### meta.icon

页签图标

- 类型: `String`


### meta.tips

页签提示

- 类型: `String | Array`
- 默认值: 默认和页签标题 `meta.title` 保持一致

该字段支持国际化配置，参考: [教程 - 多语言支持](../guide/essentials/i18n.md)


### meta.aliveId

页面组件缓存的 id，用以设置路由独立的页签缓存规则。

> 配置参考: [RouterTab Props > alive-id](#alive-id)


## 扩展

::: tip 说明
`vm`: Vue 组件实例

`pageVm`: 通过 RouterTab 加载的页面组件实例
:::


### beforePageLeave

页面离开确认。

页面组件选项，与 `data`, `methods` 等选项并列配置
 
- 参数: 
  - `{Function} resolve` 执行后允许离开页签
  - `{Function} reject` 执行后阻止离开页签
  - `{Object} tab` 页签信息
  - `{String} type` 离开类型: `close`: '关闭', `refresh`: '刷新', `replace`: '替换'


### vm.$routerTab

RouterTab 实例

为了方便调用，RouterTab 将实例挂载在 `Vue.prototype` 上。因此，在所有 Vue 组件内部，您都可以通过 `this.$routerTab` 来访问路由页签实例


### pageVm.routeTab

路由页签配置

RouterTab 通过监听页面组件的 `this.routeTab` 来更新页面对应页签的标题、图标、提示

### pageVm._isRouterPage

是否是路由页面

在通过 RouterTab 加载的页面组件内部，访问 `this._isRouterPage` 会返回 `true`

::: tip
应用: 在需要给路由页面添加全局混入 `mixin` 时，可在生命周期钩子（ `created` 之后）里判断 `this._isRouterPage`
:::
