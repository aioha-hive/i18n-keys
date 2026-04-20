// Verifies that every locale in src/locales covers the exact set of keys declared in src/keys.ts.
// Run in CI via `pnpm check`.
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const localesDir = resolve(here, '../src/locales')
const keysSrc = readFileSync(resolve(here, '../src/keys.ts'), 'utf8')

const declared = [...keysSrc.matchAll(/'([a-z][a-zA-Z0-9.]+)'/g)].map((m) => m[1])
const declaredSet = new Set(declared)

const files = readdirSync(localesDir).filter((f) => f.endsWith('.json'))
let failed = false

for (const file of files) {
  const locale = file.replace(/\.json$/, '')
  const catalog = JSON.parse(readFileSync(resolve(localesDir, file), 'utf8'))
  const catalogSet = new Set(Object.keys(catalog))
  const missing = [...declaredSet].filter((k) => !catalogSet.has(k))
  const extra = [...catalogSet].filter((k) => !declaredSet.has(k))
  if (missing.length || extra.length) {
    failed = true
    console.error(`[${locale}] FAIL`)
    if (missing.length) console.error(`  missing: ${missing.join(', ')}`)
    if (extra.length) console.error(`  extra:   ${extra.join(', ')}`)
  } else {
    console.log(`[${locale}] OK — ${Object.keys(catalog).length} keys`)
  }
}

if (failed) process.exit(1)
console.log(`\nAll ${files.length} locale(s) match the ${declared.length} declared keys.`)
