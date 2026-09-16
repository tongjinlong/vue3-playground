import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { parseEnv } from './src/config/env.ts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  parseEnv({
    ...loadEnv(mode, process.cwd(), 'VITE_'),
    ...process.env,
  })

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
      }),

      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
    ],

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
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },

    build: {
      sourcemap: true,
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
        exclude: [
          'src/main.ts',
          'src/**/*.d.ts',
          'src/components/CodeEditor.vue',
          'src/composables/useCodeEditor.ts',
          'src/composables/useCodeRunner.ts',
          'src/playground/**',
          'src/utils/editor/**',
        ],
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
