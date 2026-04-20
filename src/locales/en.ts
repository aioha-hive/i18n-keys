import type { Catalog } from '../keys.js'
import enJson from './en.json' with { type: 'json' }

export const en: Catalog = enJson as Catalog
export default en
