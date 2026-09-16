<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { modules, totalTopics } from '@/data/modules'
import { useProgressStore } from '@/stores/progress'
withDefaults(defineProps<{ collapsed?: boolean }>(), { collapsed: false })
defineEmits<{ navigate: [] }>()
const progress = useProgressStore()
</script>
<template>
  <div class="sidebar-inner" :class="{ compact: collapsed }">
    <RouterLink class="brand" to="/" aria-label="Vue3 Playground 首页" @click="$emit('navigate')">
      <span class="brand-mark"
        ><svg viewBox="0 0 32 28" aria-hidden="true">
          <path fill="currentColor" d="M0 0h7l9 16L25 0h7L16 28Z" />
          <path fill="#204a3d" d="M7 0h6l3 5 3-5h6l-9 16Z" /></svg
      ></span>
      <span class="nav-label"
        ><strong>Vue3 <span>Playground</span></strong
        ><small>你的 Vue3 能力地图</small></span
      >
    </RouterLink>
    <nav class="side-nav" aria-label="主导航">
      <RouterLink
        to="/"
        class="nav-item"
        exact-active-class="active"
        :title="collapsed ? '能力总览' : undefined"
        @click="$emit('navigate')"
        ><AppIcon name="grid" /><span class="nav-label">能力总览</span
        ><span class="nav-label nav-spark">⌘</span></RouterLink
      >
      <div class="nav-section">
        <span class="nav-label">API 实验室</span><span class="nav-label">10</span>
      </div>
      <RouterLink
        v-for="item in modules"
        :key="item.id"
        :to="`/lab/${item.id}`"
        class="nav-item"
        active-class="active"
        :title="collapsed ? item.title : undefined"
        @click="$emit('navigate')"
        ><AppIcon :name="item.icon" /><span class="nav-label">{{ item.title }}</span></RouterLink
      >
      <div class="nav-section"><span class="nav-label">综合实战</span></div>
      <RouterLink
        to="/board"
        class="nav-item"
        active-class="active"
        title="任务看板"
        @click="$emit('navigate')"
        ><AppIcon name="board" /><span class="nav-label">任务看板</span
        ><span class="nav-label tiny-tag">即将开始</span></RouterLink
      >
      <RouterLink
        to="/progress"
        class="nav-item"
        active-class="active"
        title="学习进度"
        @click="$emit('navigate')"
        ><AppIcon name="chart" /><span class="nav-label">学习进度</span></RouterLink
      >
    </nav>
    <div class="sidebar-bottom">
      <div class="side-progress nav-label">
        <div>
          <span>我的学习进度</span><strong>{{ progress.percent }}%</strong>
        </div>
        <progress
          :value="progress.mastered.length"
          :max="totalTopics"
          aria-label="总体掌握进度"
        /><small>已掌握 {{ progress.mastered.length }} / {{ totalTopics }} 个知识点</small>
      </div>
      <RouterLink
        to="/guide"
        class="nav-item"
        active-class="active"
        title="学习指南"
        @click="$emit('navigate')"
        ><AppIcon name="book" /><span class="nav-label">学习指南</span
        ><AppIcon class="nav-label trailing" name="external" :size="15"
      /></RouterLink>
      <div class="sidebar-version nav-label">
        <span class="status-dot" /> Vue 3 + TypeScript <span>v0.1.0</span>
      </div>
    </div>
  </div>
</template>
