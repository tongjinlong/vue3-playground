// Monaco's internal worker entry ships JavaScript without a declaration file.
declare module 'monaco-editor-core/esm/vs/editor/editor.worker' {
  import type { worker } from 'monaco-editor-core'

  export function initialize(
    factory: ((context: worker.IWorkerContext, createData: unknown) => object) | null,
  ): void
}
