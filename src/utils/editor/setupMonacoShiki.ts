import * as monaco from 'monaco-editor-core'
import { createHighlighter } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'

let setupPromise: Promise<void> | null = null

export function setupMonacoShiki() {
  // 防止多个 CodeEditor 重复初始化 shiki
  if (setupPromise) {
    return setupPromise
  }

  setupPromise = setup()

  return setupPromise
}

async function setup() {
  /**
   * 1. 创建 Shiki Highlighter
   */
  const highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],

    langs: ['vue', 'typescript', 'javascript', 'html', 'css', 'scss', 'json'],
  })

  /**
   * 2. 注册 Monaco 语言
   */
  registerLanguage('vue')
  registerLanguage('typescript')
  registerLanguage('javascript')
  registerLanguage('html')
  registerLanguage('css')
  registerLanguage('scss')
  registerLanguage('json')

  /**
   * 将 shiki 接入 Monaco
   */
  shikiToMonaco(highlighter, monaco)
}

/**
 * 防止重复注册语言
 */
function registerLanguage(id: string) {
  const exists = monaco.languages.getLanguages().some((language) => language.id === id)

  if (exists) return

  monaco.languages.register({
    id,
  })
}
