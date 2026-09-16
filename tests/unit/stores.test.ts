import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { preferencesKey, usePreferencesStore } from '@/stores/preferences'
import { progressKey, useProgressStore } from '@/stores/progress'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})
describe('本地学习数据', () => {
  it('恢复合法偏好，主题与折叠状态均持久化', () => {
    localStorage.setItem(preferencesKey, JSON.stringify({ theme: 'dark', collapsed: true }))
    const store = usePreferencesStore()
    expect(store.theme).toBe('dark')
    expect(store.collapsed).toBe(true)
    store.setTheme('light')
    store.toggleSidebar()
    expect(JSON.parse(localStorage.getItem(preferencesKey)!)).toEqual({
      theme: 'light',
      collapsed: false,
    })
  })
  it('只恢复已开放实验的进度并去重，可撤销掌握标记', () => {
    localStorage.setItem(
      progressKey,
      JSON.stringify(['reactivity/ref', 'reactivity/ref', 'fake', 2]),
    )
    const store = useProgressStore()
    expect(store.mastered).toEqual(['reactivity/ref'])
    store.toggle('fake')
    expect(store.mastered).toHaveLength(1)
    expect(store.count('reactivity')).toBe(1)
    expect(store.percent).toBe(1)
    store.toggle('reactivity/ref')
    expect(store.mastered).toEqual([])
    expect(localStorage.getItem(progressKey)).toBe('[]')
  })
  it('损坏的 JSON 不阻止应用启动，成功保存后恢复', () => {
    localStorage.setItem(preferencesKey, '{bad')
    localStorage.setItem(progressKey, '{bad')
    const preferences = usePreferencesStore()
    const progress = useProgressStore()
    expect(preferences.theme).toBe('system')
    expect(preferences.storageError).toBe(true)
    expect(progress.mastered).toEqual([])
    expect(progress.storageError).toBe(true)
    preferences.setTheme('system')
    progress.toggle('reactivity/ref')
    expect(preferences.storageError).toBe(false)
    expect(progress.storageError).toBe(false)
  })
  it('无效结构使用默认值', () => {
    localStorage.setItem(preferencesKey, JSON.stringify({ theme: 'sepia', collapsed: 'yes' }))
    localStorage.setItem(progressKey, '{}')
    expect(usePreferencesStore().theme).toBe('system')
    expect(usePreferencesStore().collapsed).toBe(false)
    expect(useProgressStore().mastered).toEqual([])
  })
  it('存储不可用时保留本次状态并报告未保存', () => {
    const preferences = usePreferencesStore()
    const progress = useProgressStore()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    preferences.setTheme('dark')
    progress.toggle('reactivity/ref')
    expect(preferences.theme).toBe('dark')
    expect(preferences.storageError).toBe(true)
    expect(progress.mastered).toEqual(['reactivity/ref'])
    expect(progress.storageError).toBe(true)
  })
})
