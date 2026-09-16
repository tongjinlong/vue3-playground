<script setup lang="ts">
const steps = [
  {
    title: '先把工作空间搭起来',
    text: '公共布局承载侧边栏、顶栏与主题；RouterView 只切换内容。当前阶段已经完成。',
    tags: 'AppLayout · AppSidebar · CSS 变量',
  },
  {
    title: '用一个实验跑通完整流程',
    text: '先读 ref 的说明，操作计数器，对照源码和日志，再标记掌握。后续 API 都沿用相同页面结构。',
    tags: '说明 → Demo → 源码 → 日志 → 掌握度',
  },
  {
    title: '每次新增一个小实验',
    text: '从 reactive、computed、watch 开始，逐步覆盖十类模块。独立封装 Demo 组件，让每个实验只解决一个问题。',
    tags: '响应式 → 组件协作 → 应用能力',
  },
  {
    title: '在任务看板里串联能力',
    text: '先做任务增删改，再接入登录、过滤、动画、缓存与权限。最后用 Vitest 验证组合式函数和 store。',
    tags: 'Vue Router · Pinia · Vitest',
  },
]
</script>
<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">A GUIDE TO YOUR PLAYGROUND</div>
      <h1>带着问题学习，带着作品理解。</h1>
      <p>不用一次实现所有功能。每完成一个小闭环，就向前一步。</p>
    </div>
  </div>
  <div class="guide-steps">
    <section v-for="(step, index) in steps" :key="step.title" class="panel">
      <span class="step-number">0{{ index + 1 }}</span>
      <div>
        <h2>{{ step.title }}</h2>
        <p>{{ step.text }}</p>
        <code>{{ step.tags }}</code>
      </div>
    </section>
  </div>
  <section class="panel guide-resources">
    <h2>从这里继续</h2>
    <p>项目内的 docs/01-layout-guide.md 包含文件职责、实现顺序、关键代码解释和验收清单。</p>
    <div>
      <a
        class="button secondary"
        href="https://cn.vuejs.org/guide/introduction.html"
        target="_blank"
        rel="noreferrer"
        >Vue 官方文档 ↗</a
      ><RouterLink class="button primary" to="/lab/reactivity">开始 ref 实验 →</RouterLink>
    </div>
  </section>
</template>
