import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'

/** 在布局层调用一次；store 保存选择，这里负责浏览器副作用。 */
export function useTheme() {
  const preferences = usePreferencesStore()
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const systemDark = ref(media.matches)
  function onChange(event: MediaQueryListEvent) {
    systemDark.value = event.matches
  }
  onMounted(() => media.addEventListener('change', onChange))
  onUnmounted(() => media.removeEventListener('change', onChange))
  watchEffect(() => {
    const dark =
      preferences.theme === 'dark' || (preferences.theme === 'system' && systemDark.value)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  })
}
