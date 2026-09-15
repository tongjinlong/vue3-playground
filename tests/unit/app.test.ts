import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'

enableAutoUnmount(afterEach)

describe('App', () => {
  it('点击按钮后更新计数', async () => {
    const wrapper = mount(App)
    const button = wrapper.get('button.counter')

    expect(button.text()).toBe('Count is 0')

    await button.trigger('click')

    expect(button.text()).toBe('Count is 1')
  })
})
