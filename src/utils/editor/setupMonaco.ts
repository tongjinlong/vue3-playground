import { setupMonacoShiki } from './setupMonacoShiki'

import { setupVueLanguage } from './setupVueLanguage'

let setupPromise: Promise<void> | null = null

export function setupMonaco() {
  if (setupPromise) {
    return setupPromise
  }

  setupPromise = setup()

  return setupPromise
}

async function setup() {
  /**
   * ① Monaco Worker / Volar
   */
  setupVueLanguage()

  /**
   * ② Shiki
   */
  await setupMonacoShiki()
}
