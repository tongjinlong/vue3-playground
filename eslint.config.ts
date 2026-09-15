import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/', 'node_modules/'],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  ...pluginVue.configs['flat/essential'],

  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
    },
  },
)
