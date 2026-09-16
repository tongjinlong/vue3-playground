import type { FileSystemTree } from '@webcontainer/api'

export function createVueProject(appCode: string): FileSystemTree {
  return {
    'package.json': {
      file: {
        contents: JSON.stringify(
          {
            scripts: {
              dev: 'vite',
            },

            dependencies: {
              vue: '^3.5.0',
            },

            devDependencies: {
              '@vitejs/plugin-vue': '^6.0.0',
              typescript: '^5.0.0',
              vite: '^7.0.0',
            },
          },
          null,
          2,
        ),
      },
    },

    'index.html': {
      file: {
        contents: `
<!doctype html>

<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Vue Playground</title>
  </head>

  <body>
    <div id="app"></div>

    <script
      type="module"
      src="/src/main.ts"
    ></script>
  </body>
</html>
        `.trim(),
      },
    },

    'vite.config.ts': {
      file: {
        contents: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
})
        `.trim(),
      },
    },

    'tsconfig.json': {
      file: {
        contents: JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2020',

              module: 'ESNext',

              moduleResolution: 'Bundler',

              strict: true,

              jsx: 'preserve',

              resolveJsonModule: true,

              isolatedModules: true,

              esModuleInterop: true,

              allowSyntheticDefaultImports: true,

              skipLibCheck: true,

              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            },

            include: ['src/**/*.ts', 'src/**/*.vue'],
          },
          null,
          2,
        ),
      },
    },

    src: {
      directory: {
        'main.ts': {
          file: {
            contents: `
import { createApp } from 'vue'

import App from './App.vue'

createApp(App).mount('#app')
            `.trim(),
          },
        },

        'App.vue': {
          file: {
            contents: appCode,
          },
        },
      },
    },
  }
}
