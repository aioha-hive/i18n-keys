import type { MessageId } from './keys.js'

export type MessageVars = Record<string, string | number>

export type Direction = 'ltr' | 'rtl'

export interface Messages {
  t(id: MessageId, vars?: MessageVars): string
  getLocale(): string
  setLocale(locale: string): void | Promise<void>
  getDir(): Direction
  subscribe(listener: () => void): () => void
}
