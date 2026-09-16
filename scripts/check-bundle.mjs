import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const assetsDir = fileURLToPath(new URL('../dist/assets/', import.meta.url))
const indexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))

const files = readdirSync(assetsDir, {
  recursive: true,
}).filter((file) => file.endsWith('.js'))

if (files.length === 0) {
  throw new Error('No JavaScript build assets found')
}

const sizes = new Map(
  files.map((file) => {
    const content = readFileSync(join(assetsDir, file))

    return [file, gzipSync(content).byteLength]
  }),
)

const indexHtml = readFileSync(indexPath, 'utf8')
const entryFiles = new Set(
  [...indexHtml.matchAll(/<script\b[^>]*\bsrc="\/assets\/([^"]+\.js)"/g)].map((match) => match[1]),
)

if (entryFiles.size === 0) {
  throw new Error('No JavaScript entry assets found in dist/index.html')
}

const groups = {
  initial: files.filter((file) => entryFiles.has(file)),
  deferred: files.filter((file) => !entryFiles.has(file) && !file.includes('.worker-')),
  workers: files.filter((file) => file.includes('.worker-')),
}

const limits = {
  initial: 300 * 1024,
  deferred: 1100 * 1024,
  workers: 1800 * 1024,
}

for (const [group, groupFiles] of Object.entries(groups)) {
  const totalBytes = groupFiles.reduce((total, file) => total + sizes.get(file), 0)
  const limitBytes = limits[group]

  console.log(
    `${group} JavaScript gzip total: ${(totalBytes / 1024).toFixed(1)} KiB / ${limitBytes / 1024} KiB`,
  )

  if (totalBytes > limitBytes) {
    throw new Error(`${group} JavaScript gzip total exceeds ${limitBytes / 1024} KiB`)
  }
}

const totalBytes = files.reduce((total, file) => {
  return total + sizes.get(file)
}, 0)
console.log(`all JavaScript gzip total: ${(totalBytes / 1024).toFixed(1)} KiB`)
