import { describe, expect, it } from 'vitest'
import { parseEnv } from '@/config/env'

describe('parseEnv', () => {
  it('接受同源 API 路径', () => {
    const env = parseEnv({
      VITE_APP_TITLE: 'Enterprise App',
      VITE_API_BASE_URL: '/api',
    })

    expect(env.VITE_API_BASE_URL).toBe('/api')
  })

  it('接受完整 HTTPS 地址', () => {
    const env = parseEnv({
      VITE_APP_TITLE: 'Enterprise App',
      VITE_API_BASE_URL: 'https://api.example.com',
    })

    expect(env.VITE_API_BASE_URL).toBe('https://api.example.com')
  })

  it('拒绝缺少的必填配置', () => {
    expect(() =>
      parseEnv({
        VITE_API_BASE_URL: '/api',
      }),
    ).toThrow('VITE_APP_TITLE')
  })

  it('拒绝错误的 API 地址', () => {
    expect(() =>
      parseEnv({
        VITE_APP_TITLE: 'Enterprise App',
        VITE_API_BASE_URL: 'api',
      }),
    ).toThrow('VITE_API_BASE_URL')
  })
})
