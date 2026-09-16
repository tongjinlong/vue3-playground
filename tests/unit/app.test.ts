import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { usePreferencesStore } from '@/stores/preferences'
import { useProgressStore } from '@/stores/progress'

vi.mock('@/components/CodeEditor.vue', () => ({
  default: {
    name: 'CodeEditorStub',
    template: '<div class="code-editor-stub" />',
  },
}))

const closeDialog = vi.fn()
const showDialog = vi.fn()
enableAutoUnmount(afterEach)
beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  HTMLDialogElement.prototype.close = closeDialog
  HTMLDialogElement.prototype.showModal = showDialog
})
afterEach(() => vi.unstubAllGlobals())

async function render(path = '/') {
  const router = createAppRouter(createMemoryHistory())
  const pinia = createPinia()
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [pinia, router] }, attachTo: document.body })
  await flushPromises()
  return { wrapper, router, pinia }
}

describe('学习工作空间', () => {
  it('展示真实模块总数，支持筛选、搜索、主题和侧栏操作', async () => {
    const { wrapper, pinia } = await render()
    expect(wrapper.findAll('.module-card')).toHaveLength(10)
    await wrapper.findAll('.filter-group button')[1]!.trigger('click')
    expect(wrapper.text()).toContain('你的第一个实验，正在等你')
    await wrapper.findAll('.filter-group button')[2]!.trigger('click')
    expect(wrapper.findAll('.module-card')).toHaveLength(10)
    await wrapper.get('[aria-label="深色主题"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    await wrapper.get('[aria-label="浅色主题"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    await wrapper.get('[aria-label="收起侧边栏"]').trigger('click')
    expect(wrapper.get('.app-shell').classes()).toContain('is-collapsed')
    await wrapper.get('[aria-label="展开侧边栏"]').trigger('click')
    const search = wrapper.get('input')
    await search.setValue('computed')
    expect(wrapper.findAll('.search-results a')).toHaveLength(1)
    await search.setValue('没有这个API')
    expect(wrapper.text()).toContain('没有找到匹配的模块')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(wrapper.find('.search-results').exists()).toBe(false)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(document.activeElement).toBe(search.element)
    await wrapper.get('[aria-label="打开导航"]').trigger('click')
    expect(showDialog).toHaveBeenCalled()
    await wrapper.get('[aria-label="关闭导航"]').trigger('click')
    expect(closeDialog).toHaveBeenCalled()
    usePreferencesStore(pinia).storageError = true
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toContain('暂时无法保存')
  })

  it('贯通 ref 实验、控制台、掌握标记与总览统计', async () => {
    const { wrapper, router, pinia } = await render('/lab/reactivity')
    await wrapper.get('[aria-label="增加计数"]').trigger('click')
    expect(wrapper.get('output').text()).toBe('1')
    expect(wrapper.get('[role="log"]').text()).toContain('count.value → 1')
    await wrapper.get('[aria-label="减少计数"]').trigger('click')
    expect(wrapper.get('output').text()).toBe('0')
    const byText = (text: string) =>
      wrapper.findAll('button').find((button) => button.text() === text)!
    await byText('重置').trigger('click')
    expect(wrapper.get('[role="log"]').text()).toContain('reset → 0')
    await byText('清空').trigger('click')
    expect(wrapper.get('[role="log"]').text()).toContain('操作计数器')
    await byText('标记为已掌握').trigger('click')
    expect(useProgressStore(pinia).mastered).toEqual(['reactivity/ref'])
    await byText('已掌握 · 撤销标记').trigger('click')
    expect(useProgressStore(pinia).mastered).toEqual([])
    await byText('标记为已掌握').trigger('click')
    await wrapper.findAll('.lesson-pills button')[1]!.trigger('click')
    expect(wrapper.get('.mastery-bar button').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('这个实验还在计划中')
    await router.push('/')
    await flushPromises()
    await wrapper.findAll('.filter-group button')[1]!.trigger('click')
    expect(wrapper.findAll('.module-card')).toHaveLength(1)
    await router.push('/progress')
    await flushPromises()
    expect(wrapper.get('.progress-summary').text()).toContain('1')
  })

  it('所有模块及预留页面可访问，非法路径进入 404', async () => {
    const { wrapper, router } = await render('/lab/communication')
    expect(wrapper.get('h1').text()).toBe('组件通信')
    for (const path of ['/board', '/guide', '/progress']) {
      await router.push(path)
      await flushPromises()
      expect(wrapper.find('h1').exists()).toBe(true)
    }
    await router.push('/lab/unknown')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('not-found')
    await router.push('/missing')
    await flushPromises()
    expect(wrapper.text()).toContain('这个坐标还没有内容')
  })
})
