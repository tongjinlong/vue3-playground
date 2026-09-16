/// <reference lib="dom" />
import { expect, test } from '@playwright/test'

test('导航、实验、主题与掌握度在生产构建中可用并持久化', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.module-card')).toHaveCount(10)
  await page.getByRole('button', { name: '深色主题', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: '浅色主题', exact: true }).click()
  await page.getByRole('button', { name: '收起侧边栏' }).click()
  await expect(page.locator('.app-shell')).toHaveClass(/is-collapsed/)
  await page.getByRole('button', { name: '展开侧边栏' }).click()
  await page.getByRole('textbox', { name: '搜索 API 或模块' }).fill('ref')
  await page
    .locator('.search-results')
    .getByRole('link', { name: /响应式基础/ })
    .click()
  await expect(page).toHaveURL(/\/lab\/reactivity/)
  await page.getByRole('button', { name: '增加计数', exact: true }).click()
  await expect(page.locator('output')).toHaveText('1')
  await expect(page.getByRole('log')).toContainText('count.value → 1')
  await page.getByRole('button', { name: '标记为已掌握' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: '已掌握 · 撤销标记' })).toBeVisible()
  await page.getByRole('button', { name: 'reactive', exact: true }).click()
  await expect(page.getByRole('button', { name: '标记为已掌握' })).toBeDisabled()
  await page.goto('/progress')
  await expect(page.locator('.progress-summary')).toContainText('1 / 80')
})

test('手机导航支持焦点管理、Escape 关闭且无横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '打开导航' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: '打开导航' })).toBeFocused()
  await page.getByRole('button', { name: '打开导航' }).click()
  await page.getByRole('dialog').getByRole('link', { name: '任务看板' }).click()
  await expect(page.getByRole('heading', { name: '任务看板', exact: true })).toBeVisible()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  for (const path of ['/', '/lab/reactivity', '/progress', '/guide', '/board']) {
    await page.goto(path)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

test('跟随系统响应主题变化，错误地址提供返回入口', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.goto('/lab/invalid')
  await expect(page.getByRole('link', { name: '返回能力总览' })).toBeVisible()
})
