<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
const columns = [
  { title: '待办', color: 'blue', icon: 'board', text: '收集你的下一个想法' },
  { title: '进行中', color: 'orange', icon: 'bolt', text: '一次专注完成一件事' },
  { title: '已完成', color: 'green', icon: 'check', text: '让每一次进步可见' },
]
const phases = [
  '模拟登录与路由守卫',
  '任务 CRUD 与数据持久化',
  '拖拽排序、筛选与标签',
  '弹窗、列表动画与页面缓存',
  '权限指令与单元测试',
]
</script>
<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">BUILD SOMETHING REAL</div>
      <h1>任务看板</h1>
      <p>把零散的知识，组合成一个完整的应用。</p>
    </div>
    <span class="pill">第二阶段 · 布局预览</span>
  </div>
  <div class="notice">
    <AppIcon name="board" />
    <p>看板布局已就绪。完成基础 API 实验后，将逐步加入任务管理功能。</p>
  </div>
  <div class="board-grid">
    <section v-for="column in columns" :key="column.title" class="board-column">
      <h2><span class="column-dot" :class="column.color" />{{ column.title }}<span>0</span></h2>
      <div class="board-placeholder">
        <AppIcon :name="column.icon" :size="30" />
        <p>{{ column.text }}</p>
        <small>任务功能将在第二阶段开放</small>
      </div>
    </section>
  </div>
  <section class="panel roadmap">
    <span class="eyebrow">IMPLEMENTATION ROADMAP</span>
    <h2>一步一步，让看板运转起来</h2>
    <ol>
      <li v-for="(phase, index) in phases" :key="phase">
        <span>{{ String(index + 1).padStart(2, '0') }}</span
        >{{ phase }}<small>待实现</small>
      </li>
    </ol>
  </section>
</template>
