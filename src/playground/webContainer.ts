import { WebContainer } from '@webcontainer/api'

let instancePromise: Promise<WebContainer> | null = null

export function getWebContainer() {
  if (!instancePromise) {
    instancePromise = WebContainer.boot()
  }

  return instancePromise
}
