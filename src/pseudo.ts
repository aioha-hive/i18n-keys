import type { Catalog, MessageId } from './keys.js'

const ACCENT_MAP: Record<string, string> = {
  a: 'à',
  b: 'ƀ',
  c: 'ç',
  d: 'ð',
  e: 'é',
  f: 'ƒ',
  g: 'ğ',
  h: 'ĥ',
  i: 'í',
  j: 'ĵ',
  k: 'ķ',
  l: 'ľ',
  m: 'ɱ',
  n: 'ñ',
  o: 'ó',
  p: 'ṕ',
  q: 'ʠ',
  r: 'ŕ',
  s: 'š',
  t: 'ţ',
  u: 'ú',
  v: 'ṽ',
  w: 'ŵ',
  x: 'ẋ',
  y: 'ý',
  z: 'ž',
  A: 'À',
  B: 'Ɓ',
  C: 'Ç',
  D: 'Ð',
  E: 'É',
  F: 'Ƒ',
  G: 'Ğ',
  H: 'Ĥ',
  I: 'Í',
  J: 'Ĵ',
  K: 'Ķ',
  L: 'Ľ',
  M: 'Ṁ',
  N: 'Ñ',
  O: 'Ó',
  P: 'Ṕ',
  Q: 'Ǫ',
  R: 'Ŕ',
  S: 'Š',
  T: 'Ţ',
  U: 'Ú',
  V: 'Ṽ',
  W: 'Ŵ',
  X: 'Ẋ',
  Y: 'Ý',
  Z: 'Ž'
}

function accentPart(s: string): string {
  let out = ''
  for (const ch of s) out += ACCENT_MAP[ch] ?? ch
  return out
}

function pseudoValue(value: string): string {
  let result = ''
  let i = 0
  while (i < value.length) {
    const ch = value[i]
    if (ch === '{') {
      let depth = 1
      let j = i + 1
      while (j < value.length && depth > 0) {
        if (value[j] === '{') depth++
        else if (value[j] === '}') depth--
        if (depth === 0) break
        j++
      }
      result += value.slice(i, j + 1)
      i = j + 1
    } else {
      let j = i
      while (j < value.length && value[j] !== '{') j++
      result += accentPart(value.slice(i, j))
      i = j
    }
  }
  return `[!! ${result} !!]`
}

export function toPseudoLocale(catalog: Catalog): Catalog {
  const out = {} as Catalog
  for (const id of Object.keys(catalog) as MessageId[]) {
    out[id] = pseudoValue(catalog[id])
  }
  return out
}

export const PSEUDO_LOCALE = 'en-XA'
