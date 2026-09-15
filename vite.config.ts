import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { parseEnv } from './src/config/env'

export default defineConfig(({ mode }) => {
  parseEnv({
    ...loadEnv(mode, process.cwd(), 'VITE_'),
    ...process.env,
  })

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? 'local'),
    },

    server: {
      port: 5173,
      strictPort: true,
    },

    build: {
      sourcemap: false,
    },

    test: {
      environment: 'jsdom',
      globals: false,
      include: ['tests/unit/**/*.test.ts'],
      clearMocks: true,
      restoreMocks: true,

      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/**/*.d.ts'],
        thresholds: {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 70,
        },
      },
    },
  }
})
