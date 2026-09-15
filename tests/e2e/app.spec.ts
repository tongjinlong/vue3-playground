import { expect, test } from '@playwright/test'

test('生产构建可以打开并完成计数操作', async ({ page }) => {
  await page.goto('/')

  const initialButton = page.getByRole('button', {
    name: 'Count is 0',
  })

  await expect(initialButton).toBeVisible()
  await initialButton.click()

  await expect(
    page.getByRole('button', {
      name: 'Count is 1',
    }),
  ).toBeVisible()
})
