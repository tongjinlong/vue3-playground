<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import ModuleCard from '@/components/ModuleCard.vue'
import { modules, totalTopics, availableLessons } from '@/data/modules'
import { useProgressStore } from '@/stores/progress'
const progress = useProgressStore()
const filter = ref('all')
const filters = [
  { id: 'all', label: '全部模块' },
  { id: 'started', label: '学习中' },
  { id: 'unstarted', label: '未开始' },
]
const visibleModules = computed(() =>
  modules.filter(
    (item) =>
      filter.value === 'all' ||
      (filter.value === 'started' ? progress.count(item.id) > 0 : progress.count(item.id) === 0),
  ),
)
</script>
<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">YOUR VUE JOURNEY STARTS HERE</div>
      <h1>把知识点，变成你的能力。<span class="heading-dot">.</span></h1>
      <p>一个可以动手实验的 Vue3 学习空间。从理解 API，到构建真实应用。</p>
    </div>
    <RouterLink to="/guide" class="button secondary"
      ><AppIcon name="book" :size="17" /> 学习指南 <AppIcon name="arrow" :size="16"
    /></RouterLink>
  </div>
  <section class="welcome-banner">
    <div class="banner-content">
      <span class="banner-label"><i /> LEARN. BUILD. MASTER.</span>
      <h2>不止于读懂，<br />更在于<span>亲手实现。</span></h2>
      <p>
        在 API 实验室探索原理，在任务看板串联知识。<br />每一次实践，都是能力地图上的一个新坐标。
      </p>
      <RouterLink to="/lab/reactivity" class="button banner-button"
        >开始第一个实验 <AppIcon name="arrow" :size="18" /></RouterLink
      ><span class="banner-note">从 ref 与响应式基础开始</span>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="orbit orbit-one" />
      <div class="orbit orbit-two" />
      <div class="art-grid" />
      <span class="floating-code code-ref">const count = ref(0)</span
      ><span class="floating-code code-computed">computed(() =&gt; ✦)</span
      ><span class="floating-code code-vue">&lt;script setup&gt;</span>
      <div class="vue-crystal">
        <svg viewBox="0 0 100 90">
          <path fill="#73dfb2" d="M0 0h22l28 49L78 0h22L50 87Z" />
          <path fill="#244c40" d="M22 0h17l11 19L61 0h17L50 49Z" />
        </svg>
      </div>
      <span class="art-star star-one">✦</span><span class="art-star star-two">+</span
      ><span class="art-caption">BUILD YOUR OWN UNDERSTANDING</span>
    </div>
  </section>
  <section class="stats-grid" aria-label="学习统计">
    <div class="stat-card">
      <span class="stat-icon green"><AppIcon name="layers" /></span>
      <div>
        <span>学习模块</span><strong>10 <small>个分类</small></strong>
      </div>
      <span class="stat-detail">系统化学习</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon blue"><AppIcon name="code" /></span>
      <div>
        <span>知识点地图</span><strong>{{ totalTopics }} <small>个知识点</small></strong>
      </div>
      <span class="stat-detail">{{ availableLessons.length }} 个实验已开放</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon purple"><AppIcon name="check" /></span>
      <div>
        <span>已掌握</span
        ><strong
          >{{ progress.mastered.length }} <small>/ {{ totalTopics }}</small></strong
        >
      </div>
      <span class="stat-detail">积累每一点进步</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon orange"><AppIcon name="chart" /></span>
      <div>
        <span>整体进度</span><strong>{{ progress.percent }}<small>%</small></strong>
      </div>
      <div class="mini-ring" :style="{ '--progress': `${progress.percent}%` }">
        <span>{{ progress.percent }}%</span>
      </div>
    </div>
  </section>
  <section class="module-section">
    <div class="section-heading">
      <div>
        <h2><AppIcon name="flask" :size="21" /> API 实验室 <span>10 MODULES</span></h2>
        <p>选择一个模块，从小实验开始，逐步建立完整的知识体系。</p>
      </div>
      <div class="filter-group" role="group" aria-label="筛选学习模块">
        <button
          v-for="item in filters"
          :key="item.id"
          :class="{ active: filter === item.id }"
          :aria-pressed="filter === item.id"
          @click="filter = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
    <div class="module-grid">
      <ModuleCard
        v-for="item in visibleModules"
        :key="item.id"
        :module="item"
        :index="modules.indexOf(item)"
      />
    </div>
    <div v-if="!visibleModules.length" class="empty-state">
      <AppIcon name="flask" :size="32" />
      <h3>你的第一个实验，正在等你</h3>
      <p>完成实验并标记掌握后，对应模块会出现在这里。</p>
      <RouterLink to="/lab/reactivity" class="button primary"
        >开始学习 <AppIcon name="arrow" :size="16"
      /></RouterLink>
    </div>
  </section>
  <RouterLink to="/board" class="practice-banner"
    ><span class="module-icon green"><AppIcon name="board" :size="25" /></span>
    <div>
      <span class="eyebrow">PUT IT ALL TOGETHER</span>
      <h3>从单个 API，到一个完整的任务看板。</h3>
      <p>在综合实战中，串联路由、状态管理与组件协作。</p>
    </div>
    <span class="practice-link">探索综合实战 <AppIcon name="arrow" :size="18" /></span
  ></RouterLink>
</template>
