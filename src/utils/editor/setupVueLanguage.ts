import * as monaco from 'monaco-editor-core'
import EditorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker'

import VueWorker from './vue.worker?worker'

import { activateAutoInsertion, activateMarkers, registerProviders } from '@volar/monaco'

import type { WorkerLanguageService } from '@volar/monaco/worker'

let setup = false

export function setupVueLanguage() {
  if (setup) return

  setup = true

  setupWorkers()
  setupVueProviders()
}

function setupWorkers() {
  const monacoEnvironment: monaco.Environment = {
    getWorker(_workerId, label) {
      if (label === 'vue') {
        return new VueWorker()
      }

      return new EditorWorker()
    },
  }

  Object.assign(globalThis, { MonacoEnvironment: monacoEnvironment })
}

function setupVueProviders() {
  const hasVue = monaco.languages.getLanguages().some((language) => language.id === 'vue')

  if (!hasVue) {
    monaco.languages.register({
      id: 'vue',
      extensions: ['.vue'],
    })
  }

  monaco.languages.onLanguage(
    'vue',

    () => {
      createVueWorker()
    },
  )
}

function createVueWorker() {
  const worker = monaco.editor.createWebWorker<WorkerLanguageService>({
    moduleId: 'vs/language/vue/vueWorker',
    label: 'vue',
  })

  const getSyncedUris = () => {
    return monaco.editor.getModels().map((model) => model.uri)
  }

  activateMarkers(worker, ['vue'], 'vue', getSyncedUris, monaco.editor)

  activateAutoInsertion(worker, ['vue'], getSyncedUris, monaco.editor)

  void registerProviders(worker, ['vue'], getSyncedUris, monaco.languages)
}
