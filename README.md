# 🚀 AI Repo Monorepo

一个集中管理多个创意应用的 Monorepo 项目。

## 📁 项目结构

```
ai-repo/
├── apps/                    # 应用目录
│   └── todo-list/          # GitHub 风格 Todo List
│       ├── index.html
│       ├── style.css
│       └── app.js
├── packages/               # 共享包/组件
│   └── shared/            # 公共工具、样式、组件
├── docs/                  # 文档
└── README.md
```

## 🎯 现有应用

| 应用 | 路径 | 描述 |
|------|------|------|
| Todo List | `apps/todo-list/` | GitHub 深色主题待办事项 |

## 🛠️ 添加新应用

```bash
# 在 apps/ 目录下创建新应用文件夹
mkdir apps/new-app
cd apps/new-app

# 初始化你的应用
# ...
```

## 📦 共享资源

- `packages/shared/styles/` - 公共 CSS/主题
- `packages/shared/components/` - 可复用组件
- `packages/shared/utils/` - 工具函数

## 🚀 部署

每个应用独立部署到 GitHub Pages 或其他平台。

---
*Powered by OpenClaw & Kimi*
