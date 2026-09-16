import { defineStore } from 'pinia'
import { ref } from 'vue'
export type ThemeMode = 'light' | 'dark' | 'system'
export const preferencesKey = 'vue-playground:preferences:v1'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<ThemeMode>('system')
  const collapsed = ref(false)
  const storageError = ref(false)
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(preferencesKey) || 'null')
    if (saved && typeof saved === 'object') {
      if (
        'theme' in saved &&
        (saved.theme === 'light' || saved.theme === 'dark' || saved.theme === 'system')
      )
        theme.value = saved.theme
      if ('collapsed' in saved && typeof saved.collapsed === 'boolean')
        collapsed.value = saved.collapsed
    }
  } catch {
    storageError.value = true
  }
  function save() {
    try {
      localStorage.setItem(
        preferencesKey,
        JSON.stringify({ theme: theme.value, collapsed: collapsed.value }),
      )
      storageError.value = false
    } catch {
      storageError.value = true
    }
  }
  function setTheme(value: ThemeMode) {
    theme.value = value
    save()
  }
  function toggleSidebar() {
    collapsed.value = !collapsed.value
    save()
  }
  return { theme, collapsed, storageError, setTheme, toggleSidebar }
})
