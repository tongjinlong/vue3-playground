<script setup lang="ts">
import { modules, totalTopics } from '@/data/modules'
import { useProgressStore } from '@/stores/progress'
import AppIcon from '@/components/AppIcon.vue'
const progress = useProgressStore()
</script>
<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">SMALL STEPS, REAL PROGRESS</div>
      <h1>你的每一步，都算数。</h1>
      <p>完成实验后，主动标记掌握，逐步点亮你的 Vue3 能力地图。</p>
    </div>
    <span class="pill">当前浏览器保存</span>
  </div>
  <section class="panel progress-summary">
    <span class="module-icon green"><AppIcon name="chart" :size="28" /></span>
    <div>
      <h2>
        {{ progress.mastered.length }} <span>/ {{ totalTopics }} 个知识点已掌握</span>
      </h2>
      <progress :value="progress.mastered.length" :max="totalTopics" aria-label="学习总进度" />
    </div>
    <strong>{{ progress.percent }}%</strong>
  </section>
  <section class="panel progress-list">
    <RouterLink v-for="item in modules" :key="item.id" :to="`/lab/${item.id}`"
      ><span class="module-icon" :class="item.color"><AppIcon :name="item.icon" /></span>
      <div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.english }}</p>
      </div>
      <progress
        :value="progress.count(item.id)"
        :max="item.topics.length"
        :aria-label="`${item.title}进度`" /><span
        >{{ progress.count(item.id) }} / {{ item.topics.length }}</span
      ><AppIcon name="arrow" :size="18"
    /></RouterLink>
  </section>
</template>
