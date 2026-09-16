import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'

import type * as monaco from 'monaco-editor-core'

import type { LanguageServiceEnvironment } from '@volar/language-service'

import { createTypeScriptWorkerLanguageService } from '@volar/monaco/worker'

import { createVueLanguagePlugin, getDefaultCompilerOptions } from '@vue/language-core'

import { createVueLanguageServicePlugins } from '@vue/language-service'

import { createNpmFileSystem } from '@volar/jsdelivr'

import { create as createTypeScriptServicePlugin } from 'volar-service-typescript'

import ts from 'typescript'

import { URI } from 'vscode-uri'

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext) => {
    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ESNext,

      module: ts.ModuleKind.ESNext,

      moduleResolution: ts.ModuleResolutionKind.Bundler,

      jsx: ts.JsxEmit.Preserve,

      allowJs: true,

      strict: true,

      allowSyntheticDefaultImports: true,

      esModuleInterop: true,
    }

    const vueCompilerOptions = {
      ...getDefaultCompilerOptions(),

      target: 3.5,

      strictTemplates: true,
    }

    const env: LanguageServiceEnvironment = {
      workspaceFolders: [URI.parse('file:///')],

      fs: createNpmFileSystem(),
    }

    const vueLanguageServicePlugins = createVueLanguageServicePlugins(ts).filter(
      (plugin) =>
        plugin.name !== 'emmet' &&
        plugin.name !== 'pug-beautify' &&
        plugin.name !== 'vue-template (jade)',
    )

    return createTypeScriptWorkerLanguageService({
      typescript: ts,

      compilerOptions,

      workerContext: ctx,

      env,

      uriConverter: {
        asFileName: (uri) => uri.fsPath,

        asUri: (fileName) => URI.file(fileName),
      },

      languagePlugins: [
        createVueLanguagePlugin(ts, compilerOptions, vueCompilerOptions, (uri) => uri.fsPath),
      ],

      languageServicePlugins: [...createTypeScriptServicePlugin(ts), ...vueLanguageServicePlugins],
    })
  })
}
