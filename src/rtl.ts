import type { Direction } from './types.js'

const RTL_LANGS = new Set(['ar', 'arc', 'ckb', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ps', 'sd', 'ur', 'uz-Arab', 'yi'])

export function resolveDir(locale: string): Direction {
  try {
    const loc = new Intl.Locale(locale)
    const info = (loc as unknown as { textInfo?: { direction?: Direction } }).textInfo
    if (info?.direction === 'rtl' || info?.direction === 'ltr') return info.direction
    const lang = loc.language
    if (RTL_LANGS.has(lang)) return 'rtl'
  } catch {
    const lang = locale.split('-')[0]!.toLowerCase()
    if (RTL_LANGS.has(lang)) return 'rtl'
  }
  return 'ltr'
}
