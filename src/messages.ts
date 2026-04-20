import { IntlMessageFormat } from 'intl-messageformat'
import type { Catalog, MessageId } from './keys.js'
import type { Messages, MessageVars, Direction } from './types.js'
import { en } from './locales/en.js'
import { PSEUDO_LOCALE, toPseudoLocale } from './pseudo.js'
import { resolveDir } from './rtl.js'

export interface DefaultMessages extends Messages {
  addCatalog(locale: string, catalog: Partial<Catalog>): void
  loadLocale(locale: string, loader: (locale: string) => Promise<Partial<Catalog>>): Promise<void>
}

export interface CreateMessagesOptions {
  initialLocale?: string
  catalogs?: Record<string, Partial<Catalog>>
  fallbackLocale?: string
}

interface CompiledEntry {
  source: string
  format: IntlMessageFormat
}

export function createDefaultMessages(opts: CreateMessagesOptions = {}): DefaultMessages {
  const fallbackLocale = opts.fallbackLocale ?? 'en'
  const catalogs: Record<string, Partial<Catalog>> = { en, ...(opts.catalogs ?? {}) }
  if (!catalogs[PSEUDO_LOCALE]) catalogs[PSEUDO_LOCALE] = toPseudoLocale(en)

  let locale = opts.initialLocale ?? fallbackLocale
  const compiled = new Map<string, CompiledEntry>()
  const listeners = new Set<() => void>()

  function compile(loc: string, id: MessageId): CompiledEntry | undefined {
    const source = catalogs[loc]?.[id]
    if (source == null) return undefined
    const cacheKey = `${loc}|${id}`
    const cached = compiled.get(cacheKey)
    if (cached && cached.source === source) return cached
    const format = new IntlMessageFormat(source, loc)
    const entry = { source, format }
    compiled.set(cacheKey, entry)
    return entry
  }

  function notify() {
    for (const l of listeners) l()
  }

  function invalidate(loc: string) {
    for (const key of compiled.keys()) {
      if (key.startsWith(`${loc}|`)) compiled.delete(key)
    }
  }

  return {
    t(id: MessageId, vars?: MessageVars): string {
      const entry = compile(locale, id) ?? compile(fallbackLocale, id)
      if (!entry) return id
      const out = entry.format.format(vars)
      return typeof out === 'string' ? out : String(out)
    },
    getLocale(): string {
      return locale
    },
    setLocale(next: string): void {
      if (next === locale) return
      locale = next
      notify()
    },
    getDir(): Direction {
      return resolveDir(locale)
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    addCatalog(loc: string, catalog: Partial<Catalog>): void {
      catalogs[loc] = { ...(catalogs[loc] ?? {}), ...catalog }
      invalidate(loc)
      if (loc === locale) notify()
    },
    async loadLocale(loc, loader): Promise<void> {
      const catalog = await loader(loc)
      this.addCatalog(loc, catalog)
    }
  }
}
