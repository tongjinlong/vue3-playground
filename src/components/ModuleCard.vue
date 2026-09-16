<script setup lang="ts">
import type { LearningModule } from '@/data/modules'
import { useProgressStore } from '@/stores/progress'
import AppIcon from './AppIcon.vue'
defineProps<{ module: LearningModule; index: number }>()
const progress = useProgressStore()
</script>
<template>
  <RouterLink :to="`/lab/${module.id}`" class="module-card">
    <div class="module-card-top">
      <span class="module-icon" :class="module.color"
        ><AppIcon :name="module.icon" :size="23" /></span
      ><span class="module-number"
        >{{ String(index + 1).padStart(2, '0') }} <AppIcon name="arrow" :size="17"
      /></span>
    </div>
    <h3>
      {{ module.title }}<span>{{ module.english }}</span>
    </h3>
    <p>{{ module.description }}</p>
    <div class="topic-tags">
      <code v-for="topic in module.topics.slice(0, 3)" :key="topic">{{ topic }}</code
      ><span v-if="module.topics.length > 3">+{{ module.topics.length - 3 }}</span>
    </div>
    <div class="module-card-progress">
      <span>{{ module.topics.length }} 个知识点</span
      ><span :class="{ 'text-green': progress.count(module.id) }"
        >{{ progress.count(module.id) }} / {{ module.topics.length }} 已掌握</span
      >
    </div>
    <progress
      :value="progress.count(module.id)"
      :max="module.topics.length"
      :aria-label="`${module.title}掌握进度`"
    />
  </RouterLink>
</template>
