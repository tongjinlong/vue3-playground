# Vue3 Playground / Vue3 能力地图

通过 API 交互实验和任务看板，逐步练习 Vue3 + TypeScript。

## 本地运行

```bash
pnpm install
pnpm dev
```

需要 Node.js 24 与 pnpm 11（精确范围见 package.json）。默认访问 Vite 输出的地址；端口占用时可用 `pnpm dev --host 127.0.0.1 --port 5188`。

## 当前进度

第一阶段已完成：公共布局、10 类模块导航、总览、模块搜索、响应式侧栏、三种主题、学习进度持久化，以及统一实验页。

`ref` 计数器是第一个可运行实验。其他 API 展示规划状态；任务看板目前提供布局与实现路线，尚未实现任务 CRUD。

- [第一阶段实现逻辑与跟练教程](docs/01-layout-guide.md)
- [模块目录](src/data/modules.ts)
- [公共布局](src/layouts/AppLayout.vue)

## 检查

```bash
pnpm verify
```

包含格式、ESLint、Stylelint、Vitest 覆盖率、类型检查、构建、包体积预算和 Playwright 端到端测试。

主题、侧栏折叠与掌握度保存在当前浏览器 localStorage。使用 History 路由，部署时需将未知路径回退到 index.html。
