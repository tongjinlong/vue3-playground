import * as monaco from 'monaco-editor-core'
import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import css from 'shiki/langs/css.mjs'
import html from 'shiki/langs/html.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import scss from 'shiki/langs/scss.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import vue from 'shiki/langs/vue.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'

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
  const highlighter = await createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [vue, typescript, javascript, html, css, scss, json],
    engine: createJavaScriptRegexEngine(),
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
