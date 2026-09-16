# 第一阶段：搭建 Vue3 Playground 工作空间

这一阶段的目标是搭好可持续添加实验的页面骨架：路由切换时公共布局保持稳定，每个模块有入口，主题与学习进度刷新后仍然保留。

## 1. 这一版已经完成什么

- 能力总览：10 个模块、80 个学习条目、模块筛选与动态进度统计。相同 API 在不同场景出现时，按各模块的学习条目分别计数。
- API 实验室：按分类切换页面，每页统一为说明、交互实验、源码、日志与掌握度。
- `ref` 计数器：本阶段的完整示例，支持增减、重置、查看日志、清空日志、标记或撤销掌握。
- 任务看板：待办、进行中、已完成三列的布局和后续实现路线。任务 CRUD 尚未实现。
- 学习进度：来自真实掌握记录，初始为 0，不使用模拟学习成绩。
- 公共交互：桌面侧栏折叠、手机导航抽屉、搜索 API 或模块、面包屑、404 页面。
- 三种主题：浅色、深色、跟随系统。主题选择与侧栏折叠保存到 localStorage。

目前只开放一个可运行实验，其余条目明确标注“待实现”，掌握按钮禁用。当前完成的是项目第一阶段和一个模板示例。

本版使用原生 Vue 组件与 CSS，没有新增依赖。当前布局只需要导航、按钮、卡片与一个原生 dialog，方便直接观察实现原理；后续做任务表单、日期选择器等复杂交互时，可以再引入 Element Plus。

## 2. 先理解整体结构

```text
App.vue
└── RouterView
    └── AppLayout.vue                公共布局，路由切换时保持挂载
        ├── AppSidebar.vue           桌面侧栏 / 手机抽屉复用导航内容
        ├── 顶栏                    面包屑、搜索、主题按钮
        ├── RouterView              当前功能页面
        │   ├── OverviewView        能力总览
        │   ├── LabView             API 实验页
        │   ├── BoardView           看板布局
        │   ├── ProgressView        学习进度
        │   └── GuideView           学习指南
        └── 页脚
```

### 文件职责

| 文件                            | 负责什么                                    | 以后什么时候修改 |
| ------------------------------- | ------------------------------------------- | ---------------- |
| `src/data/modules.ts`           | 模块名称、图标、描述、学习条目、开放实验 ID | 新增模块或实验   |
| `src/router/index.ts`           | 嵌套路由、懒加载、404、页面元信息           | 新增独立页面     |
| `src/layouts/AppLayout.vue`     | 页面框架、顶栏、搜索、移动端导航            | 调整公共布局     |
| `src/components/AppSidebar.vue` | 用目录配置生成导航                          | 调整导航外观     |
| `src/components/ModuleCard.vue` | 模块卡片和模块进度                          | 调整总览卡片     |
| `src/components/AppIcon.vue`    | 本地 SVG 线性图标                           | 增补图标         |
| `src/stores/preferences.ts`     | 主题选择、侧栏折叠与持久化                  | 新增全局偏好     |
| `src/composables/useTheme.ts`   | 监听系统主题、同步根元素、清理监听器        | 扩展主题行为     |
| `src/stores/progress.ts`        | 掌握记录、统计与持久化                      | 扩展学习记录     |
| `src/style.css`                 | 主题颜色、基础元素和通用样式                | 调整视觉风格     |
| `src/assets/layout.css`         | 布局、页面组件和响应式断点                  | 调整页面排布     |

## 3. 推荐跟练顺序

### 第一步：建立唯一的模块目录

先阅读 `src/data/modules.ts`。一个条目包含 `id`、`title`、`english`、`icon`、`color`、`description`、`topics` 和 `scenario`。

侧栏、首页卡片、搜索和进度列表都读取 `modules`。这能避免“菜单改了，首页忘了改”。数量也由数组长度计算，不写死 80。

掌握记录使用 `模块ID/知识点名称`，例如 `reactivity/ref`。这样在不同模块练习 `KeepAlive` 时，记录不会互相覆盖。实际项目继续扩展时，可以将每个知识点升级成 `{ id, title, status, component }`，让显示名称和稳定 ID 分离。

**跟练任务：** 修改“组件通信”的描述，观察首页卡片、实验页是否同步变化。

### 第二步：用嵌套路由固定公共布局

先在 `main.ts` 中注册插件：

```ts
createApp(App).use(createPinia()).use(createAppRouter()).mount('#app')
```

然后在路由里将 `AppLayout` 作为父组件，其 `children` 挂载功能页：

```ts
{
  path: '/',
  component: AppLayout,
  children: [
    {
      path: '',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
      meta: { title: '能力总览' },
    },
  ],
}
```

子路由页面显示在布局内部的 `RouterView`，因此切换内容不会重建顶栏和侧栏。页面使用动态导入，访问时才加载对应代码。见 [Vue Router：嵌套路由](https://router.vuejs.org/guide/essentials/nested-routes.html)。

布局从路由元信息读取顶栏标题；实验页再用 `moduleId` 查目录显示具体模块名。非法模块跳到 404，直接修改动态参数时页面也有兜底。

**为什么 `RouterView` 使用 `route.path` 作为 key？** 切换实验模块时，重新创建页面局部状态，避免把 ref 的计数与日志带到其他模块。公共布局本身不重建。此阶段没有使用 KeepAlive，切换页面后计数会清零，掌握记录仍然保留。

**部署注意：** 使用 HTML5 History 路由，未来部署静态网站时需要把未知路径回退到 `index.html`，否则直接访问 `/lab/reactivity` 可能收到服务器 404。Vite 开发和预览服务器已经支持此回退。

### 第三步：用 CSS 变量搭布局

桌面侧栏固定在左侧，主工作区用相同变量留出空间：

```css
.app-shell {
  --sidebar-width: 242px;
}
.app-shell.is-collapsed {
  --sidebar-width: 76px;
}
.desktop-sidebar {
  width: var(--sidebar-width);
}
.workspace {
  margin-left: var(--sidebar-width);
}
```

折叠只是切换一个 class，图标保留，文字隐藏。模块卡片使用 Grid：

```css
.module-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

`minmax(0, 1fr)` 允许列收缩，避免长 API 名称撑开布局；标签也允许换行。

| 宽度         | 布局变化                             |
| ------------ | ------------------------------------ |
| 大于 1200px  | 完整侧栏、3 列卡片、4 列统计         |
| 1001–1200px  | 缩小侧栏和间距，保留 3 列卡片        |
| 761–1000px   | 2 列卡片、2 列统计                   |
| 481–760px    | 隐藏桌面侧栏，改用手机抽屉；2 列卡片 |
| 480px 及以下 | 卡片改为单列，顶栏紧凑显示           |

移动端使用原生 `<dialog>` 的 `showModal()`，浏览器负责焦点约束和 Escape 关闭。点击导航后调用 `close()`；关闭后焦点回到触发按钮。桌面折叠偏好与手机抽屉开关分别管理，避免手机误继承“仅图标”菜单。

**跟练任务：** 在浏览器调整窗口宽度，观察 3 → 2 → 1 列的变化，以及手机菜单开关。

### 第四步：拆分主题状态与浏览器副作用

数据流：

```text
点击主题按钮
  → preferences.setTheme('dark')
  → Pinia 更新 theme，并写入 localStorage
  → useTheme 的 watchEffect 重新运行
  → <html data-theme="dark"> 和 color-scheme 更新
  → 全站 CSS 变量生效
```

`preferences` 保存的是用户选择：`light | dark | system`。`useTheme` 再计算真正应该显示的颜色。当选择 `system` 时，读取 `matchMedia('(prefers-color-scheme: dark)')`，并监听系统变化。

- store 负责共享状态与操作，便于测试；见 [Pinia：定义 Store](https://pinia.vuejs.org/core-concepts/)。
- composable 封装可复用的有状态逻辑和相关副作用，监听器随组件卸载清理；见 [Vue：组合式函数](https://cn.vuejs.org/guide/reusability/composables)。
- 页面只使用语义变量：`--bg`、`--surface`、`--text`、`--muted`、`--border`、`--accent`。
- 深色模式覆盖变量，不为每一个页面各写一套颜色。

```css
:root {
  --surface: #fff;
  --text: #243d35;
}
:root[data-theme='dark'] {
  --surface: #19261f;
  --text: #e0ebe4;
}
.panel {
  background: var(--surface);
  color: var(--text);
}
```

`useTheme()` 在公共布局调用一次即可。本阶段是纯浏览器 SPA；如果未来改为 SSR，需要为 `window`、`document` 和 localStorage 加客户端边界。

### 第五步：加入顶栏搜索和导航反馈

搜索将模块标题、英文名和 API 列表转成小写后匹配。输入 `computed` 会找到“响应式基础”，输入“路由”会找到 Vue Router。当前搜索结果按模块展示，点击跳转到模块首页，不直接选中某个 API。

支持 `Ctrl+K` / `⌘K` 聚焦搜索框，`Escape` 清空搜索。普通链接支持 Tab 导航，没有实现需要额外键盘模型的自定义 combobox。

菜单活动状态由 RouterLink 提供；页面标题随路由更新；正文提供“跳转到主要内容”链接和键盘焦点样式。

### 第六步：贯通实验页和学习记录

打开 `/lab/reactivity`，按顺序阅读 `LabView.vue`：

1. `selected` 决定当前知识点。
2. `count` 是实验内部状态，用 ref 管理。
3. `updateCount()` 更新数据，并在日志中追加一条记录。
4. 日志只保留最近 20 条，避免无限增长；这是示例操作日志，不拦截浏览器 console。
5. `progress.toggle('reactivity/ref')` 保存掌握标记；再次点击则撤销。
6. 总览、侧栏、进度页从同一 store 读取结果，自动同步。

本阶段只实现一个 Demo，因此先放在 `LabView.vue` 内；当新增第二个实验时，建议抽成 `src/demos/reactivity/RefDemo.vue` 和 `ReactiveDemo.vue`，让 LabView 专注统一外壳。

持久化键：

| key                             | 内容                   |
| ------------------------------- | ---------------------- |
| `vue-playground:preferences:v1` | 主题选择和侧栏折叠状态 |
| `vue-playground:progress:v1`    | 已掌握实验 ID 数组     |

读取时校验数据类型、过滤未知实验 ID，并去重。遇到损坏 JSON、禁用存储或存储空间不足，页面仍能使用，并提示记录可能未保存。记录仅属于当前浏览器和当前站点来源，不会跨设备、跨端口同步。

## 4. 下一次如何添加 reactive 实验

建议按这个顺序做，不急着铺开所有 API：

1. 创建 `ReactiveDemo.vue`：一个包含姓名与年龄的响应式对象，提供编辑表单。
2. 把现有 ref Demo 抽成独立组件，保留真实源码与日志。
3. 将实验选择改成注册表：`lessonId → 说明、组件、源码、状态`。
4. 让 LabView 根据选中 ID 渲染注册的组件，使用 props / emits 传递日志。
5. 把 `reactivity/reactive` 加入开放实验列表；同时移除现有 `isReady` 的单例判断。**不能只加入白名单而不接入真实 Demo。**
6. 验证两个实验切换后状态隔离，进度准确，未实现知识点仍不可标记。
7. 再依次实现 computed 购物车总价、watch 搜索、副作用清理。

这样到任务看板阶段时，你已经拥有可复用的布局、主题、导航和实验组织方式。

## 5. 后续阶段规划

| 阶段     | 交付结果                  | 重点知识                                                 |
| -------- | ------------------------- | -------------------------------------------------------- |
| 1 · 当前 | 布局与主题 + ref 完整模板 | RouterView、Pinia、CSS 变量、持久化                      |
| 2        | 响应式基础实验            | ref、reactive、computed、watch、watchEffect              |
| 3        | 组件协作实验              | props/emits/model、插槽、生命周期                        |
| 4        | 通用能力实验              | 内置组件、自定义指令、组合式函数                         |
| 5        | 任务看板可用版本          | 登录模拟、CRUD、过滤、Pinia 持久化                       |
| 6        | 看板体验与性能            | 拖拽、Teleport、TransitionGroup、KeepAlive、权限、Vitest |

任务看板中的 provide/inject 主题示例可以专门用于练习依赖注入，复用当前主题 store 作为数据来源，避免两套状态冲突。

## 6. 运行与验收

```bash
pnpm dev
# 如果 5173 已被其他项目使用：
pnpm dev --host 127.0.0.1 --port 5188

pnpm verify
```

`pnpm verify` 依次检查格式、代码与样式、测试覆盖率、类型与生产构建、包体积，以及生产环境端到端测试。

验收清单：

- [x] 10 个模块导航和总览卡片一致。
- [x] 主题在浅色、深色、跟随系统间切换，刷新后保持选择。
- [x] 系统主题变化时，“跟随系统”立即更新。
- [x] 桌面侧栏可折叠，手机抽屉可打开、导航并关闭。
- [x] 抽屉 Escape 关闭后恢复触发按钮焦点。
- [x] 手机页面没有横向溢出。
- [x] 搜索 ref 能进入响应式模块。
- [x] ref 的计数、日志与掌握度流程完整。
- [x] 已掌握记录刷新后保留，且可以撤销。
- [x] 未实现实验有明确说明，不能标记掌握。
- [x] 非法路由和模块进入 404。
- [x] 损坏与不可用的 localStorage 不会阻止应用启动。

## 7. 小练习

读完后，建议自己完成以下三个改动：

1. 给顶栏加上当前模块的知识点数量，数据从目录派生。
2. 给总览增加“已完成”筛选：`已掌握数量 === 模块知识点数量`。
3. 把 `--accent` 换成另一种颜色，检查所有页面是否正确跟随。

能解释清楚“状态在哪里、谁更新它、界面为什么跟着变”，比一次堆完所有 API 更重要。
