# Shared Components & Utilities

此目录存放所有应用共享的代码。

## 目录结构

```
packages/shared/
├── styles/          # 公共样式、主题变量
├── components/      # 可复用 UI 组件
├── utils/          # 工具函数
└── README.md
```

## 使用方式

在应用中引入共享资源：

```html
<!-- 引入公共样式 -->
<link rel="stylesheet" href="../../packages/shared/styles/github-theme.css">

<!-- 引入公共组件 -->
<script src="../../packages/shared/components/button.js"></script>
```
