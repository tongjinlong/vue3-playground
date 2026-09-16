import { setupMonaco } from '@/utils/editor/setupMonaco'
import * as monaco from 'monaco-editor-core'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

interface UseCodeEditorOptions {
  code: MaybeRefOrGetter<string>
  language?: Ref<string>
  theme?: string
  filePath?: string
}

export function useCodeEditor({
  code,
  language,
  theme = 'github-light',
  filePath = '/src/App.vue',
}: UseCodeEditorOptions) {
  const codeRef = ref<HTMLDivElement | null>(null)

  const currentCode = ref<string | undefined>('')
  const originalCode = ref<string | undefined>('')

  let editor: monaco.editor.IStandaloneCodeEditor | null = null

  // editor.IStandaloneCodeEditor | null = null

  /**
   * Monaco 内容改变监听
   */
  let changeDisposable: monaco.IDisposable | null = null

  let model: monaco.editor.ITextModel | null = null

  onMounted(async () => {
    // 先初始化 shiki
    await setupMonaco()

    const container = codeRef.value

    if (!container) return

    const initialCode = toValue(code)

    originalCode.value = initialCode
    currentCode.value = initialCode

    model = monaco.editor.createModel(
      initialCode,
      toValue(language) || 'typescript',
      monaco.Uri.parse(`file://${filePath}`),
    )

    editor = monaco.editor.create(container, {
      model,

      theme,

      readOnly: false,

      minimap: {
        enabled: false,
      },

      automaticLayout: true,

      scrollBeyondLastLine: false,

      fontSize: 14,

      lineHeight: 22,

      padding: {
        top: 12,
        bottom: 12,
      },

      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    })

    changeDisposable = editor.onDidChangeModelContent(() => {
      currentCode.value = editor?.getValue() ?? ''
    })
  })

  /**
   * 获取 Monaco 当前代码
   */
  function getCode() {
    return editor?.getValue() ?? ''
  }

  /**
   * 修改 Monaco 代码
   */
  function setCode(value: string) {
    editor?.setValue(value)
  }

  /**
   * 恢复初始化源码
   */
  function reset() {
    editor?.setValue(originalCode.value || '')
  }

  watch(
    () => toValue(code),
    (value) => {
      originalCode.value = value
      currentCode.value = value

      if (editor?.getValue() !== value) {
        editor?.setValue(value)
      }
    },
  )

  watch(
    () => toValue(language),
    (value) => {
      const model = editor?.getModel()

      if (model && value && model.getLanguageId() !== value) {
        monaco.editor.setModelLanguage(model, value)
      }
    },
  )

  onBeforeUnmount(() => {
    /**
     * 先销毁事件监听
     */
    changeDisposable?.dispose()

    editor?.dispose()

    model?.dispose()

    changeDisposable = null
    editor = null
    model = null
  })

  return { editorRef: codeRef, currentCode, getCode, setCode, reset }
}
