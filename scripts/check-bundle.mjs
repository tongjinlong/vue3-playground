import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const assetsDir = fileURLToPath(new URL('../dist/assets/', import.meta.url))

const files = readdirSync(assetsDir, {
  recursive: true,
}).filter((file) => file.endsWith('.js'))

if (files.length === 0) {
  throw new Error('No JavaScript build assets found')
}

const totalBytes = files.reduce((total, file) => {
  const content = readFileSync(join(assetsDir, file))
  return total + gzipSync(content).byteLength
}, 0)

const limitBytes = 300 * 1024

console.log(`JavaScript gzip total: ${(totalBytes / 1024).toFixed(1)} KiB`)

if (totalBytes > limitBytes) {
  throw new Error(`JavaScript gzip total exceeds ${limitBytes / 1024} KiB`)
}
