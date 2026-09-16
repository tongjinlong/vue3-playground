<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppIcon from '@/components/AppIcon.vue'
import { usePreferencesStore, type ThemeMode } from '@/stores/preferences'
import { useProgressStore } from '@/stores/progress'
import { useTheme } from '@/composables/useTheme'
import { modules } from '@/data/modules'

const preferences = usePreferencesStore()
const progress = useProgressStore()
useTheme()
const route = useRoute()
const mobileNav = ref<HTMLDialogElement>()
const searchInput = ref<HTMLInputElement>()
const query = ref('')
const module = computed(() => modules.find((item) => item.id === route.params.moduleId))
const title = computed(
  () =>
    module.value?.title || (typeof route.meta.title === 'string' ? route.meta.title : '能力总览'),
)
const results = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return []
  return modules.filter((item) =>
    `${item.title} ${item.english} ${item.topics.join(' ')}`.toLowerCase().includes(term),
  )
})
const themeModes: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: '浅色主题', icon: 'sun' },
  { value: 'dark', label: '深色主题', icon: 'moon' },
  { value: 'system', label: '跟随系统', icon: 'monitor' },
]
function closeNavigation() {
  mobileNav.value?.close()
}
function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
  if (event.key === 'Escape') query.value = ''
}
watch(
  () => route.fullPath,
  () => {
    query.value = ''
    closeNavigation()
  },
)
watch(
  title,
  (value) => {
    document.title = `${value} · Vue3 Playground`
  },
  { immediate: true },
)
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
<template>
  <div class="app-shell" :class="{ 'is-collapsed': preferences.collapsed }">
    <a class="skip-link" href="#main-content">跳转到主要内容</a>
    <aside class="desktop-sidebar"><AppSidebar :collapsed="preferences.collapsed" /></aside>
    <dialog
      ref="mobileNav"
      class="mobile-drawer"
      aria-label="导航菜单"
      @click="
        (event) => {
          if (event.target === mobileNav) closeNavigation()
        }
      "
    >
      <button class="icon-button drawer-close" aria-label="关闭导航" @click="closeNavigation">
        <AppIcon name="close" /></button
      ><AppSidebar @navigate="closeNavigation" />
    </dialog>
    <div class="workspace">
      <header class="topbar">
        <div class="breadcrumbs">
          <button
            class="icon-button desktop-toggle"
            :aria-label="preferences.collapsed ? '展开侧边栏' : '收起侧边栏'"
            @click="preferences.toggleSidebar"
          >
            <AppIcon name="panel" /></button
          ><button
            class="icon-button mobile-toggle"
            aria-label="打开导航"
            @click="mobileNav?.showModal()"
          >
            <AppIcon name="menu" /></button
          ><span class="breadcrumb-root">工作空间</span><span class="breadcrumb-root slash">/</span
          ><span>{{ title }}</span>
        </div>
        <div class="topbar-actions">
          <div class="global-search">
            <AppIcon name="search" :size="17" /><input
              ref="searchInput"
              v-model="query"
              aria-label="搜索 API 或模块"
              placeholder="搜索 API 或模块…"
              autocomplete="off"
            /><kbd>⌘ K</kbd>
            <div v-if="query.trim()" class="search-results">
              <small>模块搜索 · {{ results.length }} 个结果</small
              ><RouterLink v-for="item in results" :key="item.id" :to="`/lab/${item.id}`"
                ><AppIcon :name="item.icon" /><span
                  >{{ item.title }}<small>{{ item.english }}</small></span
                ><AppIcon name="arrow" :size="16"
              /></RouterLink>
              <p v-if="!results.length">没有找到匹配的模块，试试 ref 或路由。</p>
            </div>
          </div>
          <div class="theme-switch" role="group" aria-label="主题设置">
            <button
              v-for="mode in themeModes"
              :key="mode.value"
              class="icon-button"
              :class="{ selected: preferences.theme === mode.value }"
              :aria-label="mode.label"
              :aria-pressed="preferences.theme === mode.value"
              :title="mode.label"
              @click="preferences.setTheme(mode.value)"
            >
              <AppIcon :name="mode.icon" :size="16" />
            </button>
          </div>
          <span class="avatar" title="本地学习空间">V</span>
        </div>
      </header>
      <main id="main-content" class="main-content" tabindex="-1">
        <p
          v-if="preferences.storageError || progress.storageError"
          class="storage-notice"
          role="status"
        >
          浏览器暂时无法保存设置，本次操作仍然有效，刷新后可能丢失。
        </p>
        <RouterView :key="route.path" />
      </main>
      <footer class="page-footer">
        <span>Learn by doing. 用实践点亮每一个知识点。</span
        ><span><i class="status-dot" /> 本地学习空间</span>
      </footer>
    </div>
  </div>
</template>
