// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { humanize } from '../../forms'
import { record } from '../../values'
export interface ConfigField { key: string; title: string; description: string; required: boolean; schema: Record<string, unknown> }
export function configFields(schema: Record<string, unknown>): ConfigField[] {
  return Object.entries(record(schema.properties)).map(([key, raw]) => {
    const field = record(raw)
    return { key, title: typeof field.title === 'string' && field.title.trim() ? field.title : humanize(key), description: typeof field.description === 'string' ? field.description : '', required: Array.isArray(schema.required) && schema.required.includes(key), schema: field }
  })
}
export const stringArray = (field: Record<string, unknown>) => field.type === 'array' && record(field.items).type === 'string'
export function configErrors(schema: Record<string, unknown>, value: Record<string, unknown>, useDefaults = true): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of configFields(schema)) {
    const v = value[field.key] ?? (useDefaults ? field.schema.default : undefined), s = field.schema
    let message = ''
    if (v === undefined || v === null) {
      if (field.required) message = 'A value is required.'
    } else if (Array.isArray(s.enum) && !s.enum.includes(v)) message = 'Choose one of the available values.'
    else if (s.type === 'integer' || s.type === 'number') {
      if (typeof v !== 'number' || !Number.isFinite(v) || s.type === 'integer' && !Number.isInteger(v)) message = s.type === 'integer' ? 'Enter a whole number.' : 'Enter a number.'
      else if (typeof s.minimum === 'number' && v < s.minimum) message = `Enter at least ${s.minimum}.`
      else if (typeof s.maximum === 'number' && v > s.maximum) message = `Enter at most ${s.maximum}.`
    } else if (s.type === 'boolean' && typeof v !== 'boolean') message = 'Choose on or off.'
    else if (s.type === 'string') {
      if (typeof v !== 'string') message = 'Enter text.'
      else if (typeof s.minLength === 'number' && v.length < s.minLength) message = `Enter at least ${s.minLength} characters.`
      else if (typeof s.maxLength === 'number' && v.length > s.maxLength) message = `Enter at most ${s.maxLength} characters.`
      else if (typeof s.pattern === 'string') { try { if (!new RegExp(s.pattern).test(v)) message = 'Use the required format.' } catch { message = 'The declared format is unavailable.' } }
    } else if (s.type === 'array') {
      if (!Array.isArray(v)) message = 'Enter a list.'
      else if (typeof s.maxItems === 'number' && v.length > s.maxItems) message = `Use at most ${s.maxItems} entries.`
      else if (typeof s.minItems === 'number' && v.length < s.minItems) message = `Use at least ${s.minItems} entries.`
      else if (s.uniqueItems && new Set(v).size !== v.length) message = 'Remove duplicate entries.'
      else if (stringArray(s)) {
        const item = record(s.items)
        if (v.some(entry => typeof entry !== 'string' || typeof item.minLength === 'number' && entry.length < item.minLength || typeof item.maxLength === 'number' && entry.length > item.maxLength)) message = 'Each entry must match the declared text length.'
      }
    } else if (s.type === 'object' && (typeof v !== 'object' || Array.isArray(v))) message = 'Enter an object.'
    if (message) errors[field.key] = message
  }
  return errors
}
